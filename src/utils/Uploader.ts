import { randomBytes } from 'crypto';
import * as multer from 'fastify-multer';
import { File } from 'fastify-multer/src/interfaces';
import { existsSync, mkdirSync } from 'fs';
import { Instance } from 'multer';
import { extname, join } from 'path';
import { configs } from '../configs';

export interface IUploader {
    uploader: Instance;
    extractFilepath: (filename: string) => string;
}

const uploadDirectories = {
    png: join(__dirname, '..', '..', 'uploads', 'images'),
    jpg: join(__dirname, '..', '..', 'uploads', 'images'),
    jpeg: join(__dirname, '..', '..', 'uploads', 'images'),
    gif: join(__dirname, '..', '..', 'uploads', 'gifs'),
    doc: join(__dirname, '..', '..', 'uploads', 'documents'),
    docx: join(__dirname, '..', '..', 'uploads', 'documents'),
    other: join(__dirname, '..', '..', 'uploads', 'other-files'),
};

/**
 * Create a random file name for every file into the file system.
 *  - It would be trivial for anyone to overwrite any file on the server by sending that name up.
 *    Also, it would cause problems if a user happens to upload a file with the same name as another file.
 *
 * @param {File} file - binary data of the uploaded file
 * @returns
 */
const createRandomFileName = (file: File) => {
    const name: string = randomBytes(18).toString('hex');
    const ext: string = extname(file.originalname).split('.')[1];
    return name + '.' + ext;
};

export const extractFilepath = (filename: string) => {
    if (!filename) {
        return null;
    }

    const dir: string = uploadDirectories[extname(filename).split('.')[1]] ? uploadDirectories[extname(filename).split('.')[1]] : uploadDirectories['other'];

    return configs.apiurl + '/uploads' + dir.split('/uploads')[1] + '/' + filename;
};

export const uploader = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            Object.keys(uploadDirectories).forEach(dir => {
                !existsSync(uploadDirectories[dir]) && mkdirSync(uploadDirectories[dir], { recursive: true });
            });

            cb(null, uploadDirectories[extname(file.originalname).split('.')[1]] ? uploadDirectories[extname(file.originalname).split('.')[1]] : uploadDirectories['other']);
        },
        filename: (req, file, cb) => {
            cb(null, createRandomFileName(file));
        },
    }),
});
