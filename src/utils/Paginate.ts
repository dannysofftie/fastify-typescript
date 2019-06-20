import { FastifyRequest } from 'fastify';

export interface IPaginate {
    paginate: (req: FastifyRequest<{}>, pagesize?: number) => { $skip: number; $limit: number };
}

/**
 * Defines and implements a pagination model,
 *
 * Returns aggregation pipeline operator(s), for filtering and limiting the number of documents to retrieve.
 *
 * @export
 * @param {Request} req - incoming request object
 * @param {number} [pagesize] - number of documents per page, default to 20
 * @returns
 */
export function paginate(req: FastifyRequest<{}>, pagesize?: number) {
    /**
     *  Current page number, e.g. 1, 2, 3, 4, 5 ,6 etc.
     */
    const pagenumber: number = req.query['page'];

    /**
     * Number of documents to retrieve per page
     *
     * Defaults to 20 if no value is passed as the second parameter
     */
    const count = pagesize || 20;

    /**
     * Number of documents to skip before fetching
     */
    const skips = count * (pagenumber - 1);

    /**
     * MongoDB aggregation pipeline query
     *
     * Will return a skip and limit counter
     */
    const query = [
        {
            $skip: skips,
        },
        {
            $limit: count,
        },
    ];

    // returns the number of documents to skips, and current page number
    return !pagenumber ? [{ $match: {} }] : query;
}
