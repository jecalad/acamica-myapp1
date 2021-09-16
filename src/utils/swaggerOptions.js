const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "MyAPP Acamica swagger",
            version: "1.0.0",
            description: "Documentación MyAPP Acamica"
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: "local server"
            }
        ],
        components: {
            securitySchemes: {
                basicAuth: {
                    type:"http",
                    scheme: "basic"
                }
            }
        },
        security: [
            {
                basicAuth: []
            }
        ]
    },
    apis: ['./src/routes/*.js']
}

module.exports = swaggerOptions;