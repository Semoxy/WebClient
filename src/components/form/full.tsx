import React, {CSSProperties} from "react"
import styles from "./full.module.css"
import {concatClasses} from "../../util"

export interface IFullScreenFormContainerProps {
    zIndex?: number,
    className?: string
}

const FullSizeContainer: React.FC<IFullScreenFormContainerProps> = ({children, className, zIndex}) => {
    const style: CSSProperties = {}
    if (zIndex) {
        style.zIndex = zIndex
    }

    return <div className={concatClasses(styles.container, className)} style={style}>
        {children}
    </div>
}

export default FullSizeContainer
