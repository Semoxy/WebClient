import {APIRequest} from "./index";
import {AxiosResponse} from "axios";
import {EventType, Event} from "./event";
import {ServerEventPacket} from "./socket";

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

export async function startServer(serverId: string) {
    const r = new APIRequest(`server/${serverId}/start`)
    r.addCredentials()
    return await r.get()
}

export async function stopServer(serverId: string) {
    const r = new APIRequest(`server/${serverId}/stop`)
    r.addCredentials()
    return await r.get()
}

export async function restartServer(serverId: string) {
    const r = new APIRequest(`server/${serverId}/restart`)
    r.addCredentials()
    return await r.get()
}

export async function sendServerCommand(serverId: string, command: string) {
    const r = new APIRequest(`server/${serverId}/command`)
    r.setData({command})
    r.addCredentials()
    return await r.post()
}

interface IGetEventsOptions {
    amount?: number,
    page?: number,
    max_time?: number,
    min_time?: number,
    type?: EventType[],
    order?: "asc" | "desc"
}

export interface ServerEvent<T extends Event> {
    id: string,
    server: string,
    type: EventType,
    data: T
}

export function serverEventFromSocketEvent<T extends Event>(e: ServerEventPacket<T>): ServerEvent<T> {
    return {
        type: e.action as EventType,
        id: e.data.id,
        server: e.data.serverId,
        data: e.data.eventData
    }
}

export async function getEvents<T extends Event>(serverId: string, options?: IGetEventsOptions): Promise<ServerEvent<T>[]> {
    const query: any = options

    if (options?.type) {
        query.type = options.type.join(",")
    }

    const r = new APIRequest(`/server/${serverId}/events`, query)
    r.addCredentials()
    return (await r.get()).data
}
