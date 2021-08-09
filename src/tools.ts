import * as fs from 'fs';
import * as util from 'util';
import * as admin from 'firebase-admin';
import constants from './constants';
import _ from 'lodash';
import CliSpinner from 'cli-spinner';
import chalk from 'chalk';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

/**
 * Provides a blue color wrapper for console output.
 * @param msg Message string
 */
const blue = chalk.hex("#0078D4");
/**
 * Provides a red color wrapper for console output.
 * @param msg Message string
 */
const red = chalk.hex("#FF0101");

class Spinner {

    private spinner: CliSpinner.Spinner;

    constructor(loadingMsg: string) {
        this.spinner = new CliSpinner.Spinner(`${blue("%s ")} ${loadingMsg}...`);
        this.spinner.setSpinnerDelay(50);
    }

    public start() {
        this.spinner.start();
    }

    public end(endMsg = "", final = "\n") {
        this.spinner.stop();
        console.log(`${final}${endMsg}`)
    }

}

function selectedOptions(expressions: Array<Boolean | undefined>): Number {
    let result = expressions.map(exp => exp ? 1 : 0);
    return _.sum(result);
}

async function downloadBackup(data: any) {
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

async function uploadBackup() {
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

async function readSettings() {
    try {
        const settingsData = await readFile(constants.settingsFile);
        const settings = JSON.parse(settingsData.toString());
        return settings;
    } catch (error) {
        console.log("Unable to open settings file.");
        // console.log(`No such file at path ${error.toString().match(/'.+'/g)}.`);
        // process.exit(1);
        return undefined;
    }
}

async function readKey() {
    try {
        let serviceAccount = await readFile(constants.settings.keyFile);
        return JSON.parse(serviceAccount.toString());
    } catch (error) {
        console.log(red("Error: Unable to open service key."));
        console.log(`No such file at path ${error.toString().match(/'.+'/g)}.`);
        process.exit(1);
    }
}

async function initializeApp() {
    const key = await readKey();
    admin.initializeApp({
        credential: admin.credential.cert(key),
        databaseURL: constants.settings.databaseURL
    })
    return admin.firestore();
}

export { 
    Spinner, blue, red,
    selectedOptions,
    downloadBackup, uploadBackup,
    readSettings, readKey,
    initializeApp 
};
