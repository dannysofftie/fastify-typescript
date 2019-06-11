import { FastifyInstance } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import Prouducts from '../controllers/Products';
import { protectUserRoute } from '../middlewares/Authentication';
import Users from '../controllers/Users';

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: { prefix: string }, next: (err?: Error) => void) => {
    app.post(
        '/sign-in',
        {
            schema: {
                description: 'Authentication endpoint, for all the users, to allow access to protected resources',
                summary: 'Sign in to access protected resources',
                tags: ['auth'],
                body: {
                    type: 'object',
                    properties: {
                        username: { type: 'string', description: 'Will accept either username or email address' },
                        password: { type: 'string', description: 'User password' },
                    },
                    required: ['username', 'password'],
                },
                response: {
                    200: {
                        description: 'Success',
                        type: 'object',
                        properties: {
                            message: { type: 'string' },
                            error: { type: 'string' },
                            role: { type: 'string' },
                            token: { type: 'string' },
                        },
                    },
                },
            },
        },
        async (req, res) => await new Prouducts(app, req, res).authenticate()
    );

    app.post(
        '/reset-password',
        {
            schema: {
                description: 'Reset forgotten user password. An autogenerated password will be sent to the supplied email address',
                tags: ['auth'],
                response: {
                    ...app.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        email: { type: 'string', description: `User's email address` },
                    },
                    required: ['email'],
                },
                summary: 'Reset passowrd',
            },
        },
        async (req, res) => await new Users(app, req, res).findOneAndUpdate()
    );

    app.post(
        '/create-engineer',
        {
            schema: {
                description: 'Create engineer account, as the first step, to allow creating projects, adding users e.t.c',
                tags: ['auth'],
                response: {
                    ...app.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: `Engineer's first and last name` },
                        idnumber: { type: 'number', description: `Engineer's ID number` },
                        email: { type: 'string', description: `Engineer's email address` },
                        password: { type: 'string', description: `Password to be used for authentication` },
                    },
                    required: ['name', 'email', 'password'],
                },
                summary: 'Create engineer account',
            },
        },
        async (req, res) => await new Users(app, req, res).addNewEntry()
    );

    app.post(
        '/create-user-account',
        {
            schema: {
                description: 'Create user accounts',
                tags: ['auth'],
                response: {
                    ...app.statuscodes,
                },
                body: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: `User's first and last name` },
                        idnumber: { type: 'number', description: `User's ID number` },
                        email: { type: 'string', description: `User's email address` },
                        account: { type: 'string', enum: ['engineer', 'contractor', 'surveyor', 'inspectorate', 'client'], description: 'Account authentication role, accepted values are either of below' },
                    },
                    required: ['name', 'email', 'account'],
                },
                summary: 'Create user accounts',
                security: [
                    {
                        apiKey: [],
                    },
                ],
            },
            preHandler: protectUserRoute,
        },
        async (req, res) => await new Users(app, req, res).addNewEntry()
    );

    // pass execution to the next middleware
    next();
};