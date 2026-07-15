import {Pool} from "pg";

//This is using the old password that has been changed
const pool = new Pool();

export const query = (text, params) => pool.query(text, params);




 