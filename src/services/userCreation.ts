import {APIRequest} from "./index";
import {AxiosError} from "axios"


interface ICreateUserResponse {
    success: boolean,
    error?: string
}


export async function createRootUser(username: string, password: string, creationSecret: string): Promise<ICreateUserResponse> {
    let r = new APIRequest("/account/create-root-user")
    let data = { username, password, creationSecret }
    r.setData(data)
    try {
        await r.post()
        return {
            success: true
        }
    } catch (e) {
        return {
            success: false,
            error: (e as AxiosError).response?.data.error
        }
    }
}
