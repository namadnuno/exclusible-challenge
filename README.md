# TechChallengeBE-Exclusible

Simple tech challenge, for user registering API that will be consumed by a ReactJS/NextJS frontend. This will be managed by a Admin CRUD panel.

Th backend should also provide a websocket for the exchange rate for the pair BTC/USD

This Exchange rate is calculated by getting the exchange rate from coinmarketcap API/Kraken websocket (easiest exchange to get information) and adding a configurable spread over it. This spread is configurable on the admin panel.

The exchange rate should be a microservice communicating with the datastorage service.

## Running Locally

```
make setup
```

```
make up
```