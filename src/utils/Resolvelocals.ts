/**
 * Application level locals.
 *
 * Locals defined by these methods will be rendered by ejs templating engine as data variables.
 *
 *  - e.g `{ username: 'example-username' }`
 *  - Accessed from ejs as `<%= username %>`
 *
 * Defined in the form of, `shortcut` : `method to execute`
 *
 * The method to execute for each shortcut must have the following properties:
 *  - Must be a singleton,
 *  - Must return typeof `string`, `number`, or `undefined`
 *
 * Methods that return typeof `object` will be declined.
 */
import { FastifyReply, FastifyRequest, FastifyInstance } from 'fastify';

export interface IResolveLocals {
    // tslint:disable-next-line: ban-types
    resolve: (locals: Function | Function[], app: FastifyInstance, req: FastifyRequest<{}>, res: FastifyReply<{}>) => Promise<object>;
}

/**
 * Resolve functions that return variables passed when rendering views.
 *
 * Allow multiple functions to be called, returning a single object for efficiency and simplicity.
 *
 * @param locals - functions to return variables to be rendered as express locals
 * @param req - incoming request object
 * @param res - outgoing message object
 */
// tslint:disable-next-line:ban-types
export async function resolve(locals: Function | Function[], app: FastifyInstance, req: FastifyRequest<{}>, res: FastifyReply<{}>): Promise<object> {
    const result: Array<{}> = [];

    if (!locals) {
        return [];
    }

    if (typeof locals === 'function') {
        return await locals(app, req, res).catch(console.log);
    }

    for await (const local of locals) {
        // each locals function is expected to return data, in this case data of typeof object
        // functions with no return types will be ignored silently
        result.push(await local(app, req, res).catch(console.log));
    }

    const data: object = {};

    for await (const obj of result) {
        // some functions may not return an object,
        // handle non-object return types
        typeof obj === 'object' && Object.keys(obj).forEach(key => (data[key] = obj[key]));
    }

    return data;
}
