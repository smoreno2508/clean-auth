import { JwtAdapter } from '../../../config';
import { CustomError } from '../../errors/custom.errors';
import { AuthRepository } from '../../repositories/auth.repository';
import { LoginUserDTO } from '../../dtos/auth/login-user.dto';

interface UserToken {
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
    }
}

type SignToken = (payload:Object, duratio?:string) => Promise<string | null>;

interface LoginUserUseCase {
    execute(loginUserDTO: LoginUserDTO): Promise<UserToken>;
}

export class LoginUser implements LoginUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken,
    ) { }

    async execute(loginUserDTO: LoginUserDTO): Promise<UserToken> {

        
        const user = await this.authRepository.login(loginUserDTO);

        const token = await this.signToken({ id: user.id, duration: '1h' });
        
        if(!token) throw CustomError.internalServer('Error creating token');

        return {
            token: token as string,
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
            }
        }
    }
}