import { OpenApi, Types } from "ts-openapi";

export const publicUserSchema = {
  id: Types.Number(),
  name: Types.String(),
  email: Types.Email(),
  createdAt: Types.DateTime(),
  updatedAt: Types.DateTime(),
};

export const invalidTokenSchema = (openApi: OpenApi) =>
  openApi.declareSchema(
    "Invalid token response",
    Types.Object({
      description: "Invalid Token",
      properties: {
        message: Types.String(),
      },
    })
  );

export const userValidationErrorsSchema = {
  errors: Types.Array({
    arrayType: Types.Object({
      properties: {
        location: Types.String(),
        msg: Types.String(),
        param: Types.String(),
        value: Types.String(),
      },
    }),
    example: {
      location: "body",
      msg: "Invalid value",
      param: "name",
      value: "",
    },
  }),
};
