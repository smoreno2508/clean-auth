import { Request, Response, NextFunction } from "express";
import { JwtAdapter } from "../../config";
import { UserModel } from "../../data/mongodb";

export class AuhtMiddleware {


    static validateJWT = async (req: Request, res: Response, next: NextFunction) => {

        // x-token headers  cvg f 
        const authorization = req.header('Authorization');
        if (!authorization) return res.status(400).json({ error: 'No token provided' });

        if (!authorization.startsWith('Bearer ')) return res.status(400).json({ error: 'Invalid token' });

        const token = authorization.split(' ').at(1) || '';

        try{
            //todo 
            const payload = await JwtAdapter.verifyToken<{id: string}>(token);
            
            if(!payload) return res.status(401).json({ error: 'Invalid token' });
            
            const user = await UserModel.findById(payload.id);

            if(!user) return res.status(401).json({ error: 'Invalid token' });

            req.body.user = user;

        }catch(error){
            console.log(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        next();
    }
}