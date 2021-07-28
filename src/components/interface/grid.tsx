import React from "react";
import styles from "./grid.module.css"
import FullSizeContainer from "../form/full";
import {Navigation} from "./navigation";
import {Header} from "./header";

export const InterfaceGrid: React.FC = ({children}) => {
    return <FullSizeContainer className={styles.grid} zIndex={2}>
        <Header />
        <Navigation />
        <div className={styles.content}>
            {children}
        </div>
    </FullSizeContainer>
}
