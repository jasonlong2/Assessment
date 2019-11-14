import * as mongoose from 'mongoose';
import Event from './event.interface';
 
const eventSchema = new mongoose.Schema({
    type: {type: String, required: true},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},    
    created: { type: Date, default: Date.now }
});
 
const eventModel = mongoose.model<Event & mongoose.Document>('Event', eventSchema);
 
export default eventModel;