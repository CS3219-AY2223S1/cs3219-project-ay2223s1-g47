import mongoose from 'mongoose';
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let MatchModelSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    socketId: {
        type: String,
        required: true
    }
})

export default mongoose.model('MatchModel', MatchModelSchema);
