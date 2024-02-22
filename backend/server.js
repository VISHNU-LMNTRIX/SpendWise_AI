const express = require("express");
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post("/text", async (req,res)=>{
    const prompt = req.body.prompt;
    if(!prompt){
        return res.status(400).send({error:"prompt is required!"});
    }
    try{
        await openai.completions.create({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompt,
            max_tokens: 2000,
            temperature: 0,
        }).then((response)=>{
            res.send({data:response.choices[0].text});
        });
    }
    catch(error){
        console.log(error);
        res.status(500).send({error});
    }
});

app.listen(5000,()=>{
    console.log("connected to port 5000...");
});