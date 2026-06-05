import React, {createContext, useState} from "react";

export const WhContext = createContext({
    scores: [] as number[],
    setScores: (scores: number[]) => {},
});

export const WhContextProvider = (props: any) => {
    const [scores, setScores] = useState<number[]>([]);

    return(
        <WhContext.Provider value={{scores: scores, setScores: setScores}}>
            {props.children}
        </WhContext.Provider>
    )
}






