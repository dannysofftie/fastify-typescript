import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

/**
 * Determine account, and user type from the incoming request.
 *
 * @export
 */
export function determineAccountAndUser(app: FastifyInstance, req: FastifyRequest<{}>) {
    const auth = req.headers['authorization'] as string;
    try {
        const token = auth.split(' ')[1];

        return app.utils.verify(token);
    } catch {
        return null;
    }
}

/**
 * Prehandler hook,
 *  - Protect all resources accessible to engineers only
 *
 * @export
 * @param {FastifyRequest<{}>} req
 * @param {FastifyReply<{}>} res
 */
export function protectUserRoute(req: FastifyRequest<{}>, res: FastifyReply<{}>, done: (err?: Error) => void) {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return res.status(401).send({ error: 'unauthorized', message: 'Missing authentication token' });
    }

    const { account, email, id } = determineAccountAndUser(this, req);

    if (account !== 'account1') {
        return res.status(403).send({ error: 'forbidden', message: 'Invalid credentials in authentication token' });
    }

    return done();
}

/**
 * Allow authorized user to access resource, without narrowing scope to role/account
 *
 * @export
 * @param {FastifyRequest<{}>} req
 * @param {FastifyReply<{}>} res
 * @param {(err?: Error) => void} done
 * @returns
 */
export function protectAuthorizedUser(req: FastifyRequest<{}>, res: FastifyReply<{}>, done: (err?: Error) => void) {
    const auth = req.headers['authorization'] as string;

    if (!auth) {
        return res.status(401).send({ error: 'unauthorized', message: 'Missing authentication token' });
    }

    const { account, email, id } = determineAccountAndUser(this, req);

    if (!account) {
        return res.status(403).send({ error: 'forbidden', message: 'Invalid credentials in authentication token' });
    }

    return done();
}
