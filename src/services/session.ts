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
    sessionId: string
}

export async function createSession(username: string, password: string): Promise<LoginResponse> {
    let request = new APIRequest("account/login")
    request.setData({username, password})
    let data: any = (await request.post()).data

    if (data.success) {
        return {
            success: true,
            sessionId: data.data.sessionId
        }
    }
    return {
        success: false,
        sessionId: "<unknown>"
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