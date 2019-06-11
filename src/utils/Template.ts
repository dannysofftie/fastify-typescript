import * as ejs from 'ejs';
import { FastifyInstance } from 'fastify';
import * as fp from 'fastify-plugin';
import { readFileSync } from 'fs';
import { minify } from 'html-minifier';
import { join } from 'path';

interface ITemplatePaths {
    template: 'sample-template';
}

export interface ITemplate {
    /**
     * Compile .ejs file, specified path and data
     *
     * @memberof ITemplate
     */
    compile: (template: ITemplatePaths, data?: any) => string;
}

const rootPath = join(__dirname, '..', '..', 'views', 'email-templates/');

const loadTemplate = {
    'sample-template': 'accounts/password-reset.ejs',
};

export default fp((app: FastifyInstance, opts: {}, done: (err?: Error) => void) => {
    const utility: ITemplate = {
        compile: (template: ITemplatePaths, data?: any) => {
            const text = readFileSync(rootPath + loadTemplate[template.template], 'utf-8');

            const html = ejs.compile(text)(data);

            return minify(html, { collapseWhitespace: true });
        },
    };

    app.decorate('template', utility);

    // pass execution to the next middleware in fastify stack
    done();
});
