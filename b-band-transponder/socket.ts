import WebSocket from "ws";
import api from "./api";
import runDevServer from "./dev-server";

interface PairSpread {
  pair: string;
  spread_percent: number;
}
interface SubscribeMessage {
  type: string;
  token: string;
  pair: string;
}

interface PairSubscription {
  pair: string;
  spread_percent: number;
  ws: WebSocket.WebSocket;
  token: string;
}

if (process.env.NODE_ENV !== "production") {
  runDevServer();
}

const krakenSocket = new WebSocket("wss://ws.kraken.com", {
  perMessageDeflate: false,
});

const getSpreads = (token: string) =>
  api.get<{ spread: PairSpread }>("/spread", { headers: { "X-TOKEN": token } });

const socketServer = new WebSocket.WebSocketServer({
  port: (process.env.SOCKET_PORT as unknown as number) || 7071,
});

const calculateWithSpread = (value: string, spread_percent: number) =>
  parseFloat(value) * (spread_percent * 1.01);

krakenSocket.on("open", function open() {
  console.log("B-Band-Transponder ready for connections");

  const exchangeSubscribers: Array<PairSubscription> = [];

  socketServer.on("connection", function connection(ws) {
    const currentPairs = () =>
      exchangeSubscribers.reduce((acc: string[], subscription) => {
        if (acc.includes(subscription.pair)) return acc;
        acc.push(subscription.pair);
        return acc;
      }, []);

    const krakenSubscribe = () => {
      const payload = JSON.stringify({
        event: "subscribe",
        pair: currentPairs(),
        subscription: {
          name: "trade",
        },
      });

      console.log({ payload });

      krakenSocket.send(payload);
    };

    const krakenUnsubscribe = (pair: string) => {
      if (!currentPairs().includes(pair)) {
        const payload = JSON.stringify({
          event: "unsubscribe",
          pair: [pair],
          subscription: {
            name: "trade",
          },
        });

        console.log({ payload });

        krakenSocket.send(payload);
      }
    };

    ws.on("message", async (data: Buffer) => {
      const message = JSON.parse(data.toString()) as SubscribeMessage;
      if (message.type === "subscribe") {
        const spread_percent = (await getSpreads(message.token)).data.spread
          .spread_percent;

        exchangeSubscribers.push({
          pair: message.pair,
          ws,
          spread_percent,
          token: message.token,
        });
        krakenSubscribe();
      }

      if (message.type === "unsubscribe") {
        const subIndex = exchangeSubscribers.findIndex(
          (sub) => sub.token == message.token
        );
        const copySub = { ...exchangeSubscribers[subIndex] };
        exchangeSubscribers[subIndex].ws.close();
        exchangeSubscribers.splice(subIndex, 1);
        krakenUnsubscribe(copySub.pair);
      }
    });
  });

  krakenSocket.on("message", function message(data) {
    const event = JSON.parse(data.toString());
    if (!Object.keys(event).includes("event")) {
      exchangeSubscribers.map((sub) => {
        console.log(JSON.parse(data.toString()));
        const [_channelId, trade, event, pair] = [
          ...JSON.parse(data.toString()),
        ];
        if (sub.pair === pair) {
          const [rate] = trade;
          const payload = {
            value: calculateWithSpread(rate, sub.spread_percent),
            event,
            pair,
            spread_percent: sub.spread_percent,
          };
          sub.ws.send(JSON.stringify(payload));
        }
      });
    }
  });
});
