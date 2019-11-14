import * as mongoose from 'mongoose';
import User from './user.interface';
 
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    phone: {type: String, match: /^\d{3}-\d{3}-\d{4}$/}    
});
 
const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);
 
export default userModel;