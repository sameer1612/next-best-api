const express = require("express");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const app = express();
app.use(cors());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function createChatCompletion(prompt) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });

  const res = completion.data.choices[0].message.content;
  console.log(completion.data.choices);
  return res;
}

app.get("/", (req, res) => {
  res.send(
    "Hello World, from NextBest. Send comma separated titles to /recommend or /about."
  );
});

app.get("/recommend", async (req, res) => {
  const titles = req.query.titles;
  const prompt = `I like the following movies and tv series: ${titles}. Provide me a numbered list of 5 more movies and tv series based on my choices.`;
  const response = await createChatCompletion(prompt);
  res.send(response);
});

app.get("/about", async (req, res) => {
  const titles = req.query.titles;
  const prompt = `I like the following movies and tv series: ${titles}. Provide a detailed big five personality profile about me. Result should not mention  about coming from AI. It should contain information about following: Openness to Experience, Conscientiousness, Extraversion, Agreeableness, Neuroticism.`;

  const response = await createChatCompletion(prompt);
  res.send(response);
});

app.listen(3000, () => console.log(`NextBest api is listening on port 3000`));
