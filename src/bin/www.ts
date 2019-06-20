import * as ejs from 'ejs';
import * as fastify from 'fastify';
import * as cookie from 'fastify-cookie';
import * as cors from 'fastify-cors';
import * as servefavicon from 'fastify-favicon';
import * as staticassets from 'fastify-static';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { join, resolve } from 'path';
import * as viewengine from 'point-of-view';
import config from '../configs';
import docs from '../docs';
import database from '../models';
import apiresources from '../routes/api-resources';
import authentication from '../routes/authentication';
import utilities from '../utils';
import * as servestatic from 'serve-static';

/**
 * Application server instance.
 *
 * @export
 * @class App
 */
export default class App {
    /**
     * Application server instance.
     *
     * @private
     * @type {fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>}
     * @memberof App
     */
    private app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;

    /**
     * Application port number
     *
     * @private
     * @type {string}
     * @memberof App
     */
    private port: number | string;

    constructor() {
        this.port = process.env.PORT || 5000;
        this.app = fastify({ ignoreTrailingSlash: true, logger: { level: 'fatal' } });
        this.config();
    }

    /**
     * Start application server.
     *
     * @memberof App
     */
    public async start() {
        await this.app.listen(this.port as number, '0.0.0.0').catch(console.log);

        console.log('Server listening on port', this.app.server.address());

        process.on('uncaughtException', console.error);

        process.on('unhandledRejection', console.error);
    }

    /**
     * Application level configurations
     *
     * @private
     * @memberof App
     */
    private config() {
        this.app.register(cors, { preflight: true, credentials: true });

        this.app.register(servefavicon, { path: join(__dirname, '..', '..') });

        this.app.register(config);

        this.app.register(database);

        this.app.register(utilities);

        this.app.register(cookie);

        this.app.use((req: IncomingMessage, res: ServerResponse, done: (err?: Error) => void) => {
            // remove trailing slash for all the incoming path requests before handing execution to the next
            // middleware defined in fastify execution stack

            if (req.url.endsWith('/') && req.url !== '/') {
                res.writeHead(301, { Location: 'http://' + req.headers['host'] + req.url.slice(0, -1) });
                res.end();
            }

            done();
        });

        this.app.register(docs);

        this.app.register(authentication, { prefix: '/auth' });

        this.app.register(apiresources, { prefix: '/api' });

        this.app.register(staticassets, {
            root: join(__dirname, '..', '..', 'public'),
            prefix: '/',
            wildcard: false,
        });

        // @ts-ignore
        this.app.use('/uploads', servestatic(join(__dirname, '..', '..', 'uploads')));

        this.app.register(viewengine, {
            engine: { ejs },
            templates: join(__dirname, '..', '..', 'views'),
            options: {
                filename: resolve(__dirname, '..', '..', 'views'),
            },
            includeViewExtension: true,
        });
    }
}
