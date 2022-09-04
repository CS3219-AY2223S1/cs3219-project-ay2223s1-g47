import mongoose from 'mongoose';

var Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

let RoomModelSchema = new Schema({
    userIds: {
        type: [ObjectId],
        required: true
    }
})

export default mongoose.model('RoomModel', RoomModelSchema)
