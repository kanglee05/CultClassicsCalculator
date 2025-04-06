# Cult Classic Calculator Backend

This is the backend API for the Cult Classic Calculator application. It provides endpoints for calculating the probability of a movie becoming a cult classic based on various factors.

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
```

2. Activate the virtual environment:
```bash
source venv/bin/activate  # On Unix/macOS
# or
.\venv\Scripts\activate  # On Windows
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

To run the development server:

```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): `http://localhost:8000/docs`
- Alternative API docs (ReDoc): `http://localhost:8000/redoc`

## Endpoints

- `GET /`: Welcome message
- `POST /calculate`: Calculate cult classic probability based on movie data

## Development

The backend is built with:
- FastAPI
- Pydantic for data validation
- Uvicorn as the ASGI server 