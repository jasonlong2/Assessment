import App from './app';
import 'dotenv/config';
import UsersController from './user/user.controller';
import EventsController from './event/event.controller';

const app = new App(
  [
    new UsersController(),
    new EventsController()
  ]
);
 
app.listen();