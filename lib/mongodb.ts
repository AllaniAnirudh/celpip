// import mongoose from 'mongoose'

// const MONGODB_URI = process.env.MONGODB_URI!

// if (!MONGODB_URI) {
//   throw new Error('Please define the MONGODB_URI environment variable inside .env.local')
// }

// type MongooseCache = {
//   conn: typeof mongoose | null
//   promise: Promise<typeof mongoose> | null
// }

// declare global {
//   // eslint-disable-next-line no-var
//   var mongoose: MongooseCache | undefined
// }

// const globalAny = global as typeof globalThis & { mongoose?: MongooseCache }

// let cached: MongooseCache = globalAny.mongoose || { conn: null, promise: null }
// globalAny.mongoose = cached

async function dbConnect() {
  // Mock database connection for local testing
  console.log('Mock database connection - MongoDB disabled for local testing')
  return null
}

export default dbConnect 