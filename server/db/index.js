import {Pool} from "pg";

const pool = new Pool({
  user: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'practice',
});

/*
module.exports = {
    query: (text, params) => pool.query(text, params),
};

*/

//find another way to expor this as a class not a function
export const query = (text, params) => pool.query(text, params);




 