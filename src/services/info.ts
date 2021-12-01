import {APIRequest} from "./index"

export interface Info {
    javaVersions: {[x: string]: string},
    maxRam: number,
    publicIP: string,
    startTime: number
    systemRAM: number,
    ramUsage: number,
    cpuUsage: number
}

export async function getInfo(): Promise<Info> {
    let request = new APIRequest("info")
    request.addCredentials()
    return (await request.get()).data
}

export interface SemoxyStatus {
    software: string,
    repository: string,
    version: string,
    description: string,
    issueTracker: string,
    hasRoot: boolean
}

export async function getStatus(): Promise<SemoxyStatus> {
    let request = new APIRequest("/")
    return (await request.get()).data
}
