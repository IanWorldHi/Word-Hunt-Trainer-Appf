import React, {createContext, useState, useEffect} from "react";
import * as SecureStore from 'expo-secure-store';
import { Platform } from "react-native";


//if I were to ship to production for web I would use cookies
const secureGet = async (key: string) => {
    if (Platform.OS === 'web') return localStorage.getItem(key);
    return SecureStore.getItemAsync(key);
};
const secureSet = async (key: string, value: string) => {
    if (Platform.OS === 'web') return localStorage.setItem(key, value);
    return SecureStore.setItemAsync(key, value);
};
const secureDel = async (key: string) => {
    if (Platform.OS === 'web') return localStorage.removeItem(key);
    return SecureStore.deleteItemAsync(key);
};


//add on login features
//do i have logout features? isn't it just closing the app

export const WhContext = createContext({
    scores: 0,
    setScores: (scores: number) => {},
    username: "",
    accessToken: "",
    isLoading: true,
    setAuth: async (username: string, accessToken: string, refreshToken: string): Promise<void> => {},
    logout: async (): Promise<void> => {},
});

//can wrap in hook apparently better 
export const WhContextProvider = (props: any) => {
    const [scores, setScores] = useState<number>(0);
    const [username, setUsername] = useState<string>("");
    const [accessToken, setAccessToken] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(true);
    
    const logout = async () => {
        await secureDel("refreshToken");
        await secureDel("username");
        setUsername("");
        setAccessToken("");
    };

    useEffect(() => {
        const restoreSession = async () => {
            try{
                const refTok = await secureGet("refreshToken");
                const savUsername = await secureGet("username");
                if(refTok && savUsername){
                    const res = await fetch("http://localhost:4001/token", {
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
        await secureSet("refreshToken", refreshToken);
        await secureSet("username", username);
        setUsername(username);
        setAccessToken(accessToken);
    };

    return(
        <WhContext.Provider value={{scores: scores, setScores: setScores, username, accessToken, isLoading, setAuth, logout}}>
            {props.children}
        </WhContext.Provider>
    )
}






