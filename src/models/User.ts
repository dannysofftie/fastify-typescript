import { Document, Schema, HookNextFunction, model } from 'mongoose';

export interface IUser {
    account: 'usertype1' | 'usertype2' | 'usertype3' | 'usertype4' | 'usertype5';
    email: string;
    name: string;
    idnumber: number;
    phone: string;
    password: string;
    createdat: Date;
    updatedat: Date | number;
}

export interface IUserDocument extends IUser, Document {}

const user = new Schema<IUserDocument>({
    account: {
        type: String,
        enum: ['usertype1', 'usertype2', 'usertype3', 'usertype4', 'usertype5'],
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
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

user.pre<IUserDocument>('update', function(next: HookNextFunction) {
    this['updatedat'] = Date.now();

    // do other pre-updates here
    next();
});

export const User = model<IUserDocument>('users', user);
