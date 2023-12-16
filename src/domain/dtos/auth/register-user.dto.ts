import { Validators } from "../../../config";

export class RegisterUserDto {
    
    private constructor(
        public name: string,
        public email: string,
        public password: string
    ){}

    static create(object: {[key: string]: any}): [string?, RegisterUserDto?] {
        const { name, email, password } = object;
        
        if( !name ) return ['name is required'];
        if( !email ) return ['email is required'];
        if( !Validators.email.test(email) ) return ['Email is not valid'];
        if( !password ) return ['password is required'];
        if( password.length < 6 ) return ['password to short'];

        return [
            undefined,
            new RegisterUserDto(name, email, password)
        ];
    }
}