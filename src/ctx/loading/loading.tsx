import React, {useContext, useState} from "react"
import FullSizeContainer from "../../components/form/full"
import styles from "./loading.module.css"

interface LoadingContextProps {
    requestIntent(msg: string, identifier: string): void,
    finishIntent(identifier: string): void
}

const LoadingContext = React.createContext<LoadingContextProps>({
    requestIntent() { },
    finishIntent() { }
})

interface Intent {
    msg: string,
    identifier: string
}

export const LoadingProvider: React.FC = ({children}) => {
    const [intents, setIntents] = useState<Intent[]>([])

    function requestIntent(msg: string, identifier: string): void {
        let newIntents = intents.slice()
        newIntents.push({msg, identifier})
        setIntents(newIntents)
    }

    function finishIntent(identifier: string): void {
        let newIntents = intents.slice().filter(i => i.identifier !== identifier)
        setIntents(newIntents)
    }

    const lastIntent = intents[intents.length - 1]

    return <LoadingContext.Provider value={{requestIntent, finishIntent}}>
        { lastIntent &&
            <FullSizeContainer zIndex={10} className={styles.container}>
                <LoadingAnimation />
                <span>{lastIntent.msg}</span>
            </FullSizeContainer>
        }
        {children}
    </LoadingContext.Provider>
}

export const LoadingAnimation: React.FC = () => {
    return <div className={styles.ring}>
        <div />
        <div />
        <div />
        <div />
    </div>
}

export function useLoading() {
    return useContext(LoadingContext)
}

export default LoadingContext
