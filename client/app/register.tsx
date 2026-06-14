import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { WhContext } from "../context/whContext";
import { AUTH_URL } from "../apis/wordHunters";

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setAuth } = useContext(WhContext);
    const router = useRouter();

    const handleRegister = async () => {
        if(!username || !password){
            setError("Username and password are required");
            return;
        }
        try{
            const registerRes = await fetch(`${AUTH_URL}}/register`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
            });
            if(!registerRes.ok){
                setError(await registerRes.text());
                return;
            }
            const loginRes = await fetch(`${AUTH_URL}}/login`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password }),
            });
            if(!loginRes.ok){
                setError(await loginRes.text());
                return;
            }
            const { accessToken, refreshToken } = await loginRes.json();
            await setAuth(username, accessToken, refreshToken);
            router.replace("/");
        } 
        catch(err: any){
            console.error(err);
            setError("Could not connect to server");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Username"
                autoCapitalize="none"
                onChangeText={setUsername}
                value={username}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            <Pressable style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </Pressable>
            <Pressable onPress={() => router.replace("/login")}>
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#537acd",
    },
    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 30,
    },
    error: {
        color: "#ffcccc",
        marginBottom: 10,
    },
    input: {
        width: 300,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        width: 300,
        backgroundColor: "#2f943f",
        borderRadius: 8,
        padding: 14,
        alignItems: "center",
        marginBottom: 16,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    linkText: {
        color: "#fff",
        fontSize: 14,
        textDecorationLine: "underline",
    },
});
