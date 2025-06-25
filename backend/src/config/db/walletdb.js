require('dotenv').config();
const { Sequelize } = require('sequelize');

// Option 1: Passing a connection URI
const POSTGRES_URL = process.env.DATABASE_URL;
const sequelize = new Sequelize(POSTGRES_URL) // Example for postgres

const connectDB = async () => {
    try{
        console.log('Connection has been established successfully.');
        await sequelize.authenticate();
        
    } catch (err) {
        console.error(err.message);
        return err.message
}}

module.exports = connectDB