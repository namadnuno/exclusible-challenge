import { OpenApi } from "ts-openapi";
import swaggerUi from "swagger-ui-express";
import Config from "../config";
import routes from "./routes";
import { Application } from "express";

export const openApi = new OpenApi(
  "v0.0.1",
  "Exclusible api",
  "Simple tech challenge, for user registering API that will be consumed by a ReactJS/NextJS frontend. This will be managed by a Admin CRUD panel.",
  "nunnomalex@gmail.com"
);

openApi.setServers([{ url: `http://localhost:${Config.API_PORT}` }]);

const initDocs = (app: Application) => {
  routes.loginDocs(openApi);
  routes.registerDocs(openApi);
  routes.usersDocs(openApi);
  routes.spreadDocs(openApi);
  routes.meDocs(openApi);

  const openApiJson = openApi.generateJson();

  app.get("/openapi.json", function (_req, res) {
    res.json(openApiJson);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiJson));
};

export default initDocs;
