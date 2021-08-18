export type EventType =
    "SERVER_START"     |
    "SERVER_STOP"      |
    "PLAYER_JOIN"      |
    "PLAYER_LEAVE"     |
    "SERVER_EXCEPTION" |
    "CONSOLE_COMMAND"  |
    "CONSOLE_MESSAGE"

export interface Event {
    id: string
}

export interface PlayerJoinEvent extends Event {
    name: string,
    uuid: string
}

export interface PlayerLeaveEvent extends Event {
    name: string
}

export interface ServerStartEvent extends Event {}
export interface ServerStopEvent extends Event {}

export interface ServerExceptionEvent extends Event {
    message: string
}

export interface ConsoleCommandEvent extends Event {
    command: string,
    issuer: string
}

export interface ConsoleMessageEvent extends Event {
    message: string
}
