# Getting Started

This guide will help you set up and run the ${{values.name}} FastAPI service locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Python 3.11 or higher** - [Download Python](https://python.org/downloads/)
- **pip** - Python package installer (usually comes with Python)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **VS Code** (recommended) - [Download VS Code](https://code.visualstudio.com/)

### Optional but Recommended

- **REST Client Extension** for VS Code - For testing API endpoints
- **Python Extension** for VS Code - Enhanced Python support
- **Docker** - For containerized development

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/${{values.owner}}/${{values.name}}.git
cd ${{values.name}}
```

### 2. Create Virtual Environment

It's recommended to use a virtual environment to avoid conflicts with other Python projects:

```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate
```

### 3. Install Dependencies

Install both runtime and development dependencies:

```bash
pip install --upgrade pip
pip install -r requirements.txt -r requirements-dev.txt
```

### 4. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit the `.env` file with your preferred settings:

```env
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
```

## Running the Service

### Development Server

Start the development server with hot reload:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The service will be available at:
- **API**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Using Python directly

You can also run the service directly with Python:

```bash
python -m app.main
```

This will use the settings from your `.env` file.

## Verifying the Installation

### 1. Health Check

Test that the service is running:

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{
  "status": "OK",
  "service": "${{values.name}}",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. API Endpoints

Test the main API endpoints:

```bash
# Get all memes
curl http://localhost:8000/api/memes/

# Get service status
curl http://localhost:8000/api/status
```

### 3. Interactive Documentation

Visit http://localhost:8000/docs to explore the API interactively using Swagger UI.

## Testing the API

### Using VS Code REST Client

If you have the REST Client extension installed in VS Code:

1. Open `api.http`
2. Click on "Send Request" above any HTTP request
3. View the response in VS Code

### Using curl

Basic API test examples:

```bash
# Get all memes
curl -X GET http://localhost:8000/api/memes/

# Create a new meme
curl -X POST http://localhost:8000/api/memes/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Chad Energy",
    "description": "Peak confidence and dominance",
    "category": "Attitude",
    "rating": 8.9,
    "views": 2100000,
    "max_shares": 750000
  }'

# Get meme by ID
curl -X GET http://localhost:8000/api/memes/1
```

## Running Tests

Verify everything is working by running the test suite:

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run with coverage report
pytest --cov=app --cov-report=html
```

If all tests pass, your installation is successful!

## Development Tools

### Code Formatting

Format your code automatically:

```bash
# Format with Black
black .

# Sort imports
isort .
```

### Code Linting

Check code quality:

```bash
flake8 .
```

### Documentation

Build and serve the documentation locally:

```bash
# Serve documentation with live reload
mkdocs serve

# Build static documentation
mkdocs build
```

Visit http://localhost:8001 to view the documentation.

## IDE Setup

### VS Code (Recommended)

1. Install recommended extensions:
   - Python
   - REST Client
   - GitLens
   - Thunder Client (alternative to REST Client)

2. Open the project in VS Code:
   ```bash
   code .
   ```

3. VS Code should automatically detect the Python interpreter in your virtual environment.

### Dev Container (Optional)

If you prefer using dev containers:

1. Install Docker and the Dev Containers extension in VS Code
2. Open the project in VS Code
3. Press `Ctrl+Shift+P` and select "Dev Containers: Reopen in Container"

## Troubleshooting

### Common Issues

1. **Port already in use**:
   ```bash
   # Find process using port 8000
   lsof -i :8000
   # Kill the process or use a different port
   uvicorn app.main:app --reload --port 8001
   ```

2. **Module not found errors**:
   - Ensure your virtual environment is activated
   - Reinstall dependencies: `pip install -r requirements.txt`

3. **Import errors**:
   - Make sure you're running from the project root directory
   - Check that `__init__.py` files exist in the app directories

4. **Database connection issues**:
   - This template uses in-memory storage, so no database setup is required
   - For production, you'll need to configure a proper database

### Getting Help

If you encounter issues:

1. Check the [Troubleshooting section](troubleshooting.md) in the documentation
2. Look at existing [GitHub Issues](https://github.com/${{values.owner}}/${{values.name}}/issues)
3. Create a new issue with:
   - Python version
   - Operating system
   - Error messages
   - Steps to reproduce

## Next Steps

Now that you have the service running locally:

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Read the documentation**: Run `mkdocs serve` and visit http://localhost:8001
3. **Review the code**: Start with `app/main.py` and explore the structure
4. **Run tests**: Understand the test patterns in the `tests/` directory
5. **Make changes**: Try modifying endpoints and see live reload in action

For development workflow and best practices, see the [Development Guide](development.md).
