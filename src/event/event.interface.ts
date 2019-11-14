interface Event {
    _id: string;  
    type: string;
    userId: string;
    created: Date;
  }
   
  export default Event;