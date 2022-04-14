import express from 'express';
import Config from './config';

const app = express()

const port = Config.API_PORT;

app.get('/', (_req, res) => {
  res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
