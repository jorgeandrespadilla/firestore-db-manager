import * as admin from 'firebase-admin';
import { readKey, readSettings } from "./fileOperations";
import constants from './constants';
import { red } from './utility';

type Settings = { "backupFile": string, "keyFile": string, "databaseURL": string, [key: string]: string };

async function loadSettings() {
    const settings = await readSettings();
    let mergedConf: Settings = Object.assign({}, constants.settings, settings);
    constants.settings.backupFile = mergedConf.backupFile;
    constants.settings.keyFile =  mergedConf.keyFile;
    constants.settings.databaseURL =  mergedConf.databaseURL;
}

async function initializeApp() {
    const key = await readKey();
    await loadSettings();
    try {
        admin.initializeApp({
            credential: admin.credential.cert(key),
            databaseURL: constants.settings.databaseURL
        })
        return admin.firestore();
    } catch (error) {
        console.log(red("Error: Unable to initialize Firebase services."));
        process.exit(1);
    }   
}

export default initializeApp;