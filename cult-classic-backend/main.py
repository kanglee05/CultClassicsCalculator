from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import pickle
import shap
app = FastAPI(title="Cult Classic Calculator API")

with open('tree_model.sav', 'rb') as file:
    model = pickle.load(file)
    
# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the movie data model
class MovieData(BaseModel):
    title: str
    year: int
    runtime: int
    tagline: str
    description: str
    genre: str
    revenue: float
    budget: float
    adult: bool

    def get_df(self):
        genre_list = ['Action', 'Science Fiction', 'Adventure', 'Drama', 'Crime',
       'Thriller', 'Fantasy', 'Comedy', 'Romance', 'Western', 'Mystery',
       'War', 'Animation', 'Family', 'Horror', 'Music', 'History',
       'Documentary', 'TV Movie', 'Genreless']
        df = pd.DataFrame(columns=['release_year', 'runtime', 'revenue', 'adult', 'budget'] + genre_list)
        df.loc[0] = [
            self.year,
            self.runtime,
            self.revenue,
            int(self.adult),
            self.budget
        ]+[0 if genre != self.genre else 1 for genre in genre_list]

        return df

@app.get("/")
async def root():
    # TODO: get all info from user input
    return {"message": "Welcome to the Cult Classic Calculator API"}

@app.post("/calculate")
async def calculate_cult_probability(movie: MovieData):
   
    data = movie.get_df()

    # Get feature importances (global weights)
    feature_names = data.columns.tolist()
    importances = model.feature_importances_
    feature_weights = dict(zip(feature_names, importances))

    # Predict class and probability
    prediction = model.predict(data)[0]
    proba = model.predict_proba(data)[0]
    confidence = proba[1]

    # SHAP: get per-feature contributions for this sample
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(data)

    # Fix: safely handle shap_values shape
    if isinstance(shap_values, list):
        individual_contributions = shap_values[prediction][0]  # use the predicted class
    else:
        individual_contributions = shap_values[0]  # fallback

    # Map to feature names
    per_feature_scores = dict(zip(data.columns, individual_contributions))

    # Format results as expected
    factors = {}
    for feature, weight in feature_weights.items():
        score = per_feature_scores.get(feature, 0)
        factors[feature] = {
            "score": round(score[0] * 100, 2),   # convert to % for UI
            "weight": round(weight * 100, 2),
            "details": f"Impact of {feature} on cult classification"
        }

    return {
        "probability": round(confidence * 100, 2),
        "factors": factors,
        "movie_details": movie.model_dump()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 