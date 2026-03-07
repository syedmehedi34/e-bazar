// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local or your deployment environment variables.",
  );
}

/**
 * Global object is used to maintain a cached connection across hot-reloads
 * in development (prevents exponential connection growth during API route usage).
 */
const cached = globalThis.mongooseCache || {
  conn: null,
  promise: null,
};

/**
 * Connect to MongoDB with proper serverless-friendly options
 * @returns {Promise<typeof mongoose>} Mongoose connection instance
 */
async function dbConnect() {
  // Return existing connection if already established and healthy
  if (cached.conn?.readyState === 1) {
    return cached.conn;
  }

  // If there's an ongoing connection attempt, wait for it
  if (cached.promise) {
    return cached.promise;
  }

  try {
    const opts = {
      // Serverless best practices
      bufferCommands: false, // Fail fast instead of buffering
      maxPoolSize: 10, // Reasonable for most apps (Atlas free tier friendly)
      minPoolSize: 2,
      maxIdleTimeMS: 10000, // Close idle connections
      serverSelectionTimeoutMS: 5000, // Fail fast on selection
      socketTimeoutMS: 20000, // Prevent hanging sockets
      family: 4, // Prefer IPv4 (helps in some environments)

      // Optional: modern compression (reduces bandwidth)
      compressors: ["zlib"],

      // Heartbeat frequency (helps detect connection issues faster)
      heartbeatFrequencyMS: 10000,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connection established");

        // Optional: log connection events in production for monitoring
        if (process.env.NODE_ENV === "production") {
          mongooseInstance.connection.on("connected", () => {
            console.log("MongoDB re-connected");
          });

          mongooseInstance.connection.on("error", (err) => {
            console.error("MongoDB connection error:", err);
          });

          mongooseInstance.connection.on("disconnected", () => {
            console.warn("MongoDB disconnected — will attempt to reconnect");
          });
        }

        return mongooseInstance;
      })
      .catch((error) => {
        console.error("❌ MongoDB connection failed:", error.message);
        cached.promise = null; // Reset so next call can retry
        throw error;
      });

    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

// Assign to globalThis only in development (hot-reload support)
if (process.env.NODE_ENV !== "production") {
  globalThis.mongooseCache = cached;
}

export default dbConnect;
