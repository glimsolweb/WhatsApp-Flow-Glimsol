import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost', // Replace with your MySQL host
    user: 'dev',      // Replace with your MySQL username
    password: 'Progressive@2023!', // Replace with your MySQL password
    database: 'dev_flowdashboard' // Replace with your database name
});

export default pool;