import React, {useEffect} from "react";

interface ITitleProps {
    title: string
}

export const Title: React.FC<ITitleProps> = ({title}) => {
    useEffect(() => {
        document.title = title + " | Semoxy"
    }, [])

    return <></>
}