import React, {CSSProperties} from "react";

export interface ISVGImageProps {
    src: string,
    recolor?: string,
    className?: string,
    onClick?: () => void
}

const SVGImage: React.FC<ISVGImageProps> = ({src, recolor, className, onClick}) => {
    const style: CSSProperties = {}

    if (recolor) {
        style.fill = recolor
    }

    return <svg className={className} onClick={onClick}>
        <image style={style} {...{ "xlink:href": src }} />
    </svg>
}

export default SVGImage
