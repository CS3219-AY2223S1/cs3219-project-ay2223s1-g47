import mongoose from 'mongoose';
import { Room } from '../interfaces/room';

var Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let RoomModelSchema = new Schema({
    userIds: {
        type: [ObjectId],
        required: true
    },
    difficulty: {
        type: Number,
        required: true,
    }
})

export default mongoose.model<Room>('RoomModel', RoomModelSchema);
