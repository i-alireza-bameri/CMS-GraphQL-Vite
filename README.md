# CMS - Content Management System

A full-stack Content Management System built with:
- **Backend**: Python + Flask + GraphQL + SQLite
- **Frontend**: React + Vite + JavaScript

## Project Structure

```
.
├── backend/              # Python GraphQL API
│   ├── app.py           # Flask application
│   ├── models.py        # Database models
│   ├── resolvers.py     # GraphQL resolvers
│   ├── requirements.txt  # Python dependencies
│   └── README.md        # Backend setup guide
│
├── frontend/            # React Vite application
│   ├── src/
│   │   ├── pages/       # Page components
│   │   ├── store/       # Zustand stores
│   │   ├── api/         # GraphQL client
│   │   └── App.jsx      # Main app component
│   ├── package.json     # Node dependencies
│   └── vite.config.js   # Vite configuration
│
└── .gitignore          # Git ignore rules
```

## Quick Start

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Create virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment:
   ```bash
   cp .env.example .env
   ```

5. Run server:
   ```bash
   python app.py
   ```
   Server starts at: http://localhost:5000

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```

4. Run development server:
   ```bash
   npm run dev
   ```
   App starts at: http://localhost:5173

## Features

✅ **User Authentication**
- Sign up with email and password
- Login with email and password
- JWT token-based authentication
- Persistent session storage

✅ **Content Management**
- Create, read, update, delete content
- Organize content by categories
- Draft and publish workflow
- Automatic slug generation

✅ **Admin Dashboard**
- View all published content
- Quick content statistics
- Easy navigation to content manager

✅ **Content Editor**
- Rich text editor for content
- Auto-generated slugs
- Category assignment
- Draft/publish toggle

## API Endpoints

### GraphQL Queries
- `hello` - Test endpoint
- `getContents(status)` - Get all contents
- `getContent(id)` - Get specific content
- `getCategories` - Get all categories

### GraphQL Mutations
- `signup(username, email, password)` - Create user
- `login(email, password)` - Authenticate user
- `createContent(...)` - Create new content
- `updateContent(...)` - Update content
- `deleteContent(id)` - Delete content

## Database Schema

### Users Table
- id (UUID)
- username (String, unique)
- email (String, unique)
- password (String, hashed)
- is_admin (Boolean)
- created_at (DateTime)
- updated_at (DateTime)

### Categories Table
- id (UUID)
- name (String, unique)
- slug (String, unique)
- description (Text)
- created_at (DateTime)
- updated_at (DateTime)

### Contents Table
- id (UUID)
- title (String)
- slug (String, unique)
- description (Text)
- body (Text)
- status (String: draft/published)
- author_id (FK to Users)
- category_id (FK to Categories)
- created_at (DateTime)
- updated_at (DateTime)
- published_at (DateTime)

## Technology Stack

### Backend
- Flask - Web framework
- Strawberry GraphQL - GraphQL implementation
- SQLAlchemy - ORM
- SQLite - Database
- PyJWT - JWT authentication
- bcrypt - Password hashing

### Frontend
- React 18 - UI library
- Vite - Build tool & dev server
- React Router - Routing
- Zustand - State management
- Axios - HTTP client

## Environment Variables

### Backend (.env)
```
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///cms.db
JWT_SECRET=your-jwt-secret
JWT_ALGORITHM=HS256
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
VITE_GRAPHQL_ENDPOINT=http://localhost:5000/graphql
```

## Development Workflow

1. Start backend server (Terminal 1):
   ```bash
   cd backend
   python app.py
   ```

2. Start frontend dev server (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. Open http://localhost:5173 in browser

4. Create account and start managing content!

## Building for Production

### Backend
```bash
cd backend
# No special build needed, deploy app.py with dependencies
```

### Frontend
```bash
cd frontend
npm run build
# Dist folder contains optimized production build
```

## Future Enhancements

- [ ] Rich text editor (TinyMCE/CKEditor)
- [ ] Image upload and management
- [ ] User roles and permissions
- [ ] Content scheduling
- [ ] SEO optimization
- [ ] API documentation (GraphQL Playground)
- [ ] Unit and integration tests
- [ ] Docker support
- [ ] CI/CD pipeline

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
