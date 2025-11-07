const swaggerJDoc=require('swagger-jsdoc');
const swaggerUI=require('swagger-ui-express');
const options={
    definitions:{
        openapi:'3.0.0',
        info:{
            title:'Metro Mate Api Documentation',
            version:'1.0.0',
            description:'Api document for metro project'
        }
    },
    apis:[__dirname+"/userDoc.js",__dirname+"/../routes/*.js"],
};
const swaggerSpec=swaggerJDoc(options);
function swaggerDoc(app){
    app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(swaggerSpec));
     console.log(" Swagger Docs available at ");
}
module.exports=swaggerDoc;