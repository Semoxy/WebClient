import {getAPIUrl} from "./index";


export function getPlayerHeadUrlByName(playerName: string): string {
    return getAPIUrl(`/playerhead/name/${playerName}`);
}
