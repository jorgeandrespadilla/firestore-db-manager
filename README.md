# Firestore Database Manager

[![](https://img.shields.io/npm/l/firestore-db-manager.svg)](https://github.com/andreasonny83/firestore-db-manager/blob/master/LICENSE)
[![](https://img.shields.io/npm/v/firestore-db-manager.svg)](https://npmjs.org/package/firestore-db-manager)

Firestore Database Manager is a CLI tool that enables generating backups, restoring backups and deleting any database created with [Cloud Firestore](https://firebase.google.com/docs/firestore).

## Installation

Install with [npm](https://www.npmjs.com/package/firestore-db-manager).
````
npm i -g firestore-db-manager
````

Install with [yarn](https://yarnpkg.com/package/firestore-db-manager).
````
yarn global add firestore-db-manager
````

This will install `firestore-db` globally so that it may be run from the command line anywhere.

## Usage

Before executing this command, you must download the Firestore database key file from your project service account configurations:
https://console.firebase.google.com/u/0/project/your_database_id/settings/serviceaccounts/adminsdk

````
firestore-db [options]
````
After downloading the corresponding JSON file, you can proceed to execute the command in the same path where you locally saved the project key.

## Configurations

An additional JSON file can be created to specify general configurations to the Firestore Database Manager.

This file must be located in the same path where the key file aws stored. It should also be named `backup-config.json` and have the following structure:
````JSON
{
    "backupFile": "...",
    "keyFile": "...",
    "databaseURL": "..."
}
````
Parameters      | Description
---             |---
`backupFile`    | Source/Destination JSON backup file (defaults to `backup.json`)
`keyFile`       | Firestore service account JSON key file (defaults to `key.json`)
`databaseURL`   | Project database URL (defaults to `https://<your_database_id>.firebaseio.com`)

**Note:** All these parameters are optional and are automatically generated if some of them are missing, or when a configuration file was not found at the current path.
## Available options

Flags                       | Description
---                         |--- 
`-i`, `--init-config`       | Create a default backup configuration file ('backup-config.json')
`-g`, `--generate-backup`   | Generate a backup of a Firestore database
`-r`, `--restore-backup`    | Restore a backup of a Firestore database
`-d`, `--restore-backup`    | Delete a Firestore database
`-h`, `--help`              | Show available options
`-v`, `--restore-backup`    | Show current version number

**Note:** Only one option can be specified per execution.

# License

[MIT License](https://andreasonny.mit-license.org/2018) © Jorge Andrés Padilla