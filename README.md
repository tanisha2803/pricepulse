# PricePulse - E-Commerce Price Tracker & Smart Comparator

A full-stack web application that tracks product prices from Amazon and other e-commerce platforms, providing price history visualization and smart price comparisons.

## Features

- Track Amazon product prices automatically
- Real-time price history visualization
- Multi-platform price comparison using AI
- Price drop alerts via email
- Responsive web interface

## Tech Stack

- Backend: Python (FastAPI)
- Frontend: React with TypeScript
- Database: SQLite
- Scraping: Playwright
- Scheduler: APScheduler
- Charts: Chart.js
- Email: SendGrid

## Project Structure

```
pricepulse/
├── backend/           # FastAPI backend
├── frontend/         # React frontend
├── database/         # SQLite database
└── scraper/          # Web scraping scripts
```

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend server:
```bash
uvicorn main:app --reload
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
DATABASE_URL=sqlite:///./pricepulse.db
SENDGRID_API_KEY=your_actual_sendgrid_key
FROM_EMAIL=your_actual_email
OPENAI_API_KEY=your_actual_openai_key
```

## API Documentation

Once the backend server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License 