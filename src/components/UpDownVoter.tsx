import React from "react";

import { staticAsset } from "../libs";

export default function UpDownVoter({count, setCount}:
    {
        count: number,
        setCount: React.Dispatch<React.SetStateAction<number>>
    }
): React.JSX.Element {
    return (
        <div className="updownvoter flex flex-row md:flex-col gap-4 items-center px-2 w-fit rounded-md bg-very-light-gray">
            <img src={staticAsset('/images/icon-plus.svg')} 
                alt='plus icon' 
                onClick={()=>setCount(prev => prev + 1)}
                className="icon fg-light-grayish-blue"
            />
            <span className="fg-moderate-blue font-medium text-base">{count}</span>
            <img src={staticAsset('/images/icon-minus.svg')} 
                alt='minus icon' 
                onClick={()=>setCount(prev => prev - 1)}
                className="icon fg-light-grayish-blue"
            />            
        </div>
    )
}