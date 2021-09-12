import {APIRequest} from "./index";
import {AxiosResponse} from "axios";

export interface Server {
    id: string,
    name: string,
    allocatedRAM: number,
    dataDir: string,
    jarFile: string,
    onlineStatus: number,
    software: {
        server: string,
        majorVersion: string,
        minorVersion: string,
        minecraftVersion: string
    },
    displayName: string,
    port: number,
    addons: Addon[],
    javaVersion: string,
    supports: {
        mods: boolean,
        plugins: boolean
    },
    consoleOut: string[],
    description: string | null,
    ramUsage: number,
    cpuUsage: number,
    onlinePlayers: string[]
}

export interface Addon {

}

export async function getServers(): Promise<Server[]> {
    let request = new APIRequest("server").addCredentials()
    return (await request.get()).data
}

interface CreateServerPayload {
    allocatedRAM?: number,
    javaVersion?: string,
    description?: string,
    name: string,
    port: number
}

export async function createServer(
    software: string,
    majorVersion: string,
    minorVersion: string,
    name: string,
    port: number,
    ram: number,
    javaVersion: string,
    description: string
): Promise<AxiosResponse> {
    const r = new APIRequest(`server/create/${software}/${majorVersion}/${minorVersion}`)
    const data: CreateServerPayload = { name, port }

    if (ram) {
        data.allocatedRAM = ram
    }
    if (javaVersion) {
        data.javaVersion = javaVersion
    }
    if (description) {
        data.description = description
    }
    r.setData(data)
    r.addCredentials()

    return await r.put()
}
