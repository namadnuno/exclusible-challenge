import { AxiosError, AxiosResponse } from "axios";
import { isValidPassword } from "../helpers/password";
import User from "../models/user";
import { RegisterResponse } from "../routes/register";
import api from "./helpers/api";
import mockDb from "./helpers/mockDb"

require("./helpers/runApp");

describe('authentication flow', () => {
    beforeEach(async () => {
        await mockDb.up();
    });

    afterEach(async () => {
        await mockDb.down({ to: 0 });
    });

    describe('register', () => {
        describe('user register with valid data', () => {
          let response: AxiosResponse<RegisterResponse>;
        
          const registerPayload = {
            name: 'Nuno',
            email: 'nuno@gmail.com',
            password: 'password',
          }

          beforeEach(async () => {
            response = await api().post('/register', registerPayload);
          })

          it('should create the user in DB', async () => {
              expect(response.status).toEqual(201);

              const dbUsers = await User.findAll();
              expect(dbUsers.length).toBe(1);
              
              expect(dbUsers[0].get('name')).toBe(registerPayload.name);
              expect(dbUsers[0].get('email')).toBe(registerPayload.email);
          });

          it('should hash user password', async () => {
            const dbUsers = await User.findAll();              
            const savedPassword = dbUsers[0].get('password');
            expect(savedPassword).not.toBe(registerPayload.password);
            expect(isValidPassword(registerPayload.password, savedPassword as string)).toBe(true)
          });
        });

        describe('user register with invalid data', () => {
          let errorResponse: AxiosError<{
            errors: Array<Record<string,string>>
          }>;
        
          const registerPayload = {
            name: '',
            email: '',
            password: '',
          }

          beforeEach(async () => {
            try {
              await api().post('/register', registerPayload);
            } catch (e) {
              errorResponse = e
            }
          });

          it('should show validation errors', () => {
            expect(errorResponse).not.toBeUndefined();
            if (errorResponse && errorResponse.response) {
              expect(errorResponse.response.status).toBe(422);
              expect(errorResponse.response.data).toEqual(
                {
                   errors: [
                    {
                      "location": "body",
                      "msg": "Invalid value",
                      "param": "name",
                      "value": ""
                    },
                    {
                      "location": "body",
                      "msg": "Invalid value",
                      "param": "email",
                      "value": ""
                    },
                    {
                      "location": "body",
                      "msg": "Invalid value",
                      "param": "password",
                      "value": ""
                    }
                  ]
                }
              );
            }
          })
        });
    })
})
