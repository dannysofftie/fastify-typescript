import { IncomingMessage, Server, ServerResponse } from 'http';
import { IConfig } from '../configs';
import { IDatabase } from '../models';
import { IUtilities } from '../utils';

declare module 'fastify' {
    export interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
        config: IConfig;
        db: IDatabase;
        utils: IUtilities;
    }
}
