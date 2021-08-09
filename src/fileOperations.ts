import * as fs from 'fs';
import * as util from 'util';
import constants from './constants';
import { red, Spinner } from './utility';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

export async function createSettings() {
    const jsonData = JSON.stringify(constants.settings, null, 4);
    let sp = new Spinner("Creating settings file");
    sp.start();
    try {
        await writeFile(constants.settingsFile, jsonData);
        sp.end('Settings file created successfully.');
    } catch (error) {
        sp.end(red("Error: Unable to create settings file."));
        process.exit(1);
    }
}

export async function readSettings() {
    try {
        const settingsData = await readFile(constants.settingsFile);
        const settings = JSON.parse(settingsData.toString());
        return settings;
    } catch (error) {
        console.log("Unable to open settings file.");
        return {};
    }
}

export async function readKey() {
    try {
        let serviceAccount = await readFile(constants.settings.keyFile);
        return JSON.parse(serviceAccount.toString());
    } catch (error) {
        console.log(red("Error: Unable to open service key."));
        console.log(`No such file at path ${error.toString().match(/'.+'/g)}.`);
        process.exit(1);
    }
}

export async function downloadBackup(data: any) {
    const jsonData = JSON.stringify(data, null, 4);
    let sp = new Spinner("Downloading backup");
    sp.start();
    try {
        await writeFile(constants.settings.backupFile, jsonData);
        sp.end('Backup downloaded successfully.');
    } catch (error) {
        sp.end(red("Error: Unable to download backup."));
        process.exit(1);
    }
}

export async function readBackup() {
    let sp = new Spinner("Retrieving backup");
    sp.start();
    try {
        const data = await readFile(constants.settings.backupFile);
        const jsonData = JSON.parse(data.toString());
        sp.end('Backup retrieved successfully.');
        return jsonData;
    } catch (error) {
        sp.end(red("Error: Unable to retrieve backup."));
        console.log(`No such file at path ${error.toString().match(/'.+'/g)}.`);
        process.exit(1);
    }
}