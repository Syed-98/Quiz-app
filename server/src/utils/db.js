import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const connectionString = process.env.MONGODB_URI;

  if (!connectionString) {
    throw new Error('Missing MONGODB_URI. Add it to your .env file.');
  }

  mongoose.set('strictQuery', true);

  await mongoose.connect(connectionString);
  isConnected = true;

  console.log('MongoDB connected'); // eslint-disable-line no-console
  return mongoose.connection;
};

export const disconnectDB = async () => {
  if (!isConnected) return;
  await mongoose.disconnect();
  isConnected = false;
};

