import * as express from 'express';
import Event from './event.interface';
import EventModel from './event.model';
import authMiddleware from '../middleware/auth.middleware';
import RequestWithUser from '../interfaces/requestWithUser.interface';
 
class EventsController {
  public path = '/events';
  public router = express.Router();
 
  constructor() {
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get('/', this.get);
    this.router
        .all(`/*`, authMiddleware)      
        .post('/', this.create);
  }
 
    private get(request: express.Request, response: express.Response) {
        var forLastDay = request.param("ForLastDay");
        var conditions = {};
        if (forLastDay != null && forLastDay.toLowerCase() == 'true')
        {
            console.log('hello');
            var lastDay = new Date();
            lastDay.setDate(lastDay.getDate() - 1);            
            conditions = {created: {"$gte": lastDay}}
        }
        console.log(conditions);
        EventModel.find(conditions)
            .then(events => {
                response.send(events);
        })
    }

    private getForLastDay (request: express.Request, response: express.Response, next: express.NextFunction) {
        EventModel.find({created: {"$gte": new Date().getDate() -1}})
            .then(events => {
                response.send(events);
            })
            .catch(err => {
                next(err);
            });            
    }    

    private create(request: RequestWithUser, response: express.Response, next: express.NextFunction) {
        const eventData: Event = request.body;
        const createdEvent = new EventModel(eventData);
        createdEvent.userId = request.user._id;
        createdEvent.save()
            .then(createdEvent => {
                response.status(201).json(createdEvent)
            })
            .catch(err => {
                next(err);
            });
    }  
    
}
 
export default EventsController;