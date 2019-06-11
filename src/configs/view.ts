import { FastifyRequest, FastifyReply, DefaultQuery, DefaultParams, DefaultHeaders, FastifyInstance } from 'fastify';

/**
 * Instance definition for every view route defined in the application.
 *
 * @export
 * @interface IViewRoutes
 */
export interface IViewRoutes {
    path: string;
    view: string;
    middleware?: (req: FastifyRequest<{}>, res: FastifyReply<{}>, done: (err?: Error) => void) => void;
    locals?: Array<(app: FastifyInstance, req: FastifyRequest<{}, DefaultQuery, DefaultParams, DefaultHeaders, any>, res: FastifyReply<{}>) => Promise<any>>;
}

export const routes: IViewRoutes[] = [
    {
        path: '/',
        view: 'index',
    },
    {
        path: '/about',
        view: 'about',
        middleware: null,
        locals: [],
    },
];
