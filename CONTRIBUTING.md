# Contributing to JobTrac 🚀

Thank you for your interest in contributing to JobTrac! We're excited to have you join our mission to help job seekers land their dream jobs faster and more efficiently.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Community Guidelines](#community-guidelines)

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Git**
- **Firebase** account (for backend services)
- Modern web browser with developer tools

### First-time Contributors

1. **Fork the repository** on GitHub
2. **Star the repository** ⭐ (helps us grow!)
3. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/jobtrac.git
   cd jobtrac
   ```

## 🛠️ Development Setup

### 1. Install Dependencies
```bash
npm install
# or
yarn install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

### 4. Additional Commands
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📁 Project Structure

```
jobtrac/
├── src/
│   ├── components/shared/     # Reusable UI components
│   ├── features/             # Feature-specific components
│   │   ├── applications/     # Job application tracking
│   │   ├── auth/            # Authentication
│   │   ├── companyResearch/ # Company research
│   │   ├── networking/      # Contact management
│   │   ├── notes/          # Note-taking system
│   │   ├── prepLog/        # Interview preparation
│   │   ├── profile/        # User analytics & settings
│   │   └── starStories/    # STAR method stories
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Firebase integration
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── pages/              # Page components
├── public/                 # Static assets
└── docs/                   # Documentation
```

## 📝 Coding Standards

### Technology Stack
- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 7.1.3
- **Styling**: Tailwind CSS 3.4.1
- **Animations**: Framer Motion 12.23.6
- **Backend**: Firebase 12.0.0 (Firestore, Auth)
- **Icons**: Lucide React
- **Charts**: Recharts

### Code Style Guidelines

#### TypeScript
- Use **strict TypeScript** with proper type annotations
- Prefer `interface` over `type` for object shapes
- Use `const assertions` for immutable data
- Export types alongside components

```typescript
// ✅ Good
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export const UserCard: React.FC<{ user: UserProfile }> = ({ user }) => {
  // component logic
};

export type { UserProfile };
```

#### React Components
- Use **functional components** with hooks
- Implement **React.memo** for performance optimization
- Use **custom hooks** for reusable logic
- Follow the **component-based architecture**

```typescript
// ✅ Good
import React, { memo } from 'react';

interface Props {
  title: string;
  onClick: () => void;
}

const Button = memo<Props>(({ title, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
    >
      {title}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
```

#### Styling Guidelines
- Use **Tailwind CSS** for styling
- Support **multi-theme** (Light, Dark, AMOLED) using `dark:` and `amoled:` variants
- Implement **responsive design** with mobile-first approach
- Use **glassmorphism effects** with backdrop blur and semi-transparent backgrounds

```typescript
// ✅ Good - Theme-aware responsive styling
<div className="p-4 bg-white/80 dark:bg-dark-card/80 amoled:bg-amoled-card/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-dark-border/50 amoled:border-amoled-border/50 sm:p-6 lg:p-8">
  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-dark-text amoled:text-amoled-text">
    Title
  </h2>
</div>
```

#### Animations
- Use **Framer Motion** for animations
- Keep animations **subtle and professional** (2° rotation vs 5°)
- Implement **smooth transitions** with proper easing
- Support **reduced motion** preferences

```typescript
// ✅ Good
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  whileHover={{ scale: 1.02, rotate: 2 }}
>
  Content
</motion.div>
```

### File Naming Conventions
- **Components**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`)
- **Utilities**: camelCase (`formatDate.ts`)
- **Types**: PascalCase (`UserTypes.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## 🔄 Making Changes

### Branch Naming
- **Features**: `feature/description-of-feature`
- **Bug fixes**: `fix/description-of-bug`
- **Documentation**: `docs/description-of-changes`
- **Refactoring**: `refactor/description-of-changes`

### Commit Message Format
Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add Google OAuth integration
fix(kanban): resolve drag and drop state issues  
docs(readme): update installation instructions
style(ui): improve button hover animations
refactor(hooks): optimize useFirestore performance
test(components): add unit tests for Modal component
```

### Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes**:
   ```bash
   npm run dev      # Test in development
   npm run build    # Test production build
   npm run lint     # Check code style
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat(scope): your descriptive message"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 🧪 Testing

### Manual Testing Checklist
- [ ] **Responsive Design**: Test on mobile, tablet, and desktop
- [ ] **Theme Support**: Verify Light, Dark, and AMOLED themes
- [ ] **Cross-browser**: Test on Chrome, Firefox, Safari, Edge
- [ ] **Accessibility**: Check keyboard navigation and screen readers
- [ ] **Performance**: Ensure smooth animations and fast loading

### Component Testing
- Test components in isolation
- Verify theme switching works correctly
- Check responsive behavior
- Test error states and edge cases

### Integration Testing
- Test Firebase authentication flow
- Verify real-time data synchronization
- Test drag-and-drop functionality
- Validate form submissions and data persistence

## 📤 Submitting Changes

### Pull Request Process

1. **Ensure your PR**:
   - [ ] Has a clear, descriptive title
   - [ ] Includes a detailed description of changes
   - [ ] References relevant issues (`Fixes #123`)
   - [ ] Follows our coding standards
   - [ ] Has been tested across themes and devices

2. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes made

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Documentation update
   - [ ] Performance improvement
   - [ ] Code refactoring

   ## Testing
   - [ ] Tested on multiple devices
   - [ ] Verified theme compatibility
   - [ ] Checked accessibility

   ## Screenshots
   (If applicable, add screenshots)

   ## Related Issues
   Fixes #(issue number)
   ```

3. **Review Process**:
   - Maintainers will review your PR within 48 hours
   - Address any feedback promptly
   - Be open to suggestions and improvements

## 🐛 Reporting Issues

### Before Reporting
1. **Search existing issues** to avoid duplicates
2. **Update to the latest version** to see if the issue persists
3. **Test in different browsers** and themes

### Issue Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Step one
2. Step two
3. Step three

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g., Windows 10, macOS 12]
- Browser: [e.g., Chrome 98, Firefox 95]
- Theme: [Light/Dark/AMOLED]
- Device: [Desktop/Mobile/Tablet]

**Screenshots**
Add screenshots if applicable

**Additional Context**
Any other relevant information
```

## 💡 Feature Requests

We love hearing new ideas! When suggesting features:

1. **Check existing feature requests** first
2. **Describe the problem** your feature would solve
3. **Explain your proposed solution** in detail
4. **Consider alternatives** and their trade-offs
5. **Add mockups or examples** if helpful

### Current Roadmap Priorities
- 🔥 **Chrome Extension** (Job Importer, Company Clipper)
- 🤖 **AI Integration** (Resume/Cover Letter Generation)
- 📊 **Advanced Analytics** (Success Metrics, Insights)
- 🔗 **API Integration** (LinkedIn, Indeed, etc.)
- 📱 **Mobile App** (React Native)

## 🤝 Community Guidelines

### Code of Conduct
- **Be respectful** and inclusive
- **Help others** learn and grow
- **Give constructive feedback**
- **Follow our values**: Collaboration, Excellence, Innovation

### Getting Help
- 💬 **Discussions**: Ask questions in GitHub Discussions
- 🐛 **Issues**: Report bugs and request features
- 📧 **Email**: Reach out to maintainers for sensitive topics
- 📚 **Documentation**: Check our docs for detailed guides

### Recognition
Contributors will be:
- ✨ Added to our **Contributors Hall of Fame**
- 🏆 Mentioned in **release notes**
- 🎯 Invited to join our **core contributor team** (for regular contributors)

## 📚 Additional Resources

- 📖 [Project Documentation](./docs/)
- 🎨 [Design System Guide](./docs/design-system.md)
- 🔧 [API Documentation](./docs/api.md)
- 🚀 [Deployment Guide](./docs/deployment.md)
- 📱 [Mobile Guidelines](./docs/mobile.md)

## 🙏 Thank You

Every contribution makes JobTrac better for job seekers worldwide. Whether you're fixing a typo, adding a feature, or improving documentation, you're helping people land their dream jobs faster!

---

**Happy Contributing!** 🎉

*Built with 💜 by the JobTrac community*

---

### Quick Links
- 🌟 [Star the repo](https://github.com/hariharen9/jobtrac)
- 🐛 [Report a bug](https://github.com/hariharen9/jobtrac/issues/new)
- 💡 [Request a feature](https://github.com/hariharen9/jobtrac/issues/new)
- 💬 [Join discussions](https://github.com/hariharen9/jobtrac/discussions)