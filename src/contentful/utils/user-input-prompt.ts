import * as readline from 'readline';
import {logger} from "../services/logger-provider";
import {delay} from "./utils";


export const promptUserInput = async (inputText) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    logger.flush()
    await delay(300)
    return new Promise(resolve => rl.question(inputText, async ans => {
        rl.close();
        resolve(ans);
    }))
}