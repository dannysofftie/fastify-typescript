import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import * as jwt from 'jsonwebtoken';
import { Server, IncomingMessage, ServerResponse } from 'http';

/**
 * Payload expected by JWT's sign token function.
 *
 * @interface IJWTPayload
 */
interface IJWTPayload {
    email: string;
    id: string;
    account: 'usertype1' | 'usertype2' | 'usertype3' | 'usertype4' | 'usertype5';
}

export interface IToken {
    sign: (options: IJWTPayload) => string;
    verify: (token: string) => IJWTPayload;
}

export default fp((app: FastifyInstance<Server, IncomingMessage, ServerResponse>, opts: {}, done: (err?: Error) => void) => {
    /**
     * JWT tokens signing, verification and decoding utility.
     *
     * @export
     * @class Token
     */
    const Token = {
        /**
         * Use JWT to sign a token
         */
        sign: (options: IJWTPayload) => {
            const { email, id, account }: IJWTPayload = options;

            if (!email || !id || !account) {
                throw new Error('Expects email, account type and password in payload.');
            }

            return jwt.sign({ email, id, account }, app.config.jwtsecret);
        },
        /**
         * Verify token, and get passed in variables
         */
        verify: (token: string) => {
            try {
                return jwt.verify(token, app.config.jwtsecret) as IJWTPayload;
            } catch (error) {
                return { email: null, account: null, id: null };
            }
        },
    };

    app.decorate('token', Token);

    done();
});
