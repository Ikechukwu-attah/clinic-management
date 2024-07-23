"use server";

import { Query, ID } from "node-appwrite";
import { BUCKET_ID, DATABASE_ID, databases, ENDPOINT, PATIENT_COLLECTION_ID, PROJECT_ID, storage, users } from "../appwrite.config";
import { parseStringify } from "@/app/lib/utils";
import { InputFile} from "node-appwrite/file"

export const createUser = async (user: CreateUserParams) => {
    console.log("User data received:", user);

    try {
        console.log("Creating user with email:", user.email);
        
        // Validate the client endpoint
        const clientEndpoint = users.client.config.endpoint;
        console.log("Client endpoint:", clientEndpoint);
        // if (!clientEndpoint) {
        //     throw new Error("Invalid API endpoint. Please check your Appwrite configuration.");
        // }
        
        const newUser = await users.create(
            ID.unique(),
            user.email,
            user.phone,
            undefined,
            user.name,
        );
        console.log("User created successfully:", newUser);
        return parseStringify(newUser);
    } catch (error: any) {
        console.error("Error creating user:", error);
        if (error && error?.code === 409) {
            try {
                console.log("User already exists, fetching existing user with email:", user.email);
                const existingUser = await users.list([
                    Query.equal("email", [user.email])
                ]);
                console.log("Existing user found:", existingUser);
                return existingUser?.users?.[0];
            } catch (listError) {
                console.error("Error fetching existing user:", listError);
                throw listError; // Re-throw the error to handle it higher up if needed
            }
        } else {
            throw error; // Re-throw the error to handle it higher up if needed
        }
    }
};


export const getUser = async (userId:string) => {
    console.log("user id", userId)

    try {
        const user = await users.get(userId);
        return parseStringify(user);
    } catch (error) {
        console.log(error)
    }
}



export const registerPatient = async ({identificationDocument,...patient}:RegisterUserParams) => {
    
    try {
        let file;
        if (identificationDocument) {
            const inputFile = InputFile.fromBuffer(
                identificationDocument?.get('blobFile') as Blob,
                identificationDocument?.get('fileName') as string
            )

            file = await storage.createFile(BUCKET_ID!,ID.unique(), inputFile)
        }

         console.log("BUCKET_ID", BUCKET_ID, "DATABASE_ID", DATABASE_ID, "PATIENT_COLLECTION_ID", PATIENT_COLLECTION_ID)

        
        
        
        const newPatient = await databases.createDocument(DATABASE_ID!, PATIENT_COLLECTION_ID!, ID.unique(),
            {
                identificationDocument: file?.$id || null,
                identificationDocumentUrl: `${ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${file?.$id}/view?project=${PROJECT_ID}`,
                ...patient
            });

        return parseStringify(newPatient);
    } catch (error) {
        console.log('Error creating patient:',error)
    }
}