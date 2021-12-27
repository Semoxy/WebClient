import React, {useContext, useState} from "react"

interface AsyncEvent<T> {
    set(value: T): void,
    promise: Promise<T>
}

function newAsyncEvent<T>() {
    // @ts-ignore
    let out: AsyncEvent<T> = {}

    out.promise =  new Promise((res) => {
        out.set = res
    })

    return out
}

interface Error {
    name: string,
    description: string,
    retryCallback?(): boolean,
    _p?: AsyncEvent<void>
}

export interface ErrorContextProps {
    errors: Error[],
    currentError?: Error,
    pushError(e: Error): Promise<void>,
    popError(): Error | undefined
}

const ErrorContext = React.createContext<ErrorContextProps>({
    errors: [],
    pushError(_: Error) {return new Promise(() => {})},
    popError: () => undefined
})

export const ErrorProvider: React.FC = ({children}) => {
    const [errors, setErrors] = useState<Error[]>([])

    function pushError(e: Error) {
        let newErrors = errors.slice()
        if (!e._p) {
            e._p = newAsyncEvent()
        }
        newErrors.push(e)
        setErrors(newErrors)
        return e._p.promise
    }

    function popError(): Error | undefined {
        let newErrors = errors.slice()
        const out = newErrors.pop()
        setErrors(newErrors)
        return out
    }

    const currentError = errors[errors.length - 1]

    function callRetry() {
        const err = popError() as Error
        if (currentError.retryCallback === undefined || currentError.retryCallback()) {
            currentError._p?.set()
        } else {
            pushError(err)
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
