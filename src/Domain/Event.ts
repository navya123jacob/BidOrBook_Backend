import  {  Document } from 'mongoose';
export interface IEvent extends Document {
    name: string;
    type: 'Photographer' | 'Artist';
    
  }