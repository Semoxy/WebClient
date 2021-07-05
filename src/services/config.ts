import {APIRequest} from "./index";

export interface Config {
    javaVersions: {[x: string]: string},
    maxRam: number,
    publicIP: string
}

export async function getConfig(): Promise<Config> {
    let request = new APIRequest("config")
    request.addCredentials()
    return (await request.get()).data
}
