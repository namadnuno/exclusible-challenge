import express from "express";

const app = express();

const runDevServer = () => {
  app.use(express.static(__dirname + "/public"));

  app.listen(3030, () => {
    console.log(
      "B-Band-Transponder testing frontend ir running on http://localhost:3030"
    );
  });
};

export default runDevServer;
