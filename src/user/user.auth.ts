import * as bcrypt from 'bcrypt';
import User from './user.interface';

export default class Auth {

    public static hashPassword(password: string, rounds: number, callback: (error: Error, hash: string) => void) : void {
        if (password == null || password.length == 0)
            callback(null, "");
        else
            bcrypt.hash(password, rounds, (error: Error, hash: string) => {
                callback(error, hash);
            });
    }

    public static ComparePassword(password: string, user: User, callback: (error: Error, result: boolean) => void) : void {
        bcrypt.compare(password, user.password, (err, result) => {
            callback (err, result);
        });
    }    
}