import React, {CSSProperties} from "react";
import styles from "./fullscreen.module.css"

export interface IFullScreenFormContainerProps {
    zIndex?: number
}

const FullScreenFormContainer: React.FC<IFullScreenFormContainerProps> = ({children, zIndex}) => {
    const style: CSSProperties = {}
    if (zIndex) {
        style.zIndex = zIndex
    }

    return <div className={styles.container} style={style}>
        {children}
    </div>
}

export default FullScreenFormContainer
