import app from "./app";
import Config from "./config";

const port = Config.API_PORT;

app().listen(port, () => {
  console.log(
    `API is running on port ${port}! \n - You can access docs at the following url: http://localhost:${port}/api-docs`
  );
});
