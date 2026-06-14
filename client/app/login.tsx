import { useState, useContext } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { WhContext } from "../context/whContext";
import { AUTH_URL } from "../apis/wordHunters";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { setAuth } = useContext(WhContext);
    const router = useRouter();

    //have to add a register function as well
    const handleLogin = async () => {
        try {
            const res = await fetch(`${AUTH_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                setError(await res.text());
                return;
            }
            const { accessToken, refreshToken } = await res.json();
            await setAuth(username, accessToken, refreshToken);
            router.replace("/");
        } 
        catch {
            setError("Could not connect to server");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>WordHunt Trainer</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput style={styles.input} placeholder="Username" autoCapitalize="none" onChangeText={setUsername} value={username} />
            <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} value={password} />
            <Pressable style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
            <Pressable onPress={() => router.replace("/register")}>
                <Text style={styles.link}>{"Don't have an account? Register"}</Text>
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
        width: 200,
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        width: 110,
        backgroundColor: "#2f943f",
        borderRadius: 8,
        padding: 14,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    link: {
        color: "#fff",
        fontSize: 14,
        textDecorationLine: "underline",
        marginTop: 16,
    },
});
