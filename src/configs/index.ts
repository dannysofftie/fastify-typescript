import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { IEmailConfigs } from '../libraries/Email';

require('dotenv').config();

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
            return `https://liveurl.sample.com`;
        }

        return `http://127.0.0.1:5000`;
    })(),
    mongouri: (() => {
        if (production) {
            return `mongodb-remote-url`;
        }

        return `mongodb://username:password@127.0.0.1:27017/database-name`;
    })(),
    jwtsecret: '6=+_/][{dn@#^nmsdv-',
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
