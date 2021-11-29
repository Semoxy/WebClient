import {getAPIUrl} from "./services";

export function concatClasses(...names: (string | undefined | false | null)[]) {
    return names.filter(e => !!e).join(" ")
}

export function formatTime(seconds: number, digits: number = 2): string {
    let date = timeDelta(seconds * 1000)

    let out = []
    let includedUnits = 0

    let flags = 'wdhms'

    for(let i = 0; i < flags.length; i++) {
        if (includedUnits === digits) break

        // @ts-ignore
        let value = date[flags[i]]
        if (value > 0) {
            out.push(`${value}${flags[i]}`)
            includedUnits++
        }
    }

    return out.join(", ")
}

interface Measurements {
    w: number,
    d: number,
    h: number,
    m: number,
    s: number
}

export interface TimeDelta extends Measurements {
    ttl: number,
    ms: number
}


export function timeDelta(time: number): TimeDelta {
    let delta: Partial<TimeDelta> = {
        ttl: time,
        ms: time
    }
    let measurements: Measurements = {
        w: 604800000,
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000
    }
    let flags = 'wdhms'

    // do calculations for each flag
    for(let i = 0; i < flags.length; i++ ) {
        // @ts-ignore
        delta[flags[i]] = delta.ms / measurements[flags[i]]
        // unless totals are specified,
        // value is broken down into components
        // @ts-ignore
        delta[flags[i]] = Math.floor(delta[flags[i]])
        // @ts-ignore
        delta.ms -= delta[flags[i]] * measurements[flags[i]]
    }

    return delta as TimeDelta;
}

export function calculateUptime(start: number): number {
    return Math.round((new Date().getTime() / 1000) - start)
}

export function buildUrl(path: string, parameters?: {[x: string]: any}): string {
    const url = new URL(getAPIUrl(path))

    if (parameters) {
        Object.entries(parameters).forEach((e) => {
            e[1] && url.searchParams.append(e[0], e[1])
        })
    }

    return url.toString()
}


export function getIdTimestamp(id: string): number {
    return parseInt(id.substring(0, 8), 16)
}
