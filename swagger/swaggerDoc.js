const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Metro Mate API Documentation",
      version: "1.0.0",
      description: "API document for metro project",
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
    path.join(__dirname, "userDoc.js"),
    path.join(__dirname, "tripDoc.js"),
    path.join(__dirname, "ticketPaymentDocs.js"),
    path.join(__dirname,"ticketDocs.js"),
    path.join(__dirname,"nearsetStationDoc.js"),
    path.join(__dirname,"adminDocs.js"),
    path.join(__dirname,"stationsDashDocs.js"),
    path.join(__dirname, "../routes/*.js"),
  ],
};
const swaggerSpec = swaggerJSDoc(options);
function swaggerDoc(app) {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log("Swagger Docs available at /api-docs");
}
module.exports = swaggerDoc;