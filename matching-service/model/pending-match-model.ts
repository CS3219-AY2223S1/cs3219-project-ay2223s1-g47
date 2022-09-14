import mongoose from 'mongoose';
import { PendingMatch } from '../interfaces/pending-match';
var Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

let PendingMatchModelSchema = new Schema({
    userId: {
        type: ObjectId,
        required: true
    },
    socketId: {
        type: String,
        required: true
    }
})

export default mongoose.model<PendingMatch>('PendingMatchModel', PendingMatchModelSchema);
