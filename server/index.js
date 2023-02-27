import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from 'openai';
import connectDB from "./mongodb/connect.js";
import userRouter from "./routes/user.routes.js";
import propertyRouter from "./routes/property.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);
// Adding OpenAI API
const openaiConfig = new Configuration({
    organizationId:'org-kDJbLtt6EZiRr2eNhugUibag',
   apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(openaiConfig);
  app.post("/chatbot", async (req, res) => {
    const { message } = req.body;
  
    try {
      const { data } = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: "La différence entre tchat gpt et gpt-3?\n\nGPT (Generative Pre-trained Transformer) est une technologie d'intelligence artificielle qui peut être utilisée pour générer du texte, des réponses et des conversations. GPT-3 (Generative Pre-trained Transformer 3) est la dernière version de GPT qui est plus puissante et plus avancée. GPT-3 est capable de générer des réponses plus précises et plus convaincantes que GPT.\n\nLe tchat GPT est une technologie qui permet à des robots conversationnels d'interagir avec des utilisateurs en utilisant des modèles GPT. Le tchat GPT peut être utilisé pour créer des conversations plus naturelles et plus engageantes entre un utilisateur et un robot.\n\nGPT-3, d'autre part, est une technologie plus avancée qui peut être utilisée pour générer des réponses plus précises et plus convaincantes. GPT-3 peut également être utilisé pour créer des conversations plus naturelles et plus engageantes entre un utilisateur et un robot.",
        temperature: 0.4,
        max_tokens: 4000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
  
      const botResponse = data.choices[0].text;
      res.json({ botResponse });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  });
  
  
const startServer = async () => {
    try {
        connectDB(process.env.MONGODB_URL);

        app.listen(8080, () =>
            console.log("Server started on port http://localhost:8080"),
        );
    } catch (error) {
        console.log(error);
    }
};

startServer();