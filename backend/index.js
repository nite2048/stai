import express from "express";
import {connectDatabase} from "./database/db.js";
import authRouter from './authentication/auth.js'
import tests from './tests/tests.js'
import validate from './authentication/validate.js'

const app = express();

// Always use the validate midddleware first cuz it works in sequence ig
app.use('/auth', authRouter)
app.use('/tests', validate, tests) // If validated then req.user != undefined; route logic can be followed through with the user related stuff
app.use(express.json());

app.use(function (_req, res, next) {
     res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
     res.setHeader("Access-Control-Allow-Credentials", true);
     next();
});

await connectDatabase()
app.listen(3000);