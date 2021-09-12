import styles from "./software.module.css"
import React from "react";
import {LightHeading} from "../../components/interface/boxes/headline";
import {PageBox} from "../../components/interface/boxes/box";
import {Software} from "./serverCreation";
import {concatClasses} from "../../util";


interface ISoftwareSelectionProps {
    softwares: Software[],
    setCurrentSoftware(s: string): void,
    selectedSoftware?: Software
}


interface ISoftwareItemProps {
    software: Software,
    selected: boolean,
    onClick?(): void
}


const SoftwareItem: React.FC<ISoftwareItemProps> = ({software, onClick, selected}) => {
    return <div onClick={onClick} className={concatClasses(styles["software-item"], selected && styles.selected)}>
        <img src={software.image} alt={`${software.name} Logo`} className={styles.image} />
        <div className={styles.text}>
            <p>{software.name}</p>
            <p>{software.description}</p>
        </div>
    </div>
}


export const SoftwareSelection: React.FC<ISoftwareSelectionProps> = ({softwares, setCurrentSoftware, selectedSoftware}) => {
    return <PageBox className={styles.box}>
        <LightHeading>Server Software</LightHeading>
        <div className={styles["version-selection"]}>
            {softwares.map(e => <SoftwareItem key={e.id} software={e} onClick={() => setCurrentSoftware(e.id)} selected={selectedSoftware?.id === e.id} />)}
        </div>
    </PageBox>
}
