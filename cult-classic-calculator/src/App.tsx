import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

interface Review {
  rating: string;
  comment: string;
}

export default function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [runtime, setRuntime] = useState('');
  const [reviews, setReviews] = useState<Review[]>([{ rating: '', comment: '' }]);

  const handleSubmit = () => {
    console.log({ title, description, genre, runtime, reviews });
  };

  const addReview = () => {
    if (reviews.length < 3) {
      setReviews([...reviews, { rating: '', comment: '' }]);
    }
  };

  const updateReview = (index: number, field: keyof Review, value: string) => {
    const newReviews = [...reviews];
    newReviews[index] = { ...newReviews[index], [field]: value };
    setReviews(newReviews);
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Cult Classic Calculator</h1>

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

      <div className="form-section">
        <h2 className="section-title">Reviews</h2>
        {reviews.map((review, index) => (
          <div key={index} className="review-card">
            <h3 className="review-title">Review {index + 1}</h3>
            <div className="form-group">
              <label className="form-label" htmlFor={`rating-${index}`}>Rating</label>
              <input
                id={`rating-${index}`}
                type="text"
                value={review.rating}
                onChange={(e) => updateReview(index, 'rating', e.target.value)}
                placeholder="Enter rating (e.g., 4.5/5)"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor={`comment-${index}`}>Comment</label>
              <textarea
                id={`comment-${index}`}
                value={review.comment}
                onChange={(e) => updateReview(index, 'comment', e.target.value)}
                placeholder="Share your thoughts about the movie"
                className="form-textarea"
              />
            </div>
          </div>
        ))}
        {reviews.length < 3 && (
          <button 
            onClick={addReview}
            className="form-button form-button-secondary"
          >
            Add Another Review
          </button>
        )}
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