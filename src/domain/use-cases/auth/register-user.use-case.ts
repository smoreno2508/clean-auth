import { JwtAdapter } from '../../../config';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { CustomError } from '../../errors/custom.errors';
import { AuthRepository } from '../../repositories/auth.repository';

interface UserRegisterInfo {
    user: {
        id: string;
        name: string;
        email: string;
    }
}

type SignToken = (payload:Object, duratio?:string) => Promise<string | null>;

interface RegisterUserUseCase {
    execute(registerUserDto: RegisterUserDto): Promise<UserRegisterInfo>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository: AuthRepository,
        private readonly signToken: SignToken = JwtAdapter.generateToken,
    ) { }

    async execute(registerUserDto: RegisterUserDto): Promise<UserRegisterInfo> {

        //crear usuario
        const user = await this.authRepository.register(registerUserDto);

        //crear token
        const token = await this.signToken({ id: user.id, duration: '1h' });
        
        if(!token) throw CustomError.internalServer('Error creating token');

        return {
            user: {
                id: user.id.toString(),
                name: user.name,
                email: user.email,
            }
        }
    }
}