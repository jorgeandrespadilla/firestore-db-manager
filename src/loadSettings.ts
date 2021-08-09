import * as _ from 'lodash';
import promptSync from 'prompt-sync';
import chalk from 'chalk'; //RED: #ff0101 //GREEN: #0ecc21
import { readSettings } from "./tools";
import constants from './constants';

const prompt = promptSync({ sigint: true });

type Settings = { "backupFile": string, "keyFile": string, "databaseURL": string, [key: string]: string };

const structureMessage = `
The configuration file should have the following structure:
    {
        "backupFile": "...", --> *(default: "backup.json")
        "keyFile": "...",  --> *(default: "key.json")
        "databaseURL": "..."
    }
The "databaseURL" property is required.
`;

async function loadSettings() {
    try {
        const settings = await readSettings();
        //console.log(settings);
        if (!("databaseURL" in settings)) {
            console.log(
                chalk.hex("#ff0101")(
                    `"databaseURL" property must be provided.`
                )
            );
            console.log(
                chalk.hex("#ffffff").bold(`\nFill all the requested parameters.`)
            );
            settings.databaseURL = prompt("\tDatabase URL: ");
        }
        let mergedConf: Settings = Object.assign({}, constants.settings, settings);
        constants.settings.backupFile = mergedConf.backupFile;
        constants.settings.keyFile =  mergedConf.keyFile;
        constants.settings.databaseURL =  mergedConf.databaseURL;
    } catch (e) {
        console.log(
            chalk.hex("#ff0101")(
                `Unable to read ${chalk.white.bold(constants.settingsFile)} settings file.`
            ) + structureMessage
        );
        console.log(
            chalk.hex("#ffffff").bold(`\nFill all the requested parameters.`)
        );
        constants.settings.databaseURL = prompt("\tDatabase URL: ");
    }
}

export default loadSettings;
