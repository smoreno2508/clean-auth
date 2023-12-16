import { Validators } from "../../../config";

export class LoginUserDTO{
    constructor(
        public email: string,
        public password: string
    ){}

    static create(object: {[key: string]: any}): [string?, LoginUserDTO?] {
        const { name, email, password } = object;
        
        if( !email ) return ['email is required'];
        if( !Validators.email.test(email) ) return ['Email is not valid'];
        if( !password ) return ['password is required'];
        if( password.length < 6 ) return ['password to short'];

        return [
            undefined,
            new LoginUserDTO(email, password)
        ];
    }
}