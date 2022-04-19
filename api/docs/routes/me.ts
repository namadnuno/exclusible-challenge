import { Types, OpenApi } from "ts-openapi";
import { invalidTokenSchema, publicUserSchema } from "./shared";

const docs = (openApi: OpenApi) => {
  openApi.addPath(
    "/me",
    {
      get: {
        description: "Gets user information by the JWT token",
        summary: "User information",
        operationId: "me-op",
        requestSchema: {
          headers: {
            "X-TOKEN": Types.String({
              description: "JWT Token",
              required: true,
            }),
          },
        },
        responses: {
          200: openApi.declareSchema(
            "User response",
            Types.Object({
              properties: {
                me: publicUserSchema,
              },
            })
          ),
          401: invalidTokenSchema(openApi),
        },
        tags: ["authentication"],
      },
    },
    true
  );
};

export default docs;
