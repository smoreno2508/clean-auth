import { AuthDataSource, AuthRepository, RegisterUserDto, UserEntity, LoginUserDTO } from "../../domain";


export class AuthRepositoryImpl implements AuthRepository {
    
    constructor(
        private readonly authDataSource: AuthDataSource,
    ) {}

    register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.authDataSource.register(registerUserDto);
    }

    login(loginUserDTO:LoginUserDTO): Promise<UserEntity> {
        return this.authDataSource.login(loginUserDTO);
    }
}