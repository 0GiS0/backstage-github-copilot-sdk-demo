# Working with AI Agents - ${{values.name}}

This document provides guidelines for working effectively with AI coding agents when developing and maintaining the ${{values.name}} FastAPI service.

## 🤖 About AI Agents

AI coding agents are powerful tools that can help with:
- Code generation and refactoring
- Bug identification and fixing
- Test creation and improvement
- Documentation generation
- Code review and optimization
- API endpoint development

## 🚀 Getting Started with Agents

### Prerequisites

Before working with AI agents on this project:

1. **Understand the codebase structure:**
   ```
   app/
   ├── main.py          # FastAPI application entry point
   ├── models/          # Pydantic models and data structures
   ├── routers/         # API route handlers
   └── __init__.py
   ```

2. **Familiarize with key technologies:**
   - FastAPI framework
   - Pydantic for data validation
   - Uvicorn ASGI server
   - Pytest for testing

### Setting Up Your Environment

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt -r requirements-dev.txt
   ```

2. **Run the development server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Run tests:**
   ```bash
   pytest --cov=app
   ```

## 💡 Best Practices for AI Agent Collaboration

### 1. Provide Clear Context

When asking agents for help, always provide:
- **Purpose**: What you're trying to accomplish
- **Current state**: What exists in the codebase
- **Expected outcome**: What you want the result to be
- **Constraints**: Any limitations or requirements

**Example:**
```
I need to add a new endpoint for user authentication to this FastAPI service. 
The endpoint should accept email/password, validate credentials against a user 
model, and return a JWT token. Please follow the existing code patterns in 
the routers/ directory.
```

### 2. Iterative Development

Work in small iterations:
1. Ask for a specific, small change
2. Review and test the generated code
3. Provide feedback and ask for refinements
4. Move to the next iteration

### 3. Code Quality Standards

Ensure AI-generated code follows project standards:
- **Type hints**: All functions should have proper type annotations
- **Docstrings**: Use Google-style docstrings
- **Error handling**: Proper HTTP exception handling
- **Validation**: Use Pydantic models for request/response validation
- **Testing**: Include comprehensive tests for new functionality

### 4. Testing Strategy

When adding new functionality with AI agents:
1. **Unit tests**: Test individual functions and methods
2. **Integration tests**: Test API endpoints end-to-end
3. **Validation tests**: Test input validation and error cases
4. **Performance tests**: Consider load testing for critical endpoints

## 🔧 Common AI Agent Tasks

### Adding New API Endpoints

1. **Define the data model** in `app/models/`
2. **Create the router** in `app/routers/`
3. **Add comprehensive tests** in `tests/`
4. **Update API documentation** in `docs/`

### Code Refactoring

1. **Identify the scope** of refactoring
2. **Ensure tests exist** before refactoring
3. **Refactor incrementally** 
4. **Verify tests still pass**

### Bug Fixing

1. **Reproduce the bug** with a test case
2. **Identify the root cause**
3. **Implement the fix**
4. **Verify the fix** with tests

### Documentation Updates

1. **API documentation**: Update OpenAPI/Swagger docs
2. **Code comments**: Add inline documentation
3. **README updates**: Keep setup instructions current
4. **Architecture docs**: Update system design documentation

## 📝 Prompt Templates

### Adding a New Endpoint
```
Please add a new API endpoint to this FastAPI service:
- Path: [specify path]
- Method: [GET/POST/PUT/DELETE]
- Purpose: [describe functionality]
- Input: [describe expected input]
- Output: [describe expected response]
- Validation: [specify validation requirements]

Please follow the existing patterns in the codebase and include:
1. Pydantic models for request/response
2. Proper error handling
3. Comprehensive tests
4. Updated documentation
```

### Code Review
```
Please review this code for:
- Adherence to FastAPI best practices
- Proper error handling
- Security considerations
- Performance optimization opportunities
- Test coverage gaps

[paste code here]
```

### Testing
```
Please create comprehensive tests for this functionality:
[describe or paste the code to test]

Include:
- Happy path tests
- Error case tests
- Edge case tests
- Input validation tests
```

## ⚠️ Important Considerations

### Security
- **Never commit secrets** to the repository
- **Validate all inputs** using Pydantic models
- **Use proper HTTP status codes**
- **Implement rate limiting** for production endpoints

### Performance
- **Use async/await** for I/O operations
- **Implement proper database** connection pooling
- **Add caching** where appropriate
- **Monitor response times**

### Maintainability
- **Follow consistent code** style (Black, isort)
- **Write clear documentation**
- **Use meaningful variable** and function names
- **Keep functions small** and focused

## 🔗 Useful Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://pydantic-docs.helpmanual.io/)
- [Pytest Documentation](https://docs.pytest.org/)
- [Python Type Hints](https://docs.python.org/3/library/typing.html)

## 📞 Getting Help

If you encounter issues while working with AI agents:

1. **Check the logs** for error messages
2. **Review existing tests** for patterns
3. **Consult the documentation** links above
4. **Ask specific questions** rather than general ones
5. **Provide error messages** and context when seeking help

## 🎯 Success Metrics

Measure the effectiveness of AI agent collaboration:
- **Code quality**: Passes all linting and tests
- **Test coverage**: Maintains or improves coverage percentage
- **Documentation**: All new features are documented
- **Performance**: API response times remain acceptable
- **Security**: No security vulnerabilities introduced

---

Remember: AI agents are powerful tools, but the final responsibility for code quality, security, and functionality rests with the developer. Always review, test, and understand the code before deploying to production.
