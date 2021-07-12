import React, {useContext, useState} from "react"

interface LoadingContextProps {
    requestIntent(msg: string, identifier: string): void,
    finishIntent(identifier: string): void
}

const LoadingContext = React.createContext<LoadingContextProps>({
    requestIntent(msg: string, identifier: string) {
    },
    finishIntent(identifier: string) {
    }
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
        let newIntents = intents.slice().filter(i => i.identifier != identifier)
        setIntents(newIntents)
    }

    const lastIntent = intents[intents.length - 1]

    return <LoadingContext.Provider value={{requestIntent, finishIntent}}>
        { lastIntent && <h1>{lastIntent.msg}</h1> }
        {children}
    </LoadingContext.Provider>
}

export function useLoading() {
    return useContext(LoadingContext)
}

export default LoadingContext
