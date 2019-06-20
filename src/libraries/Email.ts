import { ReadStream } from 'fs';
import { minify } from 'html-minifier';
import { createTransport, Transporter } from 'nodemailer';
import { configs } from '../configs';

export interface IEmailOptions {
    recipients: string | string[];
    message: string | Buffer;
    subject: string;
    fromtext: string;
    tocustomname: string;
    attachments?: Array<{ filename: string; content: ReadStream }>;
}

export interface IEmailConfigs {
    host: string;
    port: number;
    auth: {
        user: string;
        pass: string;
    };
}

/**
 * Email sending library
 *
 * @class Email
 */
class Email {
    /**
     * Custom name to embedd in 'to field'
     *
     * @private
     * @type {string}
     * @memberof Email
     */
    private tocustomname: string;

    /**
     * Recipients to deliver email to
     *
     * @private
     * @type {string[]}
     * @memberof Email
     */
    private recipients: string | string[];

    /**
     * Message to deliver to specified emails
     *
     * @private
     * @type {string}
     * @memberof Email
     */
    private message: string | Buffer;

    /**
     * Email subject
     *
     * @private
     * @type {string}
     * @memberof Email
     */
    private subject: string;

    /**
     * Nodemailer transport instance
     *
     * @private
     * @type {Transporter}
     * @memberof Email
     */
    private transport: Transporter;

    /**
     * Text to add in 'from' field before sender email address
     *
     * @private
     * @type {string}
     * @memberof Email
     */
    private fromtext: string;

    /**
     * Attachments to attach to email message.
     *
     * @private
     * @type {Array<{
     *         filename: string;
     *         content: ReadStream;
     *     }>}
     * @memberof Email
     */
    private attachments: Array<{
        filename: string;
        content: ReadStream;
    }>;

    /**
     * Email configurations
     *
     * @private
     * @type {IEmailConfigs}
     * @memberof Email
     */
    private configs: IEmailConfigs;
    constructor(config: IEmailConfigs, opts: IEmailOptions) {
        this.configs = config;
        this.recipients = opts.recipients;
        this.message = opts.message;
        this.subject = opts.subject;
        this.fromtext = opts.fromtext;
        this.tocustomname = opts.tocustomname;
        opts.attachments && (this.attachments = opts.attachments);
    }

    public async send() {
        await this.constructTransport();
        const delivery: any[] = [];

        if (typeof this.recipients === 'string') {
            return await this.transport.sendMail({
                html: minify(this.message as string, { collapseWhitespace: true }),
                to: `${this.tocustomname} <${this.recipients}>`,
                from: `${this.fromtext} <${this.configs.auth.user}>`,
                subject: this.subject,
                replyTo: this.configs.auth.user,
                attachments: this.attachments,
            });
        }

        for (const recipient of this.recipients) {
            const res = await this.transport.sendMail({
                html: minify(this.message as string, { collapseWhitespace: true }),
                to: `${this.tocustomname} <${recipient}>`,
                from: `${this.fromtext} <${this.configs.host}>`,
                subject: this.subject,
                replyTo: this.configs.host,
                attachments: this.attachments,
            });
            delivery.push(res);
        }
        return delivery;
    }

    private constructTransport() {
        this.transport = createTransport({
            pool: true,
            host: this.configs.host,
            secure: true,
            port: this.configs.port,
            auth: {
                ...this.configs.auth,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }
}

export interface IEmail {
    sendEmail: (emailopts: IEmailOptions) => Promise<any>;
}

export const sendEmail = async (emailopts: IEmailOptions) => {
    return new Email({ ...configs.mail }, emailopts).send();
};
