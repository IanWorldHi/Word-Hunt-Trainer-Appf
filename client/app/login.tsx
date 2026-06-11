import React, {useEffect, useState} from 'react'; 
import {ActivityIndicator, Text, View, StyleSheet, Pressable} from 'react-native';  //uses JSX;
import {useRouter} from 'expo-router';
import wordHunters from './apis/wordHunters';
import { WhContext, WhContextProvider } from './context/whContext';

function AuthFunc(){
    const {setAuth} = React.useContext(WhContext);
}

export default function LoginScreen() {
    const {setAuth} = React.useContext(WhContext);
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const router = useRouter(); 


}














