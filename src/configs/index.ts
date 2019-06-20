import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IEmailConfigs } from '../libraries/Email';
import { config } from 'dotenv';

config();

export interface IConfig {
    apiurl: string;
    mongouri: string;
    apikey?: string;
    jwtsecret: string;
    mail: IEmailConfigs;
    appname: string;
}

const production = process.env.NODE_ENV === `production`;

export const configs: IConfig = {
    apiurl: (() => {
        if (production) {
            return process.env.API_PROD_URL;
        }

        return process.env.API_LOCAL_URL;
    })(),
    mongouri: (() => {
        if (production) {
            return process.env.MONGO_PROD_URL;
        }

        return `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}:27017/${process.env.MONGO_DATABASE}`;
    })(),
    jwtsecret: process.env.JWT_SECRET_KEY,
    mail: {
        host: process.env.APP_EMAIL_HOST,
        port: process.env.APP_EMAIL_HOST.includes('gmail') || process.env.APP_EMAIL_HOST.includes('zoho') ? 465 : 25,
        auth: {
            user: process.env.APP_EMAIL_ADDRESS,
            pass: process.env.APP_EMAIL_PASSWORD,
        },
    },
    appname: process.env.APPLICATION_NAME,
};

export default fp((app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, done: (err?: Error) => void) => {
    app.decorate(`config`, configs);

    done();
});
