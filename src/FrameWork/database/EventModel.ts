
import mongoose, { Schema, Document } from 'mongoose';

interface IEvent extends Document {
  name: string;
  type: 'Photographer' | 'Artist';
  
}

const EventSchema: Schema = new Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
 
});

const EventModel = mongoose.model<IEvent>('Event', EventSchema);

export { EventModel };
