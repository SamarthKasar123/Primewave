# Contributing to Primewave

Thank you for your interest in contributing to Primewave! We welcome contributions from the community and are pleased to have you here.

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Git
- MongoDB Atlas account

### Fork and Clone
1. Fork the repository on GitHub
2. Clone your forked repository:
   ```bash
   git clone https://github.com/yourusername/Primewave.git
   cd Primewave
   ```

## 🛠️ Development Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configure your environment variables
   npm run seed
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📋 How to Contribute

### 🐛 Reporting Bugs
1. Check if the bug has already been reported in the [Issues](https://github.com/SamarthKasar123/Primewave/issues)
2. If not, create a new issue with:
   - Clear bug description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (if applicable)
   - Environment details

### 💡 Suggesting Features
1. Check existing [Feature Requests](https://github.com/SamarthKasar123/Primewave/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement)
2. Create a new issue with:
   - Clear feature description
   - Use case and benefits
   - Possible implementation approach

### 🔧 Code Contributions

#### Branch Naming Convention
- `feature/feature-name` - for new features
- `bugfix/bug-description` - for bug fixes
- `hotfix/critical-fix` - for critical fixes
- `docs/documentation-update` - for documentation

#### Development Workflow
1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes following our coding standards

3. Test your changes:
   ```bash
   # Backend tests
   cd backend && npm test
   
   # Frontend tests
   cd frontend && npm test
   ```

4. Commit your changes:
   ```bash
   git add .
   git commit -m "Add: your descriptive commit message"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## 📝 Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow functional component patterns
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### Git Commit Messages
Follow the format: `Type: Description`

Types:
- `Add:` - New features
- `Fix:` - Bug fixes
- `Update:` - Updates to existing features
- `Remove:` - Removing code/features
- `Docs:` - Documentation changes
- `Style:` - Code style changes
- `Refactor:` - Code refactoring

Examples:
```
Add: client registration validation
Fix: JWT token expiration handling
Update: user dashboard UI components
Docs: API endpoint documentation
```

### Code Style
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Maximum line length: 100 characters
- Use meaningful function and variable names

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing
1. Test user registration/login flows
2. Test manager/client dashboards
3. Test API endpoints
4. Verify responsive design
5. Check cross-browser compatibility

## 📖 Documentation

When contributing, please ensure:
- Update README.md if needed
- Add JSDoc comments for functions
- Update API documentation for new endpoints
- Include inline comments for complex logic

## 🔍 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's coding standards
- [ ] Tests pass locally
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Responsive design verified
- [ ] Cross-browser compatibility checked

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing done

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No new warnings/errors
```

## 🤝 Code of Conduct

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what's best for the community
- Show empathy towards other community members

### Unacceptable Behavior
- Harassment or discriminatory language
- Personal attacks or trolling
- Public or private harassment
- Publishing others' private information
- Other conduct inappropriate in a professional setting

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **Discussions**: For questions and general discussion
- **Email**: Contact the maintainer for private matters

## 🏆 Recognition

Contributors will be:
- Listed in the project's contributors section
- Mentioned in release notes for significant contributions
- Invited to join the core team for consistent, quality contributions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Primewave! 🎬✨
