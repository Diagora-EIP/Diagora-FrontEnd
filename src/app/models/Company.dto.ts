export class CompanyInfos {
    private _id: number | null;
    private _name: string;
    private _address: string;

    get id(): number | null {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): string {
        return this._address;
    }

    constructor(name: string, address: string, id?: number) {
        this._id = id || null;
        this._name = name;
        this._address = address;
    }

    toJSON() {
        return {
            company_id: this.id,
            name: this.name,
            address: this.address,
        };
    }
}
