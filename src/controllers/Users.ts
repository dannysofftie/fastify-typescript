import Controller from '../utils/Controller';

export default class Users extends Controller {
    public async findAllEntries(): Promise<any> {
        throw new Error('Method not implemented');
    }

    public async findOneAndUpdate(): Promise<any> {
        throw new Error('Method not implemented');
    }

    public async addNewEntry(): Promise<any> {
        throw new Error('Method not implemented');
    }

    public async findOneEntry(): Promise<any> {
        throw new Error('Method not implemented');
    }
    public async authenticate() {
        throw new Error('Method not impelemented');
    }
    /**
     * Reset user password, to a an auto-generated password
     *
     * @returns
     * @memberof Platformusers
     */
    public async resetUserPassword() {
        throw new Error('Method not implemented');
    }
}
