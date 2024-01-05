export class Roles {
    private _id: number | null;
    private _name: string;
    private _description: string;

    get id(): number | null {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get description(): string {
        return this._description;
    }

    constructor(name: string, description: string, id?: number) {
        this._name = name;
        this._description = description;
        this._id = id || null;
    }

    toJSON() {
        return {
            role_id: this.id,
            name: this.name,
            description: this.description,
        };
    }
}
