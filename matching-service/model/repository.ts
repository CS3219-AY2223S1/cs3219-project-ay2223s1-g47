import RoomModel from './room-model';
import PendingMatchModel from './pending-match-model';
import 'dotenv/config';

//Set up mongoose connection
import mongoose, { FilterQuery } from 'mongoose';
import { PendingMatch } from '../interfaces/pending-match';
import { Room } from '../interfaces/room';
import { FALLBACK_DB_URI, PROD } from '../config';

const mongoDb = process.env.MODE == PROD ?
        process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
mongoose.connect(mongoDb ? mongoDb : FALLBACK_DB_URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createRoom(room: Partial<Room>) { 
  return new RoomModel(room);
}

export async function createPendingMatch(pendingMatch: Partial<PendingMatch>) { 
  return new PendingMatchModel(pendingMatch);
}

export async function deletePendingMatch(filter: FilterQuery<PendingMatch>) { 
  PendingMatchModel.deleteOne(filter).exec();
}

export async function match(filter: FilterQuery<PendingMatch>) { 
    return PendingMatchModel.findOne(filter)
        .sort({created_at: 1}) // Sort by oldest
        .exec();
}

