import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

interface FormData {
  title: string;
  year: number;
  runtime: number;
  revenue: number;
  budget: number;
  adult: string;
  genre: string;
  tagline: string;
  description: string;
}

interface Factor {
  score: number;
  weight: number;
  details: string;
}

interface Results {
  probability: number;
  factors: {
    year: Factor;
    runtime: Factor;
    revenue: Factor;
    budget: Factor;
    adult: Factor;
    genre: Factor;
    tagline: Factor;
    description: Factor;
  };
  movie_details: FormData;
}

function Calculator() {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    year: 2024,
    runtime: 120,
    revenue: 0,
    budget: 0,
    adult: 'No',
    genre: 'Action',
    tagline: '',
    description: ''
  });
  const [results, setResults] = useState<Results | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const genres = [
    'Action', 'Science Fiction', 'Adventure', 'Drama', 'Crime',
    'Thriller', 'Fantasy', 'Comedy', 'Romance', 'Western', 'Mystery',
    'War', 'Animation', 'Family', 'Horror', 'Music', 'History',
    'Documentary', 'TV Movie', 'Genreless'
  ];


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Prepare the data for the API
      const requestData = {
        title: formData.title.trim(),
        year: formData.year,
        runtime: formData.runtime,
        revenue: formData.revenue,
        budget: formData.budget,
        adult: formData.adult === 'Yes',
        genre: formData.genre,
        tagline: formData.tagline.trim(),
        description: formData.description.trim()
      };

      // Validate required fields
      if (!requestData.title || !requestData.tagline || !requestData.description) {
        throw new Error('Please fill in all required fields');
      }

      // Validate year
      if (requestData.year < 1900 || requestData.year > 2024) {
        throw new Error('Please enter a valid year between 1900 and 2024');
      }

      // Validate runtime
      if (requestData.runtime < 30 || requestData.runtime > 300) {
        throw new Error('Runtime must be between 30 and 300 minutes');
      }

      // Validate revenue and budget
      if (requestData.revenue < 0) {
        throw new Error('Revenue cannot be negative');
      }
      if (requestData.budget < 0) {
        throw new Error('Budget cannot be negative');
      }

      // Send data to the API
      const response = await fetch('http://localhost:8000/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Failed to calculate cult classic probability');
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
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
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="year">Release Year</label>
          <input
            id="year"
            type="number"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="Enter release year"
            className="form-input"
            name="year"
            min="1900"
            max="2024"
            required
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
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="budget">Budget (USD)</label>
          <input
            id="budget"
            type="number"
            value={formData.budget}
            onChange={handleInputChange}
            placeholder="Enter movie budget"
            className="form-input"
            name="budget"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="revenue">Revenue (USD)</label>
          <input
            id="revenue"
            type="number"
            value={formData.revenue}
            onChange={handleInputChange}
            placeholder="Enter movie revenue"
            className="form-input"
            name="revenue"
            min="0"
            required
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
            required
          >
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="adult">Adult Content</label>
          <select
            id="adult"
            value={formData.adult}
            onChange={handleInputChange}
            className="form-input"
            name="adult"
            required
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
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
            required
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
            required
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
                <span className="detail-label">Release Year:</span>
                <span className="detail-value">{results.movie_details.year}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Runtime:</span>
                <span className="detail-value">{results.movie_details.runtime} minutes</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Budget:</span>
                <span className="detail-value">${results.movie_details.budget.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Revenue:</span>
                <span className="detail-value">${results.movie_details.revenue.toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Genre:</span>
                <span className="detail-value">{results.movie_details.genre}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Adult Content:</span>
                <span className="detail-value">{results.movie_details.adult}</span>
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

            <div className="factors-analysis">
              <h3>Factor Analysis</h3>
              {Object.entries(results.factors).map(([factor, data]) => (
                <div key={factor} className="factor-item">
                  <div className="factor-header">
                    <span className="factor-name">{factor.charAt(0).toUpperCase() + factor.slice(1)}</span>
                    <span className="factor-score">{data.score}%</span>
                  </div>
                  <div className="factor-weight">Weight: {data.weight}%</div>
                  <div className="factor-details">{data.details}</div>
                </div>
              ))}
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
        </p>

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