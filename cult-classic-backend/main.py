from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import pickle

app = FastAPI(title="Cult Classic Calculator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
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
    # TODO: implement cult classic probability calculation logic
    with open('tree_model.sav', 'rb') as file:
        model = pickle.load(file)
    data = movie.get_df()
    score = model.predict(data)[0]

    return score

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 