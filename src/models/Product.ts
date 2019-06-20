import { Document, HookNextFunction, model, Schema } from 'mongoose';

export interface IProject {
    title: string;
    description: string;
    createdat: Date | string;
    updatedat: Date | number | string;
}

export interface IProjectDocument extends IProject, Document {}

const project = new Schema<IProjectDocument>({
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    createdat: {
        type: Date,
        default: Date.now,
    },
    updatedat: {
        type: Date,
        default: Date.now,
    },
});

project.pre<IProjectDocument>('update', function(next: HookNextFunction) {
    this['updatedat'] = Date.now();

    // do other pre-updates here

    next();
});

export const Product = model<IProjectDocument>('projects', project);
