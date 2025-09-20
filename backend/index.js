import express from "express";
import {handlePostReq} from './genai.js'

const app = express();

app.use(express.json());
app.use(function (req, res, next) {
     res.setHeader("Access-Control-Allow-Origin", "*");
     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
     res.setHeader("Access-Control-Allow-Credentials", true);
     next();
});

app.listen(3000);


app.post("/test/:name", async (request, response) => {
     let path = "./lib/" + request.params.name + ".jpg";
     
     try {
          const data = await handlePostReq(path);
          response.status(200).json(data);
     } catch (error) {
          response.status(500).json({ error: "Internal server error" });
     }
});
