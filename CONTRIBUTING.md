# Contributing to Gift Platform

Thank you for your interest in contributing to the Gift Platform! This document provides guidelines for contributing to the project.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Pull Request Process](#pull-request-process)
6. [Reporting Bugs](#reporting-bugs)
7. [Feature Requests](#feature-requests)

## Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all. Please be respectful and considerate of others.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

## Getting Started

### Prerequisites
- Node.js 16+
- MongoDB (or MongoDB Atlas account)
- Git
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Fork the repository**
   ```bash
   # Click 'Fork' on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/gift.git
   cd gift
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/anikamustudy/gift.git
   ```

4. **Install dependencies**
   ```bash
   npm run install-all
   ```

5. **Setup environment files**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   # Edit both files with your values
   ```

6. **Seed database (optional)**
   ```bash
   cd backend
   npm run seed
   ```

7. **Start development servers**
   ```bash
   npm run dev
   ```

## Development Workflow

### Branch Naming Convention
- `feature/` - New features (e.g., `feature/add-wishlist`)
- `bugfix/` - Bug fixes (e.g., `bugfix/fix-payment-flow`)
- `hotfix/` - Critical fixes (e.g., `hotfix/security-patch`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/optimize-queries`)

### Creating a Branch

```bash
git checkout -b feature/your-feature-name
```

### Making Changes

1. Make your changes in your branch
2. Test your changes thoroughly
3. Commit with clear, descriptive messages

```bash
git add .
git commit -m "Add: Description of your changes"
```

### Commit Message Guidelines

Format: `Type: Description`

**Types:**
- `Add:` - New feature or functionality
- `Fix:` - Bug fix
- `Update:` - Update existing feature
- `Refactor:` - Code refactoring
- `Docs:` - Documentation changes
- `Style:` - Code style changes (formatting, etc.)
- `Test:` - Adding or updating tests
- `Chore:` - Maintenance tasks

**Examples:**
```
Add: User wishlist feature
Fix: Payment processing error on checkout
Update: Improve error handling in auth controller
Docs: Add API documentation for orders endpoint
```

### Keeping Your Fork Updated

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

## Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow Airbnb JavaScript Style Guide
- Use functional components with hooks
- Keep components small and focused
- Use meaningful variable and function names

### File Structure
- One component per file
- Group related components in folders
- Keep utility functions in separate files
- Use index files for cleaner imports

### Code Quality
```bash
# Run linter (if configured)
npm run lint

# Run tests
npm test

# Check formatting
npm run format
```

### Comments
- Write self-documenting code when possible
- Add comments for complex logic
- Document functions with JSDoc style
- Keep comments up-to-date

### Example Component Structure
```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * GiftCard component displays a gift package card
 * @param {Object} gift - Gift package object
 * @param {Function} onSelect - Callback when gift is selected
 */
const GiftCard = ({ gift, onSelect }) => {
  // Component logic here
  
  return (
    // JSX here
  );
};

GiftCard.propTypes = {
  gift: PropTypes.object.isRequired,
  onSelect: PropTypes.func,
};

export default GiftCard;
```

## Pull Request Process

### Before Submitting

1. **Test your changes**
   - All existing tests pass
   - New tests added for new features
   - Manual testing completed

2. **Update documentation**
   - README if needed
   - API documentation for new endpoints
   - Code comments for complex logic

3. **Code quality**
   - No console.log statements
   - No commented-out code
   - Follows coding standards
   - No merge conflicts

### Submitting a Pull Request

1. **Push your branch**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request on GitHub**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

3. **PR Description Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update
   
   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed
   
   ## Screenshots (if applicable)
   
   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Comments added where needed
   - [ ] Documentation updated
   - [ ] No new warnings generated
   ```

4. **Wait for review**
   - Respond to feedback
   - Make requested changes
   - Push updates to your branch

### After Merge

1. **Delete your branch**
   ```bash
   git branch -d feature/your-feature-name
   git push origin --delete feature/your-feature-name
   ```

2. **Update your fork**
   ```bash
   git checkout main
   git pull upstream main
   git push origin main
   ```

## Reporting Bugs

### Before Reporting
- Check if bug already reported
- Test on latest version
- Gather relevant information

### Bug Report Template

```markdown
**Describe the bug**
Clear description of the bug

**To Reproduce**
Steps to reproduce:
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g., Windows 10]
- Browser: [e.g., Chrome 91]
- Node version: [e.g., 16.14.0]

**Additional context**
Any other relevant information
```

## Feature Requests

### Feature Request Template

```markdown
**Is your feature request related to a problem?**
Clear description of the problem

**Describe the solution**
How you'd like it to work

**Describe alternatives**
Alternative solutions considered

**Additional context**
Screenshots, mockups, etc.
```

## Development Guidelines

### Backend Development

**API Endpoints:**
- RESTful conventions
- Proper HTTP status codes
- Consistent error handling
- Input validation
- Authentication/authorization

**Database:**
- Proper indexing
- Data validation in models
- Efficient queries
- No N+1 queries

**Security:**
- Sanitize inputs
- Use parameterized queries
- Implement rate limiting
- Validate file uploads
- Use HTTPS in production

### Frontend Development

**React Components:**
- Functional components
- Custom hooks for logic
- Prop validation
- Error boundaries
- Loading states

**State Management:**
- Context API for global state
- Local state for component-specific
- Avoid prop drilling
- Memoization when needed

**Performance:**
- Code splitting
- Lazy loading
- Image optimization
- Debouncing/throttling
- Avoid unnecessary re-renders

### Testing

**Unit Tests:**
- Test individual functions
- Test edge cases
- Mock external dependencies
- Aim for 80%+ coverage

**Integration Tests:**
- Test API endpoints
- Test database operations
- Test authentication flow

**E2E Tests:**
- Test critical user flows
- Test payment process
- Test complete checkout

## Questions?

Feel free to:
- Open an issue for discussion
- Ask in pull request comments
- Contact maintainers

## Recognition

Contributors will be:
- Listed in README
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎁
