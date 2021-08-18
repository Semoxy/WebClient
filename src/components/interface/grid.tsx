import React from "react";
import styles from "./grid.module.css"
import FullSizeContainer from "../form/full";
import {Navigation} from "./navigation";
import {Header} from "./header";
import {useDesign} from "../../ctx/design";

export const InterfaceGrid: React.FC = ({children}) => {
    const design = useDesign()

    const classNames = [styles.grid]
    !design.contentShown && classNames.push(styles["only-navbar"])

    return <FullSizeContainer className={classNames.join(" ")} zIndex={2}>
        <Header />
        { design.navbarOpen && <Navigation /> }
        { design.contentShown && <div className={styles.content}>
            {children}
        </div> }
    </FullSizeContainer>
}
