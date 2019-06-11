import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { Types } from 'mongoose';
import { determineAccountAndUser } from '../middlewares/Authentication';

/**
 * Controller utility, with abstract methods, to allow child classes to inherit,
 *  - Fastify instance,
 *  - Incoming request body,
 *  - Incoming request object, and
 *  - Outgoing response object
 *
 * @export
 * @abstract
 * @class Controller
 */
export default abstract class Controller {
    /**
     * Fastify application instance
     *
     * @protected
     * @type {FastifyInstance<Server, IncomingMessage, ServerResponse>}
     * @memberof Controller
     */
    protected app: FastifyInstance<Server, IncomingMessage, ServerResponse>;

    /**
     * Incoming request body object
     *
     * @protected
     * @type {{}}
     * @memberof Controller
     */
    protected body: object;

    /**
     * Incoming request object
     *
     * @protected
     * @type {FastifyRequest<{}>}
     * @memberof Controller
     */
    protected req: FastifyRequest<{}>;

    /**
     * Outgoing response object
     *
     * @protected
     * @type {FastifyReply<{}>}
     * @memberof Controller
     */
    protected res: FastifyReply<{}>;

    /**
     * Currently logged in user
     *
     * @protected
     * @type {{ email: string; id: Types.ObjectId; account: string }}
     * @memberof Controller
     */
    protected user: { email: string; id: Types.ObjectId; account: string };

    constructor(app: FastifyInstance<Server, IncomingMessage, ServerResponse>, req: FastifyRequest<{}>, res: FastifyReply<{}>) {
        this.app = app;
        this.body = req.body;
        this.req = req;
        this.res = res;

        const user = determineAccountAndUser(app, req);

        if (user) {
            const { email, id, account } = determineAccountAndUser(app, req);
            this.user = {
                id: Types.ObjectId(id),
                email,
                account,
            };
        }
    }

    /**
     * Find all entries from the referenced schema and return
     *
     * @returns {Promise<any>}
     * @memberof Controller
     */
    public abstract async findAllEntries(): Promise<any>;

    /**
     * Add a new entry to the referenced schema
     *
     * @abstract
     * @returns {Promise<any>}
     * @memberof Controller
     */
    public abstract async addNewEntry(): Promise<any>;

    /**
     * Find an entry from the referenced schema, update and return update status
     *
     * @returns {Promise<any>}
     * @memberof Controller
     */
    public abstract async findOneAndUpdate(): Promise<any>;

    /**
     * Find and return one entry from the refenced schema.
     *
     * @abstract
     * @returns {Promise<any>}
     * @memberof Controller
     */
    public abstract async findOneEntry(): Promise<any>;
}
