const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

app.post("/generate", async (req, res) => {
  const { name, category, features, type, tone } = req.body;

  const prompt = `Ты — маркетолог. Создай ${type} для продукта:
Название: ${name}
Категория: ${category}
Особенности: ${features}
Тон: ${tone}
Текст должен быть коротким, продающим и понятным.`;

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      max_tokens: 200,
    });
    res.json({ text: response.data.choices[0].text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Ошибка генерации текста" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
