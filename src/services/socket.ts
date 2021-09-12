import {Server} from "./server";
import {Event, EventType} from "./event";

export type Action =
    "SERVER_STATE_CHANGE" |
    "META_MESSAGE"        |
    "SERVER_ADD"          |
    "SERVER_DELETE"       |
    "AUTH_ERROR"          |
    "AUTH_SUCCESS"        |
    EventType // - all events

export interface Packet {
    action: string,
    data: object
}

export interface AuthSuccessPacket extends Packet {
    action: "AUTH_SUCCESS"
}

export interface MetaMessagePacket extends Packet {
    data: {
        message: string
    }
}

export interface ServerStateChangePacket extends Packet {
    data: {
        id: string,
        patch: Partial<Server>
    }
}

export interface ServerEventPacket<T extends Event> extends Packet {
    data: {
        serverId: string,
        eventData: T
    }
}

export interface ServerAddPacket extends Packet {
    action: "SERVER_ADD",
    data: Server
}
