import * as _ from 'lodash';
import * as admin from 'firebase-admin';
import { uploadBackup, initializeApp, Spinner } from "./tools";

function convertField(value: any, db: admin.firestore.Firestore): any {
    if (typeof value === 'object' && value !== null && !_.isArray(value) && "__datatype__" in value) {
        let dt = value.__datatype__;
        let data = value.value;
        if (dt === "timestamp") {
            return new admin.firestore.Timestamp(data.seconds, data.nanoseconds);
        }
        else if (dt === "geoPoint") {
            return new admin.firestore.GeoPoint(data.latitude, data.longitude);
        }
        else if (dt === "documentRef") {
            return db.doc(data);
        }
    }
    else if (Array.isArray(value)) {
        return value.map(subfield => convertField(subfield, db));
    }
    else if (typeof value === 'object' && value !== null) {
        return restoreFields(value, db);
    }
    return value;
}

function restoreFields<T>(fields: Object | undefined, db: admin.firestore.Firestore) {
    let result: { [key: string]: any } = {};

    if (!_.isEmpty(fields)) {
        for (let [key, value] of Object.entries(fields as Object)) {
            result[key] = convertField(value, db);
        }
    }
    return result;
}

async function restoreDocument(document: any, ref: admin.firestore.DocumentReference, db: admin.firestore.Firestore) {
    await restoreCollections(document.__collections__, ref, db);
    let normalizedFields = restoreFields(document.__fields__, db);
    await ref.set(normalizedFields);
}

async function restoreCollection(collection: any, ref: admin.firestore.CollectionReference, db: admin.firestore.Firestore) {
    for (let [document, content] of Object.entries(collection)) {
        await restoreDocument(content, ref.doc(document), db);
    }
}

async function restoreCollections(collections: any, ref: FirebaseFirestore.Firestore | admin.firestore.DocumentReference, db: admin.firestore.Firestore) {
    if (!_.isEmpty(collections)) {
        for (let [collection, content] of Object.entries(collections)) {
            await restoreCollection(content, ref.collection(collection), db);
        }
    }
}

async function restoreBackup() {
    const db = await initializeApp();
    const backup = await uploadBackup();
    let sp = new Spinner("Restoring backup");
    sp.start();
    await restoreCollections(backup, db, db);
    sp.end('Backup restored successfully.');
}

export default restoreBackup;