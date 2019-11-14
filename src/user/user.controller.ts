import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import User from './user.interface';
import userModel from './user.model';
import eventModel from '../event/event.model';
import UserNotFoundException from '../exceptions/UserNotFoundException';
import AuthFailedException from '../exceptions/AuthFailedException';
import Auth from './user.auth';
 
class UsersController {
  public path = '/users';
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get('/', this.get);
    this.router.get('/:id', this.getById);
    this.router.get('/:id/events', this.getAllEventsForUser);   

    this.router.post('/', this.create);
    this.router.post('/login', this.logIn);
  }
 
    private get(request: express.Request, response: express.Response) {
        userModel.find()
            .then(users => {
                response.send(users);
        })
    }

    private getById = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const id = request.params.id;
        userModel.findById(id)
            .exec()
            .then(user => {
                console.log(user);
                if (user)
                    response.status(200).json(user);
                else
                    next(new UserNotFoundException(id));
            })
            .catch(err => {
                next(err);
            });
    }

    private create(request: express.Request, response: express.Response, next: express.NextFunction) {
        const userData: User = request.body;        
        userModel.find({email: userData.email})
            .exec()
            .then(user => {
                if (user.length >= 1)
                    response.status(409).json({message: 'User already exists'})
                else{
                    Auth.hashPassword(userData.password, 10, (err, hash) => {
                        console.log (hash);
                        if (err)
                            next(err);
                        else {
                            const createdUser = new userModel(userData);
                            createdUser.password = hash;
                            createdUser.save()
                                .then(savedUser => {
                                    response.status(201).json({id: savedUser._id})
                                })
                                .catch(err => {
                                    next(err);
                                });
                        }
                    })
                }
            })
    }

    private logIn(request: express.Request, response: express.Response, next: express.NextFunction) {
        const userData: User = request.body;                
        userModel.findOne({email: userData.email})
            .exec()
            .then(user => {
                if (user == null)
                    return next(new AuthFailedException());
                Auth.ComparePassword(userData.password, user, (err, result) => {
                    if (err) 
                        return next(new AuthFailedException());
                    if (result){
                        const token = jwt.sign(
                            {
                                userId: user._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );
                        return response.status(200).json({message: 'Auth succeeded', token: token});
                    }
                    return next(new AuthFailedException());
                });
            })
            .catch(err => {
                next(err);
            });
    }

    private getAllEventsForUser (request: express.Request, response: express.Response, next: express.NextFunction) {
        eventModel.find({userId: request.params.id})
            .then(events => {
                response.send(events);
            })
            .catch(err => {
                next(err);
            });            
    }    
}
 
export default UsersController;