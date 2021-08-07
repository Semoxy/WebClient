import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export function getSessionId(): string | null {
    return localStorage.getItem("Semoxy_Session");
}

export function getAPIUrl(path: string): string {
    return window.location.protocol + "//" + window.location.host + "/api/" + path.replace(/^\/+/, '')
}

export class APIRequest {
    private readonly requestConfig: AxiosRequestConfig;

    constructor(uri: string) {
        this.requestConfig = {
            url: getAPIUrl(uri),
            headers: {}
        };
    }

    setData(data: any): APIRequest {
        this.requestConfig.data = data
        return this
    }

    addCredentials(): APIRequest {
        let sid = getSessionId()
        sid && (this.requestConfig.headers["Authorization"] = `Token ${sid}`)
        return this
    }

    async request(): Promise<AxiosResponse> {
        return Axios.request(this.requestConfig)
    }

    async get(): Promise<AxiosResponse> {
        this.requestConfig.method = "get";
        return this.request()
    }

    async put(): Promise<AxiosResponse> {
        this.requestConfig.method = "put";
        return this.request()
    }

    async post(): Promise<AxiosResponse> {
        this.requestConfig.method = "post";
        return this.request()
    }

    async delete(): Promise<AxiosResponse> {
        this.requestConfig.method = "delete"
        return this.request()
    }

    async patch(): Promise<AxiosResponse> {
        this.requestConfig.method = "patch";
        return this.request()
    }
}

// @ts-ignore
window.APIRequest = APIRequest
