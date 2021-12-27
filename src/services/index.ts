import Axios, { AxiosRequestConfig, AxiosResponse} from "axios"
import {buildUrl} from "../util"
import {ErrorContextProps} from "../ctx/error";

export function getSessionId(): string | null {
    return localStorage.getItem("Semoxy_Session")
}

export function getAPIUrl(path: string): string {
    return window.location.protocol + "//" + window.location.host + "/api/" + path.replace(/^\/+/, '')
}

export class APIRequest {
    private readonly requestConfig: AxiosRequestConfig
    private errorContext: ErrorContextProps | null

    constructor(uri: string, query?: { [x: string]: any }) {
        this.requestConfig = {
            url: buildUrl(uri, query),
            headers: {}
        }
        this.errorContext = null
    }

    setData(data: any): APIRequest {
        this.requestConfig.data = data
        return this
    }

    registerError(ctx?: ErrorContextProps) {
        if (!ctx) return

        this.errorContext = ctx
    }

    addCredentials(): APIRequest {
        let sid = getSessionId()
        sid && (this.requestConfig.headers["Authorization"] = `Token ${sid}`)
        return this
    }

    async request(): Promise<AxiosResponse> {
        try {
            return await Axios.request(this.requestConfig)
        } catch (e) {
            // FIXME: EVERYTHING IS BROKEN HERE
            // @ts-ignore
            if (!this.errorContext) return
            let out: AxiosResponse | null = null

            await this.errorContext.pushError({
                retryCallback: () => {
                    this.request().then(e => {
                        console.log(e)
                        out = e
                    })
                    return true
                },
                name: "Request Error",
                description: "Sees"
            })

            return out as unknown as AxiosResponse
        }
    }

    async get(): Promise<AxiosResponse> {
        this.requestConfig.method = "get"
        return this.request()
    }

    async put(): Promise<AxiosResponse> {
        this.requestConfig.method = "put"
        return this.request()
    }

    async post(): Promise<AxiosResponse> {
        this.requestConfig.method = "post"
        return this.request()
    }

    async delete(): Promise<AxiosResponse> {
        this.requestConfig.method = "delete"
        return this.request()
    }

    async patch(): Promise<AxiosResponse> {
        this.requestConfig.method = "patch"
        return this.request()
    }
}

// @ts-ignore
window.APIRequest = APIRequest
