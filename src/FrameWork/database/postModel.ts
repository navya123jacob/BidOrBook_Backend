import mongoose, { Schema, Model } from 'mongoose';
import { Post } from '../../Domain/postEntity';

const postSchema: Schema = new mongoose.Schema({
  userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});


const PostModel: Model<Post> = mongoose.model<Post>('Post', postSchema);

export { PostModel };
