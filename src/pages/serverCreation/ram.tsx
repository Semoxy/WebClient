import React from "react";
import {PageBox} from "../../components/interface/boxes/box";
import {LightHeading} from "../../components/interface/boxes/headline";
import styles from "./ram.module.css"
import {useInfo} from "../../ctx/info";


interface IRamSelectorProps {
    maximum: number,
    onChange?(value: number): void,
    value?: number
}


export const RamSelector: React.FC<IRamSelectorProps> = ({maximum, onChange, value}) => {
    return <>
        <div className={styles.highlight}>
            {[...Array(maximum)].map((x, i) => {
                if (i + 1 === value) {
                    return <span key={i} className={styles.active}>{value}GB</span>
                } else {
                    return <span key={i}/>
                }
            })}
        </div>
        <input className={styles.selector} type={"range"} max={maximum} min={1} value={value} onChange={(e) => onChange && onChange(parseInt(e.currentTarget.value))} />
        <div className={styles.legend}>
            <span>1GB</span>
            <span>{maximum}GB</span>
        </div>
    </>
}


interface IRAMSelectionProps {
    setCurrentRam(value: number): void,
    currentRam: number
}


export const RAMSelection: React.FC<IRAMSelectionProps> = ({setCurrentRam, currentRam}) => {
    const info = useInfo()

    return <PageBox className={styles.box}>
        <LightHeading>
            RAM
        </LightHeading>
        <RamSelector maximum={info.maxRam} onChange={setCurrentRam} value={currentRam} />
    </PageBox>
}
