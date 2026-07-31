/* import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    }
});

export const wordAuth = axios.create({
    baseURL: "http://localhost:4001",
    headers: {
        "Content-Type": "application/json",
    },
});

 */

//need to change to ip address bc of expo, store in env
export const SCORES_URL = "http://localhost:3001";
export const AUTH_URL = "http://localhost:4001";


