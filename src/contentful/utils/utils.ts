import {execSync} from "child_process";

export const delay = (time: number) => new Promise(res=>setTimeout(res,time));
export const rootDir = (() => {
    try {
        const superProjectRoot = execSync("git rev-parse --show-superproject-working-tree").toString().trim();
        return superProjectRoot || execSync("git rev-parse --show-toplevel").toString().trim();
    } catch (error) {
        return process.cwd();
    }
})()
