const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const path = require("path");
const { default: _default } = require("validator");
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
    path.join(__dirname,"ticketCRUDSwagger.js"),
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname,"adminDocs.js"),
    path.join(__dirname,"homeDashDoc.js"),
    path.join(__dirname,"subscriptionDash.js"),
    path.join(__dirname,"tripHistoryDoc.js"),
    path.join(__dirname,"subscriptionDoc.js"),
    path.join(__dirname,"subDashDoc.js"),
    path.join(__dirname,"subPaymentDoc.js")
  ],
};
const swaggerSpec = swaggerJSDoc(options);
function swaggerDoc(app) {
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
  console.log("Swagger Docs available at /api-docs");
}
module.exports = swaggerDoc;