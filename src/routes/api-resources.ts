import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { protectUserRoute, protectAuthorizedUser } from '../middlewares/Authentication';
import Products from '../controllers/Products';

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: { prefix: string }, next: (err?: Error) => void) => {
    app.get(
        '/get-route',
        {
            preHandler: protectAuthorizedUser,
            schema: {
                description: 'Description of this get route.',
                tags: ['api'],
                response: {
                    200: {
                        description: 'Successful response',
                        type: 'object',
                        properties: {
                            email: { type: 'string', description: 'Sample field referring to an email field' },
                            item: { type: 'string', enum: ['enum1', 'enum2', 'enum3', 'enum4', 'enum5'], description: 'This item field will only accept defined entries in the enum definition.' },
                        },
                    },
                },
                summary: 'Get request',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => new Products(app, req, res).getOneItem()
    );

    app.get(
        '/path-with-param/:id',
        {
            preHandler: protectAuthorizedUser,
            schema: {
                tags: ['api'],
                description: 'Protected path with route parameter',
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            name: { type: 'string' },
                            // add other fields here
                        },
                    },
                },
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Id of the object being referenced' },
                    },
                },
                summary: 'Get object information using id',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Products(app, req, res).findOneAndUpdate()
    );

    app.post(
        '/create-project',
        {
            preHandler: protectUserRoute,
            schema: {
                tags: ['api'],
                description: 'Create a new project, with all the fields marked with * as required.',
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'Project title, e.g Tatu city drainage works.' },
                        description: { type: 'string', description: 'Project description' },
                    },
                    required: ['title'],
                },
                summary: 'Create a new project',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Products(app, req, res).addNewEntry()
    );

    app.put(
        '/put-route-with-param/:id',
        {
            preHandler: protectUserRoute,
            schema: {
                tags: ['api'],
                description: 'Update route as put request.',
                response: {
                    ...app.utils.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        title: { type: 'string', description: 'Description of this title field.' },
                        description: { type: 'string', description: 'Description of description field' },
                    },
                },
                params: {
                    type: 'object',
                    properties: {
                        id: { type: 'string', description: 'Id of the object being referenced' },
                    },
                },
                summary: 'Update an object',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Products(app, req, res).findOneAndUpdate()
    );

    app.delete(
        '/delete-route',
        {
            preHandler: protectUserRoute,
            schema: {
                description: 'Remove an object.',
                tags: ['api'],
                body: {
                    type: 'object',
                    properties: {
                        item: { type: 'string', description: 'item to remove' },
                    },
                },
                response: {
                    ...app.utils.statuscodes,
                },
                summary: 'Remove an item from a collection',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
        },
        async (req, res) => await new Products(app, req, res).getOneItem()
    );

    // pass to the next middleware
    next();
};
