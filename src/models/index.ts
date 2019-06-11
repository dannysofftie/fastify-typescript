import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IncomingMessage, Server, ServerResponse } from 'http';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { IProjectDocument, Product } from './Product';
import { IUserDocument, User } from './User';

export interface IDatabase {
    User: Model<IUserDocument>;
    Product: Model<IProjectDocument>;
}

const models: IDatabase = {
    User,
    Product,
};

export default fp(async (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: { uri: string }, done: (err?: Error) => void) => {
    mongoose.connection.on('connected', () => console.log('Mongo connected successfully'));
    mongoose.connection.on('error', console.log);

    await mongoose.connect(app.config.mongouri, { useNewUrlParser: true, keepAlive: true });

    app.decorate('db', models);

    done();
});
