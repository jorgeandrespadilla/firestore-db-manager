import * as _ from 'lodash';
import * as admin from 'firebase-admin';
import { Spinner } from "./utility";
import initializeApp from './firestore';
import { downloadBackup } from './fileOperations';


function normalizeField(value: any, db: admin.firestore.Firestore): any {
    if (value instanceof admin.firestore.Timestamp) {
        return {
            "__datatype__": "timestamp",
            "value": { "seconds": value.seconds, "nanoseconds": value.nanoseconds }
        };
    }
    else if (value instanceof admin.firestore.GeoPoint) {
        return {
            "__datatype__": "geopoint",
            "value": { "latitude": value.latitude, "longitude": value.longitude }
        };
    }
    else if (value instanceof admin.firestore.DocumentReference) {
        return {
            "__datatype__": "documentRef",
            "value": value.path
        };
    }
    else if (Array.isArray(value)) {
        return value.map(subfield => normalizeField(subfield, db));
    }
    else if (typeof value === 'object' && value !== null) {
        return saveFields(value, db);
    }
    return value;
}

function saveFields<T>(fields: Object | undefined, db: admin.firestore.Firestore) {
    let result: { [key: string]: any } = {};
    if (_.isEmpty(fields)) {
        // console.log("No fields were found.");
    }
    else {
        for (let [key, value] of Object.entries(fields as Object)) {
            result[key] = normalizeField(value, db);
        }
    }
    return result;
}

async function saveDocument(document: admin.firestore.DocumentReference, db: admin.firestore.Firestore) {
    // console.log(`Found document with ID: ${document.id}`);
    let collections = await saveCollections(document, db);

    let fields = await document.get();
    let normalizedFields = saveFields(fields.data(), db);

    return { [document.id]: { "__fields__": normalizedFields, "__collections__": collections } };
}

async function saveCollection(collection: admin.firestore.CollectionReference, db: admin.firestore.Firestore) {
    // console.log(`Found collection with ID: ${collection.id}`);
    let documents = await collection.listDocuments();
    let result = {};
    if (_.isEmpty(documents)) {
        // console.log("No documents were found.")
    }
    else {
        let queries = [];
        for (let document of documents) {
            queries.push(await saveDocument(document, db));
        }
        result = Object.assign({}, ...queries);
    }
    // console.log({ [collection.id]: result });
    return { [collection.id]: result };
}

// Iterates over a collection list and returns an object with all the retrieved data associated to its corresponding id.
async function saveCollections(currentRef: FirebaseFirestore.Firestore | admin.firestore.DocumentReference, db: admin.firestore.Firestore) {
    let collections = await currentRef.listCollections();
    let result = {};
    if (_.isEmpty(collections)) {
        // console.log("No collections were found.");
    }
    else {
        let queries = [];
        for (let collection of collections) {
            // console.log(`Found collection with ID: ${collection.id}`);
            queries.push(await saveCollection(collection, db));
        }
        result = Object.assign({}, ...queries);
    }
    return result;
}

async function createBackup() {
    const db = await initializeApp();
    let sp = new Spinner("Generating backup");
    sp.start();
    let backup = await saveCollections(db, db);
    sp.end("", "");
    await downloadBackup(backup);
}

export default createBackup;