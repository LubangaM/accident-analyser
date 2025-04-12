# Accident Analyser

A full-stack application for managing and analyzing accident records. The system provides comprehensive analytics and visualization of accident data, helping identify patterns and trends in road safety.

## Features

- **Accident Management**

  - Create, view, update, and delete accident records
  - Detailed form for capturing accident information
  - List view with filtering and sorting capabilities
  - Upload CSV file to import accident data
  - Download CSV file to export accident data

- **Analytics Dashboard**
  - Real-time statistical summaries
  - Visual data representation through charts and graphs
  - Analysis by severity, road type, and weather conditions
  - Geographic hotspot identification
  - Time-based filtering (Last year, 2 years, 5 years)

## Project Structure

```
.
├── apps/
│   ├── frontend/     # React frontend with Chakra UI
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Main application pages
│   │   │   ├── hooks/       # Custom React hooks
│   │   │   ├── api/         # API client and utilities
│   │   │   └── types/       # TypeScript type definitions
│   └── backend/      # FastAPI backend with PostgreSQL
│       ├── api/      # API endpoints and routing
│       ├── routers/  # Routers for API endpoints
│       ├── models/   # Database models
│       └── services/ # Business logic and data processing
├── packages/
│   └── shared/       # Shared types and utilities
│       ├── src/
│       │   ├── types/       # Shared TypeScript types
│       │   └── utils/       # Shared utility functions
│       └── package.json
├── package.json      # Root package.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

## Prerequisites

- Node.js 20+
- pnpm 8+
- Python 3.11+
- PostgreSQL
- Docker and Docker Compose (optional)

## Development Setup

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository:

```bash
git clone https://github.com/lubangam/accident-analyser.git
cd accident-analyser
```

2. Install dependencies:

```bash
pnpm install
```

3. Start all services:

```bash
docker compose up
```

4. Access the applications:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. Navigate to the backend directory:

```bash
cd apps/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database credentials
```

5. Initialize the database:

```bash
python init_db.py
```

6. Start the server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

#### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd apps/frontend
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your API endpoint
```

4. Start the development server:

```bash
pnpm dev
```

## Available Scripts

In the project root directory, you can run:

- `pnpm dev` - Start all applications in development mode
- `pnpm build` - Build all applications
- `pnpm start` - Start the backend server
- `pnpm test` - Run tests for all applications
- `pnpm lint` - Run linting for all applications

## API Endpoints

### Accidents

- `GET /accidents` - List all accidents
- `GET /accidents/{id}` - Get a specific accident
- `POST /accidents` - Create a new accident
- `PUT or PATCH /accidents/{id}` - Update an accident
- `DELETE /accidents/{id}` - Delete an accident
- `POST /accidents/upload` - Upload a CSV file to import accident data
- `GET /accidents/export` - Download a CSV file to export accident data

### Analytics

- `GET /analytics/summary` - Get overall statistics
- `GET /analytics/by-severity` - Get accident distribution by severity
- `GET /analytics/by-road-type` - Get accident distribution by road type
- `GET /analytics/by-weather` - Get accident distribution by weather condition
- `GET /analytics/top-locations` - Get accident hotspots
- `GET /analytics/by-time` - Get accident distribution by time

## Technologies Used

- **Frontend**

  - React
  - TypeScript
  - Chakra UI
  - TanStack Query (React Query)
  - TanStack Router
  - Recharts for data visualization

- **Backend**

  - FastAPI
  - PostgreSQL
  - SQLAlchemy
  - Pydantic

- **Development Tools**
  - pnpm (Package Manager)
  - TypeScript
  - Docker & Docker Compose

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
