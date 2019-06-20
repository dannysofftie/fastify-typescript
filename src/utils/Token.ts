import * as jwt from 'jsonwebtoken';
import { configs } from '../configs';

/**
 * Payload expected by JWT's sign token function.
 *
 * @interface IJWTPayload
 */
interface IJWTPayload {
    email: string;
    id: string;
    account: 'account1' | 'account2';
}

export interface IJWTToken {
    sign: (options: IJWTPayload) => string;
    verify: (token: string) => IJWTPayload;
}

/**
 * JWT tokens signing, verification and decoding utility.
 *
 * @export
 * @class Token
 */
export const JWTToken = {
    /**
     * Use JWT to sign a token
     */
    sign: (options: IJWTPayload) => {
        const { email, id, account }: IJWTPayload = options;

        if (!email || !id || !account) {
            throw new Error('Expects email, account type and id in payload.');
        }

        return jwt.sign({ email, id, account }, configs.jwtsecret);
    },
    /**
     * Verify token, and get passed in variables
     */
    verify: (token: string) => {
        try {
            return jwt.verify(token, configs.jwtsecret) as IJWTPayload;
        } catch (error) {
            return { email: null, account: null, id: null };
        }
    },
};
