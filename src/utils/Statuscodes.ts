export interface IStatusCodes {
    200: {
        description: string;
        type: string;
        properties: {
            message: any;
            error: any;
            role?: any;
            token?: any;
        };
    };
    300: {
        description: string;
        type: string;
        properties: {
            message: any;
            statusCode: any;
            error: any;
        };
    };
    400: {
        description: string;
        type: string;
        properties: {
            message: any;
            statusCode: any;
            error: any;
        };
    };
    500: {
        description: string;
        type: string;
        properties: {
            message: any;
            statusCode: any;
            error: any;
        };
    };
}

export interface IStatusCodesInterface {
    statuscodes: IStatusCodes;
}
export const statuscodes: IStatusCodes = {
    200: {
        description: 'Success',
        type: 'object',
        properties: {
            message: { type: 'string' },
            error: { type: 'string' },
        },
    },
    300: {
        description: 'Redirection',
        type: 'object',
        properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
            error: { type: 'string' },
        },
    },
    400: {
        description: 'Client error',
        type: 'object',
        properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
            error: { type: 'string' },
        },
    },
    500: {
        description: 'Server error',
        type: 'object',
        properties: {
            statusCode: { type: 'number' },
            message: { type: 'string' },
            error: { type: 'string' },
        },
    },
};
