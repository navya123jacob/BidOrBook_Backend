
import mongoose, { Document, Model, Schema } from "mongoose";
import { Admin } from '../../Domain/Admin';


const AdminSchema: Schema<Admin & Document> = new mongoose.Schema({
   
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: true },
  refreshToken: { type: String },
  Fname: { type: String, required: true },
  Lname: { type: String, required: true },
  profile: { type: String, required: true },
  bg:{ type: String, required: true },
  
});

 const AdminModel = mongoose.model<Admin & Document>('Admin', AdminSchema);
export {AdminModel}