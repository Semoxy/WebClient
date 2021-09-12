import React from "react";
import {concatClasses} from "../../../util";
import styles from "./box.module.css"

interface IPageBoxProps {
    className?: string
}

export const PageBox: React.FC<IPageBoxProps> = ({children, className}) => {
    return <div className={concatClasses(className, styles.box)}>
        {children}
    </div>
}
