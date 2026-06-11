import React, {createContext, useState} from "react";
import * as SecureStore from 'expo-secure-store';
import { useEffect } from "react";
//add on login features
//do i have logout features? isn't it just closing the app



export const WhContext = createContext({
    scores: [] as number[],
    setScores: (scores: number[]) => {},
    username: "",
    accessToken: "",
    isLoading: true,
    setAuth: (username: string, accessToken: string, refreshToken: string) => {},
    logout: () => {},
});

export const WhContextProvider = (props: any) => {
    const [scores, setScores] = useState<number[]>([]);
    const [username, setUsername] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const logout = async () => {
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("username");
        setUsername("");
        setAccessToken("");
    };

    useEffect(() => {
        const restoreSession = async () => {
            try{
                const refTok = await SecureStore.getItemAsync("refreshToken");
                const savUsername = await SecureStore.getItemAsync("username");
                if(refTok && savUsername){
                    const res = await fetch("http://localhost:4001/refresh", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({refreshToken: refTok})
                    });
                    if(res.ok){
                        const data = await res.json(); //"accessToken:"
                        setUsername(savUsername);
                        setAccessToken(data.accessToken);
                    }
                    else{
                        await logout();
                    }
                }
            }
            catch{
                await logout();
            }
            finally{
                setIsLoading(false);
            }
        };
        restoreSession();
    }, []);

    const setAuth = async (username: string, accessToken: string, refreshToken: string) => {
        await SecureStore.setItemAsync("refreshToken", refreshToken);
        await SecureStore.setItemAsync("username", username);
        setUsername(username);
        setAccessToken(accessToken);
    };

    return(
        <WhContext.Provider value={{scores: scores, setScores: setScores, username, accessToken, isLoading, setAuth, logout}}>
            {props.children}
        </WhContext.Provider>
    )
}






