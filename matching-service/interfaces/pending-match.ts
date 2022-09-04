import * as mongoose from 'mongoose';

export interface PendingMatch extends mongoose.Document {
    userId: string;
    socketId: string;
}