import { CompanyInfos } from "./Company.dto";

export class UserInfos {
    private _id: number | null;
    private _name: string;
    private _email: string;

    get id(): number | null {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }
    constructor(name: string, email: string, id?: number) {
        this._name = name;
        this._email = email;
        this._id = id || null;
    }

    toJSON() {
        return {
            user_id: this.id,
            name: this.name,
            email: this.email,
        };
    }
}

export class UserWithoutPassword extends UserInfos {
    private _company_id: number | null;

    get company_id(): number | null {
        return this._company_id;
    }

    constructor(name: string, email: string, company_id: number | null, id?: number) {
        super(name, email, id)
        this._company_id = company_id === 0 ? null : company_id;
    }

    override toJSON() {
        return {
            user_id: this.id,
            name: this.name,
            email: this.email,
            company_id: this.company_id,
        };
    }
}

export class UserM extends UserWithoutPassword {
    private _password: string;
    private _reset_password: string;

    get password(): string {
        return this._password;
    }

    get reset_password(): string {
        return this._reset_password;
    }

    constructor(name: string, email: string, company_id: number | null, password: string, reset_password: string, id?: number) {
        super(name, email, company_id, id);
        this._password = password;
        this._reset_password = reset_password;
    }

    override toJSON() {
        return {
            user_id: this.id,
            name: this.name,
            email: this.email,
            company_id: this.company_id,
            password: this.password,
            reset_password: this.reset_password,
        };
    }
}


export class UserWithCompany {
    id: number | null;
    name: string;
    email: string;
    company: CompanyInfos;

    constructor(user: UserWithoutPassword, company: CompanyInfos) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.company = company;
    }

    toJSON() {
        return {
            user_id: this.id,
            name: this.name,
            email: this.email,
            company: this.company?.toJSON() || null,
        };
    }
}
