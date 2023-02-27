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

// Middleware pour afficher les requêtes reçues
app.use((req, res, next) => {
    console.log(`Received ${req.method} request at ${req.url}`);
    next();
  });

app.get("/", (req, res) => {
    res.send({ message: "Hello World!" });
});

app.use("/api/v1/users", userRouter);
app.use("/api/v1/properties", propertyRouter);

// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Internal Server Error");
  });

 // Configuration et initialisation de l'API OpenAI
const openaiConfig = new Configuration({
    organizationId: "org-kDJbLtt6EZiRr2eNhugUibag",
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(openaiConfig);
  
  app.post("/chatbot", async (req, res, next) => {
    const { message } = req.body;
  
    try {
      const { data } = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: {message},
        temperature: 0,
        max_tokens: 4000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });
  
      const botResponse = data.choices[0].text;
      res.json({ botResponse });
    } catch (error) {
      console.error(error);
      next(error);
    }
  });
  
  const startServer = async () => {
    try {
      await connectDB(process.env.MONGODB_URL);
      app.listen(8080, () =>
        console.log("Server started on port http://localhost:8080")
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  startServer();