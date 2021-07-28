import React, {CSSProperties} from "react";
import styles from "./full.module.css"

export interface IFullScreenFormContainerProps {
    zIndex?: number,
    className?: string
}

const FullSizeContainer: React.FC<IFullScreenFormContainerProps> = ({children, className, zIndex}) => {
    const style: CSSProperties = {}
    if (zIndex) {
        style.zIndex = zIndex
    }

    let classNames = [styles.container]
    className && classNames.push(className)

    return <div className={classNames.join(" ")} style={style}>
        {children}
    </div>
}

export default FullSizeContainer
