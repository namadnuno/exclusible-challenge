# TechChallengeBE-Exclusible

Simple tech challenge, for user registering API that will be consumed by a ReactJS/NextJS frontend. This will be managed by a Admin CRUD panel.

Th backend should also provide a websocket for the exchange rate for the pair BTC/USD

This Exchange rate is calculated by getting the exchange rate from coinmarketcap API/Kraken websocket (easiest exchange to get information) and adding a configurable spread over it. This spread is configurable on the admin panel.

The exchange rate should be a microservice communicating with the datastorage service.

## Running Locally

```
make setup

make up
```

After the following messages are shown on the terminal: `API is running on port 8000!` and `B-Band-Transponder ready for connections`. You will be able to access the following urls:
- http://localhost:8000 - Api URL
- http://localhost:8000/api-docs - Api documentation
- http://localhost:3030 - Mini example frontend to interact with our socket

### Sample accounts

I have created two user accounts:
```
*Admin account*
email: nuno@mail.com
password: password

*Normal Account*
email: alex@mail.com
password: password
``` 
Only the admin account can access to all users and change the spread. 
The normal account can subscribe to our socket to get the exchange rate of a given pair.

## Api

The *api* was built with:
- Node-Express
- Typescript
- Sequelize

Click [here](http://localhost:8000/api-docs) to access the api docs (after setup).

## Websocket (B-band-transponder)

The *websocket* was built with:
- Websockets
- Axios

### Socket communication:
```
Subscribe example:
{
    type: "subscribe",
    token: "JWT Token",
    pair: "XBT/EUR",
}

Unsubscribe example:
{
    type: "unsubscribe",
    token: "JWT Token",
}
```