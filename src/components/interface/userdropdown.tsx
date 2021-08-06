import styles from "./userdropdown.module.css"
import React from "react";
import {DropDown} from "../dropdown/dropdown";
import {useAuth} from "../../ctx/auth";
import {deleteSession} from "../../services/session";
import {useUser} from "../../ctx/user";
import {useLoading} from "../../ctx/loading/loading";
import {useAlert} from "../../ctx/alert/alertctx";


export const UserDropdown: React.FC = () => {
    return <DropDown currentItem={<UserDisplay />} tabIndex={1} className={styles["user-menu"]} dropdownClassName={styles.dropdown}>
        <LogoutButton />
    </DropDown>
}

const UserDisplay: React.FC = () => {
    const user = useUser()

    return <div className={styles["user-display"]}>
        <h3>{user.username}</h3>
        <p>Owner</p>
    </div>
}

const LogoutButton: React.FC = () => {
    const auth = useAuth()
    const loading = useLoading()
    const alert = useAlert()

    function logout() {
        loading.requestIntent("Logging out", "LOG_OUT")
        deleteSession().then(i => {
            loading.finishIntent("LOG_OUT")
            if (i) {
                alert.alert({
                    type: "success",
                    message: "Logged out successfully",
                    description: ""
                })
                // delete session id - redirects to login screen
                auth.setSessionId(null)
            }
        })
    }

    return <div className={styles.logout} onClick={logout}>
        Logout
    </div>
}
