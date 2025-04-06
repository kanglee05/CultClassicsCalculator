from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

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

@app.get("/")
async def root():
    # TODO: get all info from user input
    return {"message": "Welcome to the Cult Classic Calculator API"}

@app.post("/calculate")
async def calculate_cult_probability(movie: MovieData):
    # TODO: implement cult classic probability calculation logic
    return {

    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 