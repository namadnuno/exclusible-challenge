import { Types, OpenApi } from "ts-openapi";
import { publicUserSchema } from "./shared";

const docs = (openApi: OpenApi) => {
  openApi.addPath(
    "/login",
    {
      post: {
        description: "Generates an JWT token for an authorized user",
        summary: "User authentication",
        operationId: "login-op",
        requestSchema: {
          body: Types.Object({
            description: "User credentials",
            properties: {
              email: Types.String({ description: "Email address" }),
              password: Types.Password({ description: "Password" }),
            },
          }),
        },
        responses: {
          200: openApi.declareSchema(
            "Successful Token response",
            Types.Object({
              description: "Generated JWT response",
              properties: {
                token: Types.String({
                  description: "JWT Token",
                }),
                expiresIn: Types.String({
                  description: "Expiration time",
                }),
                user: publicUserSchema,
              },
            })
          ),
          401: openApi.declareSchema(
            "Unsuccessful Authentication",
            Types.Object({
              description: "Invalid credentials",
              properties: {
                message: Types.String(),
              },
            })
          ),
        },
        tags: ["authentication"],
      },
    },
    true
  );
};

export default docs;
