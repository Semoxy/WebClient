import React, { useEffect } from "react";

export const Title: React.FC = ({children}) => {
    useEffect(() => {
        if (typeof children !== "string") {
            throw new TypeError("children of <Title /> must be string, got " + children + " instead")
        }
        document.title = children.toString() + " | Semoxy"
    })

    return <></>
}
