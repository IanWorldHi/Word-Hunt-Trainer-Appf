import {Pool} from "pg";

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'practice',
});


export const query = (text, params) => pool.query(text, params);




 