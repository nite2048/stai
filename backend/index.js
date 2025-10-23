import express from "express";
import {connectDatabase} from "./database/db.js";
import authRouter from './authentication/auth.js'
import tests from './tests/tests.js'
import validate from './authentication/validate.js'

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Always use the validate midddleware first cuz it works in sequence ig
app.use('/auth', authRouter)
//app.use('/tests', validate, tests) 
app.use('/tests', tests) // If validated then req.user != undefined; route logic can be followed through with the user related stuff
app.use(express.json());

await connectDatabase()
app.listen(3000);