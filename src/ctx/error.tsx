import React, {useContext, useState} from "react"

interface Error {
    name: string,
    description: string,
    retryCallback?(): boolean
}

interface ErrorContextProps {
    errors: Error[],
    currentError?: Error,
    pushError(e: Error): void,
    popError(): void
}

const ErrorContext = React.createContext<ErrorContextProps>({
    errors: [],
    pushError(_: Error) {},
    popError() {}
})

export const ErrorProvider: React.FC = ({children}) => {
    const [errors, setErrors] = useState<Error[]>([])

    function pushError(e: Error) {
        let newErrors = errors.slice()
        newErrors.push(e)
        setErrors(newErrors)
    }

    function popError() {
        let newErrors = errors.slice()
        newErrors.pop()
        setErrors(newErrors)
    }

    const currentError = errors[errors.length - 1]

    function callRetry() {
        if (currentError.retryCallback === undefined || currentError.retryCallback()) {
            popError()
        }
    }

    return <ErrorContext.Provider value={{
        errors,
        pushError,
        popError,
        currentError
    }}>
        {errors.length > 0 ? <>
            <h1>An Error occured</h1>
            <h2>{currentError.name}</h2>
            <button onClick={callRetry}>RETRY</button>
        </> : children}
    </ErrorContext.Provider>
}

export const useError = () => {
    return useContext(ErrorContext)
}

export default ErrorContext
