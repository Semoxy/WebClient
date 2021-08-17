import {APIRequest} from "./index";

interface SessionInformation {
    loggedIn: boolean,
    expiration: number,
    userId: string
}

export async function getSessionInformation(): Promise<SessionInformation> {
    let request = new APIRequest("account/session")
    request.addCredentials()
    return (await request.get()).data
}

interface LoginResponse {
    success: boolean,
    sessionId: string,
    error?: string
}

export async function createSession(username: string, password: string): Promise<LoginResponse> {
    let request = new APIRequest("account/login")
    request.setData({username, password})

    try {
        let data: any = (await request.post()).data
        return {
            success: data.success,
            sessionId: data?.data?.sessionId
        }
    } catch (e) {
        return {
            success: false,
            sessionId: "undefined",
            error: e.response.data.error
        }
    }
}

export async function deleteSession(): Promise<boolean> {
    let request = new APIRequest("account/logout")
    request.addCredentials()
    try {
        await request.get()
        return true
    } catch (e) {
        return false
    }
}

interface UserInformation {
    username: string
}

export async function getUserInformation(): Promise<UserInformation> {
    let request = new APIRequest("account")
    request.addCredentials()
    return (await request.get()).data
}
