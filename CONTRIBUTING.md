# Contributing to TagUI

Thank you for your interest in contributing to TagUI! We welcome contributions from the community.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/tagui.git`
3. Create a branch: `git checkout -b feature/amazing-feature`
4. Make your changes
5. Test your changes thoroughly
6. Commit with clear messages: `git commit -m 'Add amazing feature'`
7. Push to your fork: `git push origin feature/amazing-feature`
8. Open a Pull Request

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns and conventions
- Use functional components and React hooks
- Keep components under 300 lines when possible
- Use Tailwind CSS for styling
- Add JSDoc comments for complex functions
- Write meaningful commit messages

## Project Structure

```
src/
├── components/     # React components
│   ├── chat/      # Chat-related components
│   ├── layout/    # Layout components
│   ├── messages/  # Message display and input
│   ├── models/    # Model selection
│   └── settings/  # Settings UI
├── lib/           # Utility functions and services
├── stores/        # Zustand state management
└── types/         # TypeScript type definitions
```

## Component Guidelines

### Creating New Components

1. Place components in the appropriate directory
2. Use TypeScript and define proper interfaces
3. Export component as default
4. Keep components focused on single responsibility
5. Use meaningful prop names

### Example Component Structure

```tsx
import { useState } from 'react'

interface MyComponentProps {
  title: string
  onAction: () => void
}

export default function MyComponent({ title, onAction }: MyComponentProps) {
  const [state, setState] = useState(false)

  return (
    <div className="glass rounded-lg p-4">
      <h2>{title}</h2>
      <button onClick={onAction}>Action</button>
    </div>
  )
}
```

## State Management

- Use Zustand for global state
- Keep local state when it doesn't need to be shared
- Use `persist` middleware for data that should survive page refresh
- Follow the existing store patterns

## Styling Guidelines

- Use Tailwind CSS utility classes
- Follow the existing color scheme
- Use the `glass` class for glassmorphism effects
- Support both light and dark modes
- Use responsive design utilities

## Testing

Currently, TagUI doesn't have a formal test suite. We welcome contributions to add:
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright

## API Integration

When adding new API providers:

1. Add the provider type to `types/index.ts`
2. Implement streaming in `lib/api.ts`
3. Add provider configuration in settings
4. Test with real API credentials
5. Document any provider-specific quirks

## Documentation

- Update README.md for new features
- Add JSDoc comments for complex functions
- Update .env.example for new environment variables
- Include examples in PR descriptions

## Pull Request Guidelines

### Before Submitting

- [ ] Code follows project style
- [ ] All tests pass (when available)
- [ ] No console errors or warnings
- [ ] Tested in both light and dark mode
- [ ] Responsive design works on mobile
- [ ] Documentation updated if needed

### PR Description Should Include

- What does this PR do?
- Why is this change needed?
- How has it been tested?
- Screenshots (for UI changes)
- Breaking changes (if any)

## Commit Message Format

Use clear, descriptive commit messages:

```
feat: add voice input support
fix: resolve streaming timeout issue
docs: update API configuration guide
style: improve button hover effects
refactor: simplify message rendering logic
```

## Code Review Process

1. Maintainers will review your PR
2. Address any feedback or requested changes
3. Once approved, maintainers will merge

## Feature Requests and Bug Reports

- Use GitHub Issues for bug reports and feature requests
- Search existing issues before creating new ones
- Provide detailed information and reproduction steps
- Include screenshots or videos when helpful

## Questions?

Feel free to open a discussion on GitHub or reach out to the maintainers.

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on constructive feedback
- Assume good intentions

Thank you for contributing to TagUI! 🎉
