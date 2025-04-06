import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './App.css'

function Calculator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [runtime, setRuntime] = useState('');
  const [tagline, setTagline] = useState('');

  const handleSubmit = () => {
    console.log({ title, description, genre, runtime, tagline });
  };

  return (
    <div className="form-container">
      <div className="nav-links">
        <Link to="/" className="nav-link active">Calculator</Link>
        <Link to="/info" className="nav-link">About</Link>
      </div>
      
      <h1 className="form-title">CULT CLASSIC CLUB</h1>

      <div className="form-section">
        <h2 className="section-title">Movie Details</h2>
        
        <div className="form-group">
          <label className="form-label" htmlFor="title">Movie Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the movie title"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="tagline">Tagline</label>
          <input
            id="tagline"
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="Enter the movie's tagline"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a brief description of the movie"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="genre">Genre</label>
          <input
            id="genre"
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="e.g., Horror, Comedy, Drama"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="runtime">Runtime (minutes)</label>
          <input
            id="runtime"
            type="number"
            value={runtime}
            onChange={(e) => setRuntime(e.target.value)}
            placeholder="Enter runtime in minutes"
            className="form-input"
          />
        </div>
      </div>

      <button 
        onClick={handleSubmit} 
        className="form-button form-button-primary"
      >
        Calculate Cult Classic Score
      </button>
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