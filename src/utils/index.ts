import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { compareObjects, IObjectdiff } from './Objectdiff';
import { IUploader, uploader, extractFilepath } from './Uploader';
import { IStatusCodesInterface, statuscodes } from './Statuscodes';
import { ICompileTemplate, compileEjs } from './Template';
import { IJWTToken, JWTToken } from './Token';
import { IEmail, sendEmail } from '../libraries/Email';
import { ICsvparser, parse } from './Csvparser';
import { IResolveLocals, resolve } from './Resolvelocals';
import { IPaginate, paginate } from './Paginate';
import { ISheetbuilder, buildSheet } from './Sheetbuilder';

// tslint:disable-next-line: no-empty-interface
export interface IUtilities extends IObjectdiff, IUploader, IStatusCodesInterface, ICompileTemplate, IJWTToken, IEmail, ICsvparser, IResolveLocals, IPaginate, ISheetbuilder {}

export default fp((app: FastifyInstance, opts: {}, done: (err?: Error) => void) => {
    app.decorate('utils', { compareObjects, uploader, statuscodes, compileEjs, ...JWTToken, sendEmail, extractFilepath, parse, resolve, paginate, buildSheet });

    // pass execution to the next middleware in fastify instance
    done();
});
