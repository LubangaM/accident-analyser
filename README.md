# Accident Analyser

A comprehensive full-stack application for managing and analyzing road accident data. Built with modern web technologies, this system provides powerful analytics and visualization tools to help identify patterns and trends in road safety.

![Analytics Dashboard](docs/images/analytics.png)

## Features

### Data Management

- **Accident Records**
  - Create, view, update, and delete accident records
  - Intuitive form interface with validation
  - Bulk data import via CSV upload
  - Data export functionality
  - Comprehensive filtering and sorting

### Analytics & Visualization

- **Real-time Dashboard**
  - Key metrics overview (total accidents, casualties, vehicles)
  - Interactive charts and graphs
  - Time-based analysis with flexible ranges
  - Geographic distribution analysis

### User Interface

- **Modern Design**
  - Clean, responsive interface using Chakra UI
  - Dark/light mode support
  - Intuitive navigation
  - Mobile-friendly layout

### Security

- **User Authentication**
  - Secure login and registration
  - JWT-based authentication
  - Role-based access control
  - Profile management

## Technology Stack

### Frontend

- **Core**

  - React 18.2.0
  - TypeScript 5.0.0
  - Vite 4.4.0

- **UI & Routing**
  - Chakra UI 2.8.0
  - TanStack Router 1.0.0
  - Recharts 2.8.0

### Backend

- **Core**

  - Python 3.11
  - FastAPI 0.104.0
  - PostgreSQL 15.0

- **Data & Auth**
  - SQLAlchemy 2.0.0
  - Pydantic 2.4.0
  - JWT Authentication

### DevOps

- Docker & Docker Compose
- Nginx
- GitHub Actions

## Project Structure

```
accident-analyser/
├── pnpm-workspace.yaml    # Workspace configuration
├── package.json          # Root package.json
├── apps/
│   ├── dashboard/        # React frontend
│   │   ├── src/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── contexts/    # React contexts
│   │   │   ├── routes/      # Application routes
│   │   │   └── types/       # TypeScript definitions
│   │   └── public/          # Static assets
│   └── backend/          # FastAPI backend
│       ├── routers/      # API endpoints
│       ├── services/     # Business logic
│       ├── models.py     # Database models
│       └── schemas.py    # Data schemas
├── docs/                 # Documentation
│   ├── images/          # Documentation images
│   └── SYSTEM_DOCUMENTATION.md
└── docker-compose.yml   # Docker configuration
```

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- pnpm 8.0.0 or higher
- Python 3.11 or higher
- PostgreSQL 15.0 or higher
- Docker (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/lubangam/accident-analyser.git
cd accident-analyser
```

2. **Backend Setup**

```bash
cd apps/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env     # Configure your environment variables
python init_db.py
```

3. **Frontend Setup**

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies using pnpm workspaces
pnpm install

# Configure environment variables
cd apps/dashboard
cp .env.example .env
```

### Running the Application

#### Development Mode

```bash
# Backend
cd apps/backend
uvicorn main:app --reload

# Frontend (from project root)
pnpm --filter dashboard dev
```

#### Using Docker

```bash
docker-compose up
```

## API Documentation

### Authentication

- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user

### Accidents

- `GET /api/v1/accidents` - List accidents
- `POST /api/v1/accidents` - Create accident
- `GET /api/v1/accidents/{id}` - Get accident
- `PUT /api/v1/accidents/{id}` - Update accident
- `DELETE /api/v1/accidents/{id}` - Delete accident
- `POST /api/v1/accidents/upload` - Upload CSV
- `GET /api/v1/accidents/template` - Download CSV template

### Analytics

- `GET /api/v1/analytics/summary` - Get overview
- `GET /api/v1/analytics/severity` - Severity distribution
- `GET /api/v1/analytics/road-type` - Road type distribution
- `GET /api/v1/analytics/weather` - Weather conditions

## Documentation

Comprehensive system documentation is available in [SYSTEM_DOCUMENTATION.md](docs/SYSTEM_DOCUMENTATION.md), including:

- System architecture
- Database design
- API specifications
- User interface guidelines
- Deployment procedures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Dennis Lubanga**

## Acknowledgments

- Road safety advocates and traffic management authorities
- Open-source community and contributors
- Modern web development tools and frameworks
