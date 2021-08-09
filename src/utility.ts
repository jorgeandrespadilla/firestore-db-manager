import _ from 'lodash';
import CliSpinner from 'cli-spinner';
import chalk from 'chalk';

/**
 * Provides a blue color wrapper for console output.
 * @param msg Message string
 */
export const blue = chalk.hex("#0078D4");
/**
 * Provides a red color wrapper for console output.
 * @param msg Message string
 */
export const red = chalk.hex("#FF0101");

export class Spinner {

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

export function selectedOptions(expressions: Array<Boolean | undefined>): Number {
    let result = expressions.map(exp => exp ? 1 : 0);
    return _.sum(result);
}