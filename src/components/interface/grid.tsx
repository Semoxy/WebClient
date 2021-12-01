import React from "react"
import styles from "./grid.module.css"
import FullSizeContainer from "../form/full"
import {Navigation} from "./navigation"
import {Header} from "./header"
import {useDesign} from "../../ctx/design"
import {concatClasses} from "../../util"

export const InterfaceGrid: React.FC = ({children}) => {
    const design = useDesign()

    return <FullSizeContainer className={concatClasses(styles.grid, !design.contentShown && styles["only-navbar"])} zIndex={2}>
        <Header />
        { design.navbarOpen && <Navigation /> }
        { design.contentShown && <div className={styles.content}>
            {children}
        </div> }
    </FullSizeContainer>
}
