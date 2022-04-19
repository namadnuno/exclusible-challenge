import { Types, OpenApi } from "ts-openapi";
import { invalidTokenSchema, userValidationErrorsSchema } from "./shared";

const userSchema = {
  id: Types.Number(),
  name: Types.String(),
  email: Types.Email(),
  password: Types.Password(),
  token: Types.String(),
  is_admin: Types.Boolean(),
  createdAt: Types.DateTime(),
  updatedAt: Types.DateTime(),
};

const noAdminAccessSchema = (openApi: OpenApi) =>
  openApi.declareSchema(
    "No Admin Access",
    Types.Object({
      description: "Can't perform this action.",
      properties: {
        message: Types.String(),
      },
    })
  );

const docs = (openApi: OpenApi) => {
  openApi.addPath(
    "/users",
    {
      post: {
        description: "Creates system users",
        summary: "User creation",
        operationId: "users-create-op",
        requestSchema: {
          body: Types.Object({
            description: "User details",
            properties: {
              name: Types.String({ description: "Name" }),
              email: Types.String({ description: "Email address" }),
              password: Types.Password({ description: "Password" }),
            },
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
            "User created successfully",
            Types.Object({
              properties: {
                user: userSchema,
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
          403: noAdminAccessSchema(openApi),
        },
        tags: ["users"],
      },
      get: {
        description: "Get all system users",
        summary: "Users read",
        operationId: "users-get-op",
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
            "Users response",
            Types.Object({
              properties: {
                users: Types.Array({
                  arrayType: Types.Object({
                    properties: userSchema,
                  }),
                }),
              },
            })
          ),
          401: invalidTokenSchema(openApi),
          403: noAdminAccessSchema(openApi),
        },
        tags: ["users"],
      },
    },
    true
  );

  openApi.addPath(
    "/users/:id",
    {
      put: {
        description: "Updates system users",
        summary: "User update",
        operationId: "users-update-op",
        requestSchema: {
          params: {
            id: Types.Number({
              description: "User ID",
              required: true,
            }),
          },
          body: Types.Object({
            description: "User details",
            properties: {
              name: Types.String({ description: "Name" }),
              email: Types.String({ description: "Email address" }),
              password: Types.Password({ description: "Password" }),
            },
          }),
          headers: {
            "X-TOKEN": Types.String({
              description: "JWT Token",
              required: true,
            }),
          },
        },
        responses: {
          200: openApi.declareSchema(
            "User updated successfully",
            Types.Object({
              properties: {
                user: userSchema,
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
          403: noAdminAccessSchema(openApi),
        },
        tags: ["users"],
      },
      get: {
        description: "Get system user",
        summary: "Users read",
        operationId: "users-get-single-op",
        requestSchema: {
          params: {
            id: Types.Number({
              description: "User ID",
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
            "User response",
            Types.Object({
              properties: {
                user: userSchema,
              },
            })
          ),
          401: invalidTokenSchema(openApi),
          403: noAdminAccessSchema(openApi),
        },
        tags: ["users"],
      },
      delete: {
        description: "delete system users",
        summary: "User deletion",
        operationId: "users-delete-op",
        requestSchema: {
          params: {
            id: Types.Number({
              description: "User ID",
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
          204: openApi.declareSchema(
            "User deleted successfully",
            Types.Object({
              properties: {
                message: Types.String(),
              },
            })
          ),
          401: invalidTokenSchema(openApi),
          403: noAdminAccessSchema(openApi),
        },
        tags: ["users"],
      },
    },
    true
  );
};

export default docs;
