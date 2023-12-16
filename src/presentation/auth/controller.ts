import { Request, Response } from 'express';
import { CustomError, RegisterUserDto, RegisterUser, LoginUser, LoginUserDTO } from '../../domain';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { JwtAdapter } from '../../config';
import { UserModel } from '../../data/mongodb';

export class AuthController {

    constructor(
        private readonly authRepository: AuthRepository
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) return res.status(error.statusCode).json({ error: error.message });
        console.log(error);
        return res.status(500).json({ error: 'Internal server error' });
    }

    registerUser = (req: Request, res: Response) => {

        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        new RegisterUser(this.authRepository)
            .execute(registerUserDto!)
            .then(data => res.json(data))
            .catch(error => this.handleError(error, res));
    }


    loginUser = (req: Request, res: Response) => {
        const [error, loginUserDTO] = LoginUserDTO.create(req.body);
        
        if (error) return res.status(400).json({ error });

        new LoginUser(this.authRepository)
        .execute(loginUserDTO!)
        .then(data => res.json(data))
        .catch(error => this.handleError(error, res));

    }

    getUsers = (req: Request, res: Response) => {
        UserModel.find().then(users => res.json({
            // users: users,
            user: req.body.user
        })).catch(error => this.handleError(error, res));
    }
}