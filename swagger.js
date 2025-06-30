const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clients',
            version: '1.0.0',
            description: 'Documentation de l’API Clients avec authentification sécurisée',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Serveur local',
            },
        ],
    },
    apis: ['./routes/*.js'], // fichiers à scanner
};

const swaggerSpec = swaggerJSDoc(options);

function setupDocs(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupDocs;
