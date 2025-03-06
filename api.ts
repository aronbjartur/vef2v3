import { app } from '/src/index.js'; // Adjust the relative path if necessary

export const handler = async (event, context) => {
  return app.fetch(event);
};