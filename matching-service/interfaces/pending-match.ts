import * as mongoose from 'mongoose';

export interface PendingMatch extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    socketId: string;
};