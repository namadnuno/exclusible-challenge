import { Types, OpenApi } from "ts-openapi";
import {
  invalidTokenSchema,
  publicUserSchema,
  userValidationErrorsSchema,
} from "./shared";

const docs = (openApi: OpenApi) => {
  openApi.addPath(
    "/register",
    {
      post: {
        description: "Create a system user",
        summary: "User Registration",
        operationId: "register-op",
        requestSchema: {
          body: Types.Object({
            description: "User details",
            properties: {
              name: Types.String({ description: "Name" }),
              email: Types.String({ description: "Email address" }),
              password: Types.Password({ description: "Password" }),
            },
          }),
        },
        responses: {
          201: openApi.declareSchema(
            "User created successfully",
            Types.Object({
              properties: {
                user: publicUserSchema,
              },
            })
          ),
          422: openApi.declareSchema(
            "Validation errors",
            Types.Object({
              properties: userValidationErrorsSchema,
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
