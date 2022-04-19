import { Types, OpenApi } from "ts-openapi";
import { invalidTokenSchema, userValidationErrorsSchema } from "./shared";

const spreadSchema = {
  pair: Types.String(),
  spread_percent: Types.Number(),
};

const docs = (openApi: OpenApi) => {
  openApi.addPath(
    "/spread",
    {
      post: {
        description: "Create/Update pair spread",
        summary: "Create/Update pair spread",
        operationId: "spread-change-op",
        requestSchema: {
          body: Types.Object({
            description: "Spread Details",
            properties: spreadSchema,
          }),
          headers: {
            "X-TOKEN": Types.String({
              description: "JWT Token",
              required: true,
            }),
          },
        },
        responses: {
          201: openApi.declareSchema(
            "Spread created successfully",
            Types.Object({
              properties: {
                spread: spreadSchema,
              },
            })
          ),
          200: openApi.declareSchema(
            "Spread updated successfully",
            Types.Object({
              properties: {
                spread: spreadSchema,
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
        tags: ["Spread Maintenance"],
      },
      get: {
        description: "Get pair spread",
        summary: "Get pair spread",
        operationId: "spread-get-op",
        requestSchema: {
          query: {
            pair: Types.String({
              description: "Pair",
              required: true,
            }),
          },
          headers: {
            "X-TOKEN": Types.String({
              description: "JWT Token",
              required: true,
            }),
          },
        },
        responses: {
          200: openApi.declareSchema(
            "Spread found successfully",
            Types.Object({
              properties: {
                spread: spreadSchema,
              },
            })
          ),
          401: invalidTokenSchema(openApi),
        },
        tags: ["Spread Maintenance"],
      },
    },
    true
  );
};

export default docs;
