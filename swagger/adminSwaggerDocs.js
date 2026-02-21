const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Metro DashBoard API Documentation",
      version: "1.0.0",
      description: "API document for metro dashBoard",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: [
    path.join(__dirname,"adminDocs.js")
  ],
};
const swaggerSpec = swaggerJSDoc(options);
function swaggerDoc(app) {
  app.use("/admin-api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log("Swagger Docs available at /admin-api-docs");
}
module.exports = swaggerDoc;