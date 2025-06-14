import { v4 as uuidv4 } from 'uuid';
import { Schema, model } from 'mongoose';

const videoSchema = new Schema({
  uuid: {
    type: String,
    immutable: true,
    default: () => uuidv4(),
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
}, { collection: 'Videos' });

export const Video = model('Video', videoSchema);
