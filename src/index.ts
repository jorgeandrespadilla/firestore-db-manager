import yargs from 'yargs';
import promptSync from 'prompt-sync';
import createBackup from "./createBackup";
import restoreBackup from "./restoreBackup";
import deleteDatabase from "./deleteDatabase";
import { selectedOptions, blue } from './utility';
import { readKey } from './fileOperations';
import constants from './constants';

const prompt = promptSync({ sigint: true });

const argv = yargs.usage(`
===== FIRESTORE MANAGER =====

Usage: $0 [options]

If a configuration file is provided (${constants.settingsFile}), it should have the following structure:
{
    "backupFile": "...", --> *(default: "backup.json")
    "keyFile": "...",  --> *(default: "key.json")
    "databaseURL": "..." --> *(default: "https://<your_database_id>.firebaseio.com")
}

Key file must be downloaded from project configuration (replace with your Firebase project name):
https://console.firebase.google.com/u/0/project/<your_database_id>/settings/serviceaccounts/adminsdk`
)
    .option("g", {
        alias: "generate-backup",
        describe: `Generate a backup of a Firestore database.`,
        type: "boolean",
    })
    .option("r", {
        alias: "restore-backup",
        describe: "Restore a backup of a Firestore database.",
        type: "boolean",
    })
    .option("d", {
        alias: "delete",
        describe: "Delete a Firestore database.",
        type: "boolean",
    })
    .check(function (argv) {
        let selected = selectedOptions([argv.g, argv.r, argv.d]);
        if (selected == 0) {
            throw 'Error: a valid option must be specified.'
        }
        if (selected > 1) {
            throw (new Error('Error: only one option must be specified.'));
        }
        return true;
    })
    .help("h")
    .alias("h", "help")
    .showHelpOnFail(false, "Specify --help for available options").argv;

async function main(argv: any) {
    if (argv.g) await createBackup();
    if (argv.r) await restoreBackup();
    if (argv.d) {
        let key = await readKey();
        let resp = prompt(`Are you sure you want to delete ${blue(key["project_id"])} collections? yes/[no]: `);
        if ("yes".includes(resp.trim().toLowerCase()) && resp !== "") {
            await deleteDatabase();
        }
        else {
            console.log("Operation canceled.");
        }
    }
}

main(argv);