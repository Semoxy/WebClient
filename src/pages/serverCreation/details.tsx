import React from "react"
import {PageBox} from "../../components/interface/boxes/box"
import {LightHeading} from "../../components/interface/boxes/headline"
import styles from "./details.module.css"
import Input, {TextArea} from "../../components/input"


interface IDetailsSectionProps {
    name: string,
    setName(v: string): void,
    description: string,
    setDescription(v: string): void
}


export const DetailsSelection: React.FC<IDetailsSectionProps> = ({name, setName, description, setDescription}) => {
    return <PageBox className={styles.box}>
        <LightHeading>
            Server Details
        </LightHeading>
        <Input type={"text"} placeholder={"What's your server called?"} expand label={"Name"} value={name} onChange={e => setName(e.target.value)} />
        <TextArea placeholder={"What's your server used for?"} expand label={"Description"} fill value={description} onChange={e => setDescription(e.target.value)} />
    </PageBox>
}
