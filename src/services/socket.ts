export type Action = "SERVER_STATE_CHANGE" |
    "CONSOLE_LINE" |
    "META_MESSAGE" |
    "SERVER_ADD" |
    "SERVER_DELETE" |
    "AUTH_ERROR" |
    "AUTH_SUCCESS"

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