import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto, LoginUserDTO } from "..";

export abstract class AuthDataSource {

    abstract login(loginUserDTO: LoginUserDTO): Promise<UserEntity>;
    abstract register(registerUserDto:RegisterUserDto): Promise<UserEntity>;
    
}