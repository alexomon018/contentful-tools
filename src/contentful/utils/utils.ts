import {execSync} from "child_process";

export const delay = (time: number) => new Promise(res=>setTimeout(res,time));
export const rootDir = execSync("git rev-parse --show-superproject-working-tree").toString().trim()
