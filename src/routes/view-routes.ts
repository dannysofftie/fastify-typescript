import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { IncomingMessage, Server, ServerResponse } from 'http';
import { routes } from '../configs/view';

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
export async function resolveLocals(locals: Function | Function[], req: FastifyRequest<{}>, res: FastifyReply<{}>): Promise<object> {
    const result: Array<{}> = [];

    if (typeof locals === 'undefined') {
        return {};
    }

    if (typeof locals === 'function') {
        return await locals(req, res);
    }

    for await (const local of locals) {
        // each locals function is expected to return data, in this case data of typeof object
        // functions with no return types will be ignored silently
        result.push(await local(req, res));
    }

    const data: object = {};

    for await (const obj of result) {
        // some functions may not return an object,
        // handle non-object return types
        typeof obj === 'object' && Object.keys(obj).forEach(key => (data[key] = obj[key]));
    }

    return data;
}

export default (app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, next: (err?: Error) => void) => {
    routes.forEach(route => {
        app.get(
            route.path,
            {
                preHandler: route.middleware,
            },
            async (req, res) => {
                await res.view(route.view, await resolveLocals(route.locals, req, res));
            }
        );
    });

    // pass to the next middleware
    next();
};
