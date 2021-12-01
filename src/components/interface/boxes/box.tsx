import React, {CSSProperties} from "react"
import {concatClasses} from "../../../util"
import styles from "./box.module.css"

interface IPageBoxProps {
    className?: string
}

export const PageBox: React.FC<IPageBoxProps> = ({children, className}) => {
    return <div className={concatClasses(className, styles.box)}>
        {children}
    </div>
}

export const BoxRow: React.FC = ({children}) => {
    return <div className={styles.row}>
        {children}
    </div>
}

export interface IButtonRowProps {
    justify?: "space-between" | "share",
    className?: string,
    style?: CSSProperties
}

export const ButtonRow: React.FC<IButtonRowProps> = ({style, className, justify = "share", children}) => {
    return <div style={style} className={concatClasses(
        styles.buttons,
        justify === "space-between" && styles["space-between"],
        className
    )}>
        {children}
    </div>
}
