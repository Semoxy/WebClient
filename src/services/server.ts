import {APIRequest} from "./index";

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
    consoleOut: string[]
}

export interface Addon {

}

export async function getServers(): Promise<Server[]> {
    let request = new APIRequest("server").addCredentials()
    return (await request.get()).data
}
