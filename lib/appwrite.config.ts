import * as sdk from 'node-appwrite';
import dotenv from 'dotenv';

dotenv.config();
export const {
    PROJECT_ID,
    API_KEY,
    DATABASE_ID,
    PATIENT_COLLECTION_ID,
    DOCTOR_COLLECTION_ID,
    APPOINTMENT_COLLECTION_ID,
    NEXT_PUBLIC_BUCKET_ID: BUCKET_ID,
    NEXT_PUBLIC_ENDPOINT: ENDPOINT
} = process.env;

// if (!PROJECT_ID || !API_KEY || !ENDPOINT) {
//     throw new Error('Missing environment variables. Please check your .env file.');
// }

const client = new sdk.Client();

client
    .setEndpoint(ENDPOINT!)
    .setProject(PROJECT_ID!)
    .setKey(API_KEY!);

console.log('Configured endpoint:', ENDPOINT);

export const databases = new sdk.Databases(client);
export const storage = new sdk.Storage(client);
export const messaging = new sdk.Messaging(client);
export const users = new sdk.Users(client);

// Log the client configuration to validate
const clientEndpoint = client.config.endpoint;
console.log('Client endpoint:', clientEndpoint);

export { clientEndpoint };
