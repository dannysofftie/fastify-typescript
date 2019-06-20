import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { PluginOptions } from 'fastify-plugin';
import * as swagger from 'fastify-swagger';
import { IncomingMessage, Server, ServerResponse } from 'http';

export default fp((app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: PluginOptions, done: (err?: Error) => void) => {
    app.register(swagger, {
        routePrefix: '/docs',
        swagger: {
            info: {
                title: 'iFunza API server',
                description: 'Responds to paths prefixed with either `api` or `auth`, other requests will be forwarded to UI router.',
                version: '0.0.1',
            },
            externalDocs: {
                url: 'https://ifunza.oratech.co.ke',
                description: `Hosted on  Oratech's high speed delivery server.`,
            },
            consumes: ['application/json'],
            produces: ['application/json'],
            tags: [
                {
                    name: 'auth',
                    description: 'Authentication related endpoints',
                },
                {
                    name: 'api',
                    description: 'Data related endpoints',
                },
            ],
            securityDefinitions: {
                apiKey: {
                    description: 'Standard Authorization header using the Bearer scheme. Example: "Bearer {token}"',
                    type: 'apiKey',
                    name: 'Authorization',
                    in: 'header',
                },
            },
        },
        exposeRoute: true,
    });

    done();
});
