import RoomModel from './room-model.js';
import PendingMatchModel from './pending-match-model.js';
import 'dotenv/config';

//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

export async function createRoom(room) { 
  return new RoomModel(room);
}

export async function createPendingMatch(pendingMatch) { 
  return new PendingMatchModel(pendingMatch);
}

export async function deletePendingMatch(conditions) { 
  PendingMatchModel.deleteOne(conditions).exec();
}

export async function match(conditions) { 
  return PendingMatchModel.find(conditions)
        .sort({created_at: 1}) // Sort by oldest
        .limit(1)
        .exec();
}

