import { Server, IncomingMessage, ServerResponse } from 'http';
import { IConfig } from '../configs';
import { IDatabase } from '../models';
import { IToken } from '../utils/Token';
import { IEmail } from '../libraries/Email';
import { ITemplate } from '../utils/Template';
import { IStatusCodes } from '../utils/Statuscodes';

declare module 'fastify' {
    export interface FastifyInstance<HttpServer = Server, HttpRequest = IncomingMessage, HttpResponse = ServerResponse> {
        config: IConfig;
        db: IDatabase;
        token: IToken;
        mail: IEmail;
        template: ITemplate;
        statuscodes: IStatusCodes;
    }
}
