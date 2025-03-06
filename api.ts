import { app } from '../../src/index.js'; // adjust the path as needed

export const handler = async (event, context) => {
  return app.fetch(new Request(event.path, {
    method: event.httpMethod,
    headers: event.headers,
    body: event.body
  }));
};