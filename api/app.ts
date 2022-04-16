import express from 'express';

const app = express()

const routes = () => {
  app.get('/', (_req, res) => {
    res.send('"ONE SMALL STEP FOR MAN. ONE GIANT LEAP FOR MANKIND."')
  });

  return app;
}


export default routes;
