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
                title: 'Project API Server',
                description: 'Application server for built with Fastify, and TypeScript. Documented using Swagger UI.',
                version: '0.0.1',
            },
            externalDocs: {
                url: 'https://live-server-url.net',
                description: `Hosted on server x vps.`,
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
