import RoomModel from './room-model';
import PendingMatchModel from './pending-match-model';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

const mongoDb = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;
mongoose.connect(mongoDb ? mongoDb : "mongodb://localhost:27017/mydb");

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createRoom(room: any) { 
  return new RoomModel(room);
}

export async function createPendingMatch(pendingMatch: any) { 
  return new PendingMatchModel(pendingMatch);
}

export async function deletePendingMatch(conditions: any) { 
  PendingMatchModel.deleteOne(conditions).exec();
}

export async function match(conditions: any) { 
  return PendingMatchModel.find(conditions)
        .sort({created_at: 1}) // Sort by oldest
        .limit(1)
        .exec();
}

