# UXRay 🔍

**Automated Accessibility Testing for React/JSX Components**

UXRay is a powerful CLI tool that automatically analyzes your React/JSX components for accessibility violations, helping you build more inclusive web applications that meet WCAG 2.1 AA standards.

## 🎯 Purpose

UXRay scans your components and identifies common accessibility issues like missing alt text, improper ARIA usage, keyboard navigation problems, and more. It's designed to catch accessibility issues early in development, reducing the need for expensive post-launch fixes.

## 🚀 Technology Stack

- **Language**: TypeScript
- **Parser**: Babel AST with JSX/TSX support
- **CLI**: Node.js with chalk for beautiful output
- **Rules Engine**: Custom rule system for extensible accessibility checks
- **Export**: JSON and Markdown report generation

## ✨ Current Capabilities

### 11 Built-in Accessibility Rules

#### Critical (Error Level)
- **Button Labels** - Ensures buttons have accessible labels
- **Image Alt Text** - Validates proper alt text for images
- **ARIA Validation** - Prevents common ARIA mistakes
- **Keyboard Accessibility** - Ensures keyboard navigation works

#### Important (Warning Level)
- **Anchor Href** - Links must have href attributes
- **Form Labels** - Form inputs need proper labels
- **Iframe Titles** - Iframes require descriptive titles
- **Heading Structure** - Maintains logical document hierarchy
- **Landmark Elements** - Validates semantic HTML usage
- **Form Validation** - Checks accessibility attributes
- **Table Accessibility** - Ensures proper table markup

### Features
- **Instant Analysis** - Get accessibility scores in seconds
- **Multiple Report Formats** - JSON and Markdown export options
- **Severity Classification** - Prioritize fixes by impact level
- **WCAG Compliance** - Rules based on WCAG 2.1 AA guidelines

## 🛠️ Installation & Usage

### Install
```bash
npm install -g uxray
```

### Basic Usage
```bash
# Analyze a single component
uxray src/components/Button.tsx

# Generate detailed report
uxray src/components/Form.tsx --report json --out accessibility-report.json

# Export as Markdown
uxray src/components/Header.tsx --report md --out a11y-report.md
```

### Example Output
```
🔍 UXRay Audit Report for Button.tsx

📊 Score: 75%
✅ Passed Checks: 8 / 11

⚠️ Found 3 violations:

1. ❌ Button must have accessible label [button-label]
2. ⚠️ Missing form label association [missing-label]
3. ℹ️ Consider adding skip navigation [landmark-elements]

💡 Tip: Fixing higher severity issues (❌) will most improve accessibility.
```

## 🔧 Development

### Prerequisites
- Node.js 18+
- TypeScript 5.8+

### Setup
```bash
git clone <repository>
cd uxray
npm install
npm run build
```

### Available Scripts
```bash
npm run build    # Compile TypeScript
npm run dev      # Watch mode compilation
npm run lint     # ESLint checking
```

### Project Structure
```
src/
├── cli/           # Command-line interface
├── core/          # Core analysis engine
│   ├── analyzer.ts
│   ├── rule-engine.ts
│   ├── exporter.ts
│   └── rules/     # Accessibility rules
└── utils/         # Utility functions
```

## 🤝 Contributing

We welcome contributions! Here are some ways you can help:

### Adding New Rules
1. **Create Rule File** - Add new rule in `src/core/rules/jsx/`
2. **Follow Pattern** - Use existing rule structure as template
3. **Include Tests** - Add comprehensive test coverage
4. **Document** - Update `ACCESSIBILITY_RULES.md`

### Rule Development Guidelines
- Base rules on WCAG 2.1 AA guidelines
- Include severity justification
- Provide clear violation messages
- Consider performance impact

### Future Rule Ideas
- **Color Contrast** - Check sufficient contrast ratios
- **Skip Links** - Validate navigation shortcuts
- **Focus Management** - Ensure proper focus indicators
- **Media Accessibility** - Video/audio accessibility checks

### Getting Started
1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests and documentation
5. Submit a pull request

## 📚 Documentation

- **Accessibility Rules**: See `ACCESSIBILITY_RULES.md` for detailed rule descriptions
- **WCAG Guidelines**: All rules align with [WCAG 2.1 AA standards](https://www.w3.org/WAI/WCAG21/AA/)

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

Built with accessibility in mind, for developers who care about building inclusive web experiences.

---

**Questions? Issues?** Open an issue or contribute to make web accessibility better for everyone! 🌐♿ 