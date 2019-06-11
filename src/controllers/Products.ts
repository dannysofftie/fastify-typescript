import Controller from '../utils/Controller';

export default class Prouducts extends Controller {
    public async addNewEntry(): Promise<any> {
        throw new Error('Method not impelemented');
    }

    public async findAllEntries(): Promise<any> {
        const users = await this.app.db.User.aggregate([
            {
                $match: {},
            },
        ]);

        return users;
    }

    public async findOneAndUpdate(): Promise<any> {
        throw new Error('Method not implemented.');
    }

    public async findOneEntry() {
        throw new Error('Method not implemented');
    }

    public async authenticate() {
        throw new Error('Method not impelemented');
    }

    /**
     * Get user by token, currently logged in user
     *
     * @returns
     * @memberof Platformusers
     */
    public async getOneItem() {
        throw new Error('Method not implemeted');
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
