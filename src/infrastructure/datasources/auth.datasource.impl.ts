import { UserModel } from "../../data/mongodb";
import { AuthDataSource, CustomError, RegisterUserDto, UserEntity, LoginUserDTO} from "../../domain";
import { BcryptAdapter } from '../../config/bcrypt';
import { UserMapper } from "../mappers/user.mapper";

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDataSourceImpl implements AuthDataSource {

    constructor(
        private readonly hashPassword: HashFunction = BcryptAdapter.hash,
        private readonly comparePassword: CompareFunction = BcryptAdapter.compare,
    ) { }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        const { name, email, password } = registerUserDto

        try {


            const existUser = await UserModel.findOne({ email });

            if (existUser) throw CustomError.badRequest('User is already registered');

            const user = await UserModel.create({
                name,
                email,
                password: this.hashPassword(password),
            });

            await user.save();

            return UserMapper.userEntityFromObject(user);

        } catch (error) {

            if (error instanceof Error) throw error;

            throw CustomError.internalServer();
        }

    }

    async login(loginUserDTO: LoginUserDTO): Promise<UserEntity> {

        const { email, password } = loginUserDTO;
        try {

            const existUser = await UserModel.findOne({ email });

            if (!existUser) throw CustomError.badRequest('Invalid user or password');

            const isPasswordValid = this.comparePassword(password, existUser.password);

            if (!isPasswordValid) throw CustomError.badRequest('Invalid user or password');

            return UserMapper.userEntityFromObject(existUser);

        } catch (error) {
            if (error instanceof Error) throw error;
            throw CustomError.internalServer();
        }

    }



}