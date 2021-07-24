import {APIRequest} from "./index";

export interface Info {
    javaVersions: {[x: string]: string},
    maxRam: number,
    publicIP: string
}

export async function getInfo(): Promise<Info> {
    let request = new APIRequest("info")
    request.addCredentials()
    return (await request.get()).data
}
