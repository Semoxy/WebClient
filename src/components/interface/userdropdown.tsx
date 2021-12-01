import styles from "./userdropdown.module.css"
import React from "react"
import {DropDown} from "../dropdown/dropdown"
import {useAuth} from "../../ctx/auth"
import {deleteSession} from "../../services/session"
import {useUser} from "../../ctx/user"
import {useLoading} from "../../ctx/loading/loading"
import {concatClasses} from "../../util"
import {LogoutIcon, SettingsIcon} from "../semoxy/icons"


export const UserDropdown: React.FC = () => {
    return <DropDown currentItem={<UserDisplay />} tabIndex={1} className={styles["user-menu"]} dropdownClassName={styles.dropdown} imageClassName={styles.arrow}>
        <MenuDropdownItem icon={<SettingsIcon />} label={"Account Settings"} />
        <LogoutButton />
    </DropDown>
}

const UserDisplay: React.FC = () => {
    const user = useUser()

    return <div className={styles["user-display"]}>
        <h3>{user.user.username}</h3>
        {/* TODO: should show the highest permission role (not implemented) */}
        <p>{user.user.root ? "Owner" : "User"}</p>
    </div>
}

type MenuDropdownItemType = "default" | "danger"

interface IMenuDropdownItemProps {
    icon: JSX.Element,
    onClick?(): void,
    label: string,
    type?: MenuDropdownItemType
}

const MenuDropdownItem: React.FC<IMenuDropdownItemProps> = ({icon, onClick, type = "default", label}) => {
    icon = React.cloneElement(icon as JSX.Element, {
        className: styles.icon
    })

    return <div className={concatClasses(styles.item, styles[type])} onClick={onClick}>
        <span>{label}</span>
        {icon}
    </div>
}

const LogoutButton: React.FC = () => {
    const auth = useAuth()
    const loading = useLoading()

    function logout() {
        loading.requestIntent("Logging out", "LOG_OUT")
        deleteSession().then(i => {
            loading.finishIntent("LOG_OUT")

            // delete session id - auth ctx redirects to login screen
            i && auth.setSessionId(null)
        })
    }

    return <MenuDropdownItem icon={<LogoutIcon />} label={"Logout"} onClick={logout} type={"danger"} />
}
