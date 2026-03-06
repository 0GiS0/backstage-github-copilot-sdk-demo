# AI Assistant Template Usage Guide

This guide explains how to use the **AI Assistant** template effectively to create new AI assistant projects.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- Basic understanding of Python and FastAPI development
- Required permissions to create repositories in your organization
- Basic knowledge of APIs and AI services

### Understanding This Template

**Template Type:** AI Assistant
**Primary Use Case:** Create conversational AI assistants
**Technologies:** Python, FastAPI, AI/ML libraries

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for "AI Assistant Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

The template will prompt you for several required parameters:

#### **Project Name**
- **Format:** kebab-case (lowercase with hyphens)
- **Example:** `customer-support-bot`, `code-assistant-api`
- **Requirements:** Must be unique within your organization

#### **Description**
- **Purpose:** Brief description of what your AI assistant does
- **Example:** "AI assistant for customer support with natural language processing"
- **Best Practice:** Keep it concise but descriptive

#### **Owner**
- **Format:** Team or individual username
- **Example:** `ai-team`, `customer-success`, `john.smith`
- **Recommendation:** Use team names rather than individual names when possible

#### **System**
- **Purpose:** Logical grouping of related components
- **Example:** `customer-support`, `developer-tools`, `analytics`
- **Note:** Should align with your organization's system architecture

### 3. Review and Create

1. **Review Parameters:** Verify that all information is correct
2. **Create Project:** Click "Create" to generate the project
3. **Wait for Generation:** The process may take a few minutes
4. **Access Repository:** Once created, access the new repository

## Post-Creation Setup

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-ai-assistant.git
cd your-ai-assistant

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# API Keys for AI services
OPENAI_API_KEY=your_api_key_here
HUGGINGFACE_API_KEY=your_api_key_here

# Application configuration
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000

# Database (optional)
DATABASE_URL=sqlite:///./app.db

# Logging
LOG_LEVEL=INFO
```

### 3. Run the Application

```bash
# Development mode
uvicorn src.main:app --reload

# Access documentation
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)
```

# AI Assistant Template Usage Guide

This guide explains how to use the **AI Assistant** template effectively to create new AI assistant projects.

## Before You Start

### Prerequisites

- Access to your organization's Backstage instance
- Basic understanding of Python and FastAPI development
- Required permissions to create repositories in your organization
- Basic knowledge of APIs and AI services

### Understanding This Template

**Template Type:** AI Assistant
**Primary Use Case:** Create conversational AI assistants
**Technologies:** Python, FastAPI, AI/ML libraries

## Step-by-Step Usage

### 1. Access the Template

1. **Open Backstage:** Navigate to your organization's Backstage instance
2. **Create Component:** Click on "Create Component" or "Create" button
3. **Find Template:** Look for "AI Assistant Template" in the available templates
4. **Start Creation:** Click "Choose" to begin using this template

### 2. Complete the Form

The template will prompt you for several required parameters:

#### **Project Name**
- **Format:** kebab-case (lowercase with hyphens)
- **Example:** `customer-support-bot`, `code-assistant-api`
- **Requirements:** Must be unique within your organization

#### **Description**
- **Purpose:** Brief description of what your AI assistant does
- **Example:** "AI assistant for customer support with natural language processing"
- **Best Practice:** Keep it concise but descriptive

#### **Owner**
- **Format:** Team or individual username
- **Example:** `ai-team`, `customer-success`, `john.smith`
- **Recommendation:** Use team names rather than individual names when possible

#### **System**
- **Purpose:** Logical grouping of related components
- **Example:** `customer-support`, `developer-tools`, `analytics`
- **Note:** Should align with your organization's system architecture

### 3. Review and Create

1. **Review Parameters:** Verify that all information is correct
2. **Create Project:** Click "Create" to generate the project
3. **Wait for Generation:** The process may take a few minutes
4. **Access Repository:** Once created, access the new repository

## Post-Creation Setup

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/your-org/your-ai-assistant.git
cd your-ai-assistant

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# API Keys for AI services
OPENAI_API_KEY=your_api_key_here
HUGGINGFACE_API_KEY=your_api_key_here

# Application configuration
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=8000

# Database (optional)
DATABASE_URL=sqlite:///./app.db

# Logging
LOG_LEVEL=INFO
```

### 3. Run the Application

```bash
# Development mode
uvicorn src.main:app --reload

# Access documentation
# http://localhost:8000/docs (Swagger UI)
# http://localhost:8000/redoc (ReDoc)
```

## Assistant Customization

### 1. Configure AI Model

Edit `src/services/ai_service.py`:

```python
class AIService:
    def __init__(self):
        self.model = "gpt-3.5-turbo"  # Change model here
        self.max_tokens = 150
        self.temperature = 0.7
```

### 2. Define Custom Prompts

Create prompts in `src/prompts/`:

```python
# src/prompts/customer_support.py
CUSTOMER_SUPPORT_PROMPT = """
You are a friendly and professional customer support assistant.
Your goal is to help users with their queries efficiently.

Context: {context}
User question: {question}

Response:
"""
```

### 3. Add New Routes

Create new routes in `src/routers/`:

```python
# src/routers/chat.py
from fastapi import APIRouter
from src.services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/chat")
async def chat(message: str):
    response = await ai_service.generate_response(message)
    return {"response": response}
```

## Best Practices

### 1. Context Management

- **Maintain conversation history** for context
- **Limit tokens** to control costs
- **Clean context** when necessary

### 2. Error Handling

- **Implement retry logic** for external APIs
- **Validate user input**
- **Provide fallbacks** when AI fails

### 3. Security

- **Sanitize user input**
- **Rate limiting** to prevent abuse
- **Validate API keys** and permissions
- **Don't log sensitive information**

### 4. Monitoring

- **Log important interactions**
- **Performance metrics** (latency, tokens used)
- **Alerts for frequent errors**

## Specific Use Cases

### 1. Customer Support Chatbot

```python
# Specific configuration
SYSTEM_PROMPT = "You are a customer support representative..."
KNOWLEDGE_BASE = "documents/faq.txt"
ESCALATION_KEYWORDS = ["supervisor", "manager", "complaint"]
```

### 2. Code Assistant

```python
# Configuration for development
SUPPORTED_LANGUAGES = ["python", "javascript", "typescript"]
CODE_REVIEW_PROMPT = "Review the following code..."
DOCUMENTATION_STYLE = "google"
```

### 3. Document Analyzer

```python
# For document processing
SUPPORTED_FORMATS = [".pdf", ".docx", ".txt"]
EXTRACTION_MODEL = "transformers/document-qa"
SUMMARY_LENGTH = 200
```

## Deployment

### 1. Local Development

```bash
# With Docker
docker build -t my-ai-assistant .
docker run -p 8000:8000 my-ai-assistant
```

### 2. Staging/Production

The CI/CD pipeline includes:

- **Automated tests** on every push
- **Docker image building**
- **Automatic deployment** to staging
- **Manual approval** for production

### 3. Production Environment Variables

Configure in your deployment platform:

```bash
APP_ENV=production
OPENAI_API_KEY=xxx
DATABASE_URL=postgresql://...
LOG_LEVEL=WARNING
```

## Troubleshooting

### Common Issues

#### 1. API Key Error
**Cause:** API key not configured or invalid
**Solution:** Verify configuration in `.env`

#### 2. Slow Responses
**Cause:** Model too large or too much context
**Solution:** Optimize prompts and reduce tokens

#### 3. Rate Limiting Errors
**Cause:** Too many requests to external APIs
**Solution:** Implement throttling and caching

#### 4. Memory Issues
**Cause:** Conversation context accumulation
**Solution:** Clean context periodically

## Testing

### Run Tests

```bash
# All tests
pytest

# With coverage
pytest --cov=src

# Specific tests
pytest tests/test_ai_service.py
```

### Integration Tests

```bash
# Test endpoints
pytest tests/test_api.py

# Test with mocks
pytest tests/test_ai_service_mock.py
```

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [OpenAI API Guide](https://platform.openai.com/docs/)
- [Prompt Engineering Guides](https://platform.openai.com/docs/guides/prompt-engineering)
- [Best Practices for AI Applications](../ai-best-practices.md)

## Contributing

To improve this template:

1. **Identify improvements** in generated code
2. **Test changes** locally
3. **Document changes** in PR
4. **Include tests** for new functionality
