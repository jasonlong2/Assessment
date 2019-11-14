import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import Controller from './interfaces/controller.interface';
import errorMiddleware from './middleware/error.middleware';
import NotFoundException from './exceptions/NotFoundException';
 
class App {
  public app: express.Application;
  public port: number;
 
  constructor(controllers: Controller[]) {
    this.app = express();

    this.connectToTheDatabase();    
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorHandling();    
  }

  public listen() {
    this.app.listen(process.env.port, () => {
      console.log(`App listening on the port ${process.env.port}`);
    });
  }
  
  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
  }

  private initializeErrorHandling() {
    this.app.use((req, res, next) => {
        const error = new NotFoundException('Not Found');
        next(error);
    })      
    this.app.use(errorMiddleware);
  }

  private initializeControllers(controllers: Controller[]) {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  }

  private connectToTheDatabase() {
    mongoose.connect(`${process.env.MONGO_URI}`, { useNewUrlParser: true, useUnifiedTopology: true, });
  }  
}
 
export default App;