# CMS Backend - GraphQL API

## Setup Instructions

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 4. Run the Server
```bash
python app.py
```

Server will start at: http://localhost:5000
GraphQL Playground: http://localhost:5000/graphql

## API Endpoints

### GraphQL Queries
- `hello` - Test query
- `getContents(status)` - Get all contents (optionally filtered by status)
- `getContent(id)` - Get specific content
- `getCategories` - Get all categories

### GraphQL Mutations
- `signup(username, email, password)` - Create new user
- `login(email, password)` - Authenticate user
- `createContent(...)` - Create new content
- `updateContent(...)` - Update existing content
- `deleteContent(id)` - Delete content

## Database

SQLite database will be created automatically at `cms.db`
