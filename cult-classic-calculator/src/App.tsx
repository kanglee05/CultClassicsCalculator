import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

interface FormData {
  title: string;
  runtime: number;
  tagline: string;
  description: string;
  genre: string;
}

interface Factor {
  score: number;
  weight: number;
  details: string;
}

interface Results {
  probability: number;
  factors: {
    runtime: Factor;
    genre: Factor;
    tagline: Factor;
    description: Factor;
  };
  movie_details: FormData;
}

function Calculator() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    runtime: 120,
    tagline: '',
    description: '',
    genre: 'Action'
  });
  const [results, setResults] = useState<Results | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Mock results
    const mockResults: Results = {
      probability: 75.5,
      factors: {
        runtime: {
          score: 70,
          weight: 20,
          details: "Good runtime for cult potential"
        },
        genre: {
          score: 90,
          weight: 25,
          details: "High cult potential genre"
        },
        tagline: {
          score: 85,
          weight: 25,
          details: "Strong, memorable tagline"
        },
        description: {
          score: 75,
          weight: 30,
          details: "Interesting description"
        }
      },
      movie_details: formData
    };

    // Simulate API call
    setTimeout(() => {
      setResults(mockResults);
      setIsSubmitting(false);
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'runtime' ? Number(value) : value
    }));
  };

  return (
    <div className="form-container">
      <div className="nav-links">
        <Link to="/" className="nav-link active">Calculator</Link>
        <Link to="/info" className="nav-link">About</Link>
      </div>
      
      <h1 className="form-title">CULT CLASSIC CALCULATOR</h1>
      <h2 className="form-subtitle">How likely is your movie to become a cult classic?</h2>

      <div className="form-section">
        
        <div className="form-group">
          <label className="form-label" htmlFor="title">Movie Title</label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter the movie title"
            className="form-input"
            name="title"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="runtime">Runtime (minutes)</label>
          <input
            id="runtime"
            type="number"
            value={formData.runtime}
            onChange={handleInputChange}
            placeholder="Enter runtime in minutes"
            className="form-input"
            name="runtime"
            min="30"
            max="300"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="genre">Genre</label>
          <select
            id="genre"
            value={formData.genre}
            onChange={handleInputChange}
            className="form-input"
            name="genre"
          >
            <option value="Action">Action</option>
            <option value="Comedy">Comedy</option>
            <option value="Drama">Drama</option>
            <option value="Horror">Horror</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Thriller">Thriller</option>
            <option value="Romance">Romance</option>
            <option value="Animation">Animation</option>
            <option value="Documentary">Documentary</option>
          </select>
        </div>


      <div className="form-group">
          <label className="form-label" htmlFor="tagline">Tagline</label>
          <input
            id="tagline"
            type="text"
            value={formData.tagline}
            onChange={handleInputChange}
            placeholder="Enter the movie's tagline"
            className="form-input"
            name="tagline"
          />
        </div>

      </div>

      <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a brief description of the movie"
            className="form-textarea"
            name="description"
          />
        </div>

      <button 
        onClick={handleSubmit} 
        className="form-button form-button-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Calculating...' : 'Calculate Cult Classic Score'}
      </button>

      {results && (
        <div className="results-container">
          <h2 className="section-title">Results</h2>
          <div className="results-content">
            <div className="probability-display">
              <h3>Cult Classic Probability</h3>
              <div className="probability-value">{results.probability}%</div>
            </div>

            <div className="movie-details">
              <h3>Movie Details</h3>
              <div className="detail-item">
                <span className="detail-label">Title:</span>
                <span className="detail-value">{results.movie_details.title}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Runtime:</span>
                <span className="detail-value">{results.movie_details.runtime} minutes</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Genre:</span>
                <span className="detail-value">{results.movie_details.genre}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Tagline:</span>
                <span className="detail-value">"{results.movie_details.tagline}"</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Description:</span>
                <span className="detail-value">"{results.movie_details.description}"</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Info() {
  return (
    <div className="form-container">
      <div className="nav-links">
        <Link to="/" className="nav-link">Calculator</Link>
        <Link to="/info" className="nav-link active">About</Link>
      </div>

      <h1 className="form-title">About Cult Classics</h1>

      <div className="info-section">
        <h2 className="section-title">What is a Cult Classic?</h2>
        <p>
        A "cult classic" is used to describe a movie that has generated a significant and dedicated fanbase over time. These films typically don't do well at the box office at the time of release, but capture a very niche and dedicated audience over time. The films stray away from what the mainstream deems a "proper" movie and embrace concepts that are considered improper, scandalous, or obscure. Popular genres of cult classics include horror, science fiction, and comedy. 
        <br></br><br></br>
        But what differentiates a cult classic from a normal classic? A popular film may have unique elements that stray from the norm. However, these are not considered cult classics as they were hits from the time of release. They were never the underdogs and were accepted as cultural canon from the very beginning. 

        </p>

        <h2 className="section-title">Our Methodology</h2>
        <p>
          Our Cult Classic Calculator analyzes various factors to determine the likelihood 
          of a movie becoming or being a cult classic:
          <br></br><br></br>

          Our first step was to gather a list of all the movies that are considered cult classics. This was done by scraping Wikipedia 
          for their exhaustive list of cult classics. We then created a larger dataset of movies gathered from The Movie Database
           (TMDb) and labeled them as either cult classics or not.
           <br></br><br></br>
           Below are the factors we considered when labeling the movies:

        {/* TODO: These should be updated to match our values*/}
        </p>
        <ul>
          <li>Movie Overview</li>
          <li>Date of Release</li>
          <li>Runtime</li>
          <li>Genre(s)</li>
        </ul>

        <h2 className="section-title">How It Works</h2>
        <p>
          Simply enter the details of your movie in the calculator, and our algorithm 
          will analyze these factors to generate a probability score. This score 
          represents the likelihood of your movie achieving cult classic status based 
          on historical patterns and cultural indicators.
        </p>
      </div>

      
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/info" element={<Info />} />
      </Routes>
    </Router>
  );
}