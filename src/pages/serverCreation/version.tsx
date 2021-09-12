import React from "react";
import {PageBox} from "../../components/interface/boxes/box";
import {LightHeading} from "../../components/interface/boxes/headline";
import styles from "./version.module.css"
import {Software} from "./serverCreation";
import {DefaultDropDownItem, DropDown} from "../../components/dropdown/dropdown";
import {useInfo} from "../../ctx/info";


interface IVersionSelectionProps {
    currentMinor: string,
    setCurrentMinor(s: string): void,
    currentMajor: string,
    setCurrentMajor(s: string): void,
    currentSoftware: Software,
    javaVersion: string,
    setJavaVersion(v: string): void
}


export const VersionSelection: React.FC<IVersionSelectionProps> = ({currentSoftware, currentMajor, currentMinor, setCurrentMajor, setCurrentMinor, javaVersion, setJavaVersion}) => {
    const config = useInfo()

    const majorVersions = Object.keys(currentSoftware.versions)
    const minorVersions = currentSoftware.versions[currentMajor]

    return <PageBox className={styles.box}>
        <LightHeading>
            Software Version
        </LightHeading>

        { majorVersions.length > 1 && <DropDown currentItem={<DefaultDropDownItem>{currentMajor}</DefaultDropDownItem>} tabIndex={4} expand label={currentSoftware.majorVersionName} notOpenableWhenOneChild>
            {majorVersions.map(mv => <DefaultDropDownItem key={mv} onClick={() => setCurrentMajor(mv)}>{mv}</DefaultDropDownItem>)}
        </DropDown> }

        { minorVersions.length > 1 && <DropDown currentItem={<DefaultDropDownItem>{currentMinor}</DefaultDropDownItem>} tabIndex={5} expand label={currentSoftware.minorVersionName} notOpenableWhenOneChild>
            {minorVersions.map(mv => <DefaultDropDownItem key={mv} onClick={() => setCurrentMinor(mv)}>{mv}</DefaultDropDownItem> )}
        </DropDown> }

        { Object.keys(config.javaVersions).length > 1 && <DropDown currentItem={<DefaultDropDownItem>{config.javaVersions[javaVersion]}</DefaultDropDownItem>} tabIndex={6} expand label={"Java Version"} notOpenableWhenOneChild>
            {Object.keys(config.javaVersions).map(jv => <DefaultDropDownItem key={jv} onClick={() => setJavaVersion(jv)}>{config.javaVersions[jv]}</DefaultDropDownItem> )}
        </DropDown> }
    </PageBox>
}
