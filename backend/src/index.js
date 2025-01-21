// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/conn.js";
import {app} from './app.js'
dotenv.config({
    path: './.env'
})

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log(`\nServer is running on PORT: ${process.env.PORT || 8000}`);
    })
})
.catch((error) => {
    console.log("MONGO db connection failed !!! ", error);
    process.exit(1)
})