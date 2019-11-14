import { NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import AuthFaileException from '../exceptions/AuthFailedException';
import AuthToken from '../interfaces/authToken.interface';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import userModel from '../user/user.model';

async function authMiddleware(request: RequestWithUser, response: Response, next: NextFunction) {
    if (request.headers.authorization == null)
        return next(new AuthFaileException());
    const token = request.headers.authorization.split(' ')[1];
    const secret = process.env.JWT_KEY;
    try {

        const verificationResponse = jwt.verify(token, secret) as AuthToken;
        console.log(verificationResponse);         
        const user = await userModel.findById(verificationResponse.userId);
        if (user) {
            request.user = user;
            next();
        }
        else {
            next(new AuthFaileException());
        }
    }
    catch (error) {
        console.log(error);
        next(new AuthFaileException());
    }
}

export default authMiddleware;