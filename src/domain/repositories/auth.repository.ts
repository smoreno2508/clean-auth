import { UserEntity } from "../entities/user.entity";
import { RegisterUserDto, LoginUserDTO } from "..";

export abstract class AuthRepository {
    
    abstract register(registerUserDto:RegisterUserDto): Promise<UserEntity>;
    abstract login(loginUserDTO:LoginUserDTO): Promise<UserEntity>;
    
}