
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle

app = FastAPI(title="Honest Eye News Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load trained model and vectorizer
with open("news_model.pkl", "rb") as f:
    model = pickle.load(f)

with open("tfidf_vectorizer.pkl", "rb") as f:
    vectorizer = pickle.load(f)


class NewsInput(BaseModel):
    text: str


@app.get("/")
def home():
    return {"message": "Honest Eye API is running!"}


@app.post("/predict")
def predict_news(news: NewsInput):
    text = vectorizer.transform([news.text])
    prediction = model.predict(text)[0]

    result = "Fake" if prediction == 0 else "Real"

    return {
        "prediction": result,
        "message": f"This news is predicted as {result}"
    }
