import app from "./app";
import Config from "./config";

const port = Config.API_PORT;

app().listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
