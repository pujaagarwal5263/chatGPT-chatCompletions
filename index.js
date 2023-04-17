const { Configuration, OpenAIApi } = require("openai");
const serverless = require("serverless-http");
const express = require("express");
require('dotenv').config()
const app = express();
const router = express.Router()
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.API_KEY,
});

const openai = new OpenAIApi(configuration);

//model takes 35 secs to bring response
const askGPT = async (prompt) => {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  console.log(response["data"]["choices"][0]["message"]["content"]);
  return response["data"]["choices"][0]["message"]["content"];
};

const getData = async (req, res) => {
  const prompt = req.query.prompt;
  const data = await askGPT(prompt);
  //erfoie
  return res.status(200).send(data);
};

app.get("/chatbot", getData);
app.use(`/.netlify/functions/api`, router);

module.exports = app;
module.exports.handler = serverless(app);
