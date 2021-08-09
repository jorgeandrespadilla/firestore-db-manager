import * as admin from 'firebase-admin';
import initializeApp from './firestore';
import { Spinner } from "./utility";

async function deleteDocument(document: FirebaseFirestore.DocumentReference) {
    deleteCollections(document);
    document.delete();
}

async function deleteCollection(collection: admin.firestore.CollectionReference) {
    let documents = await collection.listDocuments();
    for (let document of documents) {
        await deleteDocument(document);
    }
}

async function deleteCollections(ref: admin.firestore.Firestore | admin.firestore.DocumentReference) {
    let collections = await ref.listCollections();
    for (let collection of collections) {
        await deleteCollection(collection);
    }
}

async function deleteDatabase() {
    const db = await initializeApp();
    let sp = new Spinner("Deleting database");
    sp.start();
    await deleteCollections(db);
    sp.end("Database deleted successfully.")
}

export default deleteDatabase;