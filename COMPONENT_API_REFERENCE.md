# 📦 StudySphere AI - Component Structure & API Reference

## Component Architecture

### New Components Added

```
components/
├── Logo.tsx ........................... [NEW] Reusable branding component
├── MarkdownRenderer.tsx ............... [NEW] Markdown rendering with syntax highlighting
├── LaTeXRenderer.tsx .................. [NEW] Mathematical formula rendering
├── ContentRenderer.tsx ................ [NEW] Unified markdown + LaTeX renderer
├── AnswerCard.tsx ..................... [UPDATED] Now uses ContentRenderer
├── Navbar.tsx ......................... [EXISTING] Can be updated to use Logo
├── Sidebar.tsx ........................ [UPDATED] Now uses Logo component
├── Flashcard.tsx ...................... [EXISTING] Can use ContentRenderer for rich content
├── QuestionInput.tsx .................. [EXISTING]
├── PlannerCard.tsx .................... [EXISTING]
├── protected-route.tsx ................ [EXISTING]
├── theme-provider.tsx ................. [EXISTING]
├── toast-provider.tsx ................. [EXISTING]
└── ui/ ................................ [EXISTING]
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── progress.tsx
    └── textarea.tsx
```

---

## 🔧 Component APIs

### 1. Logo Component

**File:** `components/Logo.tsx`

```tsx
interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  useDefaultImage?: boolean;
}

export function Logo(props: LogoProps): JSX.Element
```

**Props:**
- `size`: 'sm' (8x8) | 'md' (10x10) | 'lg' (20x20) - Default: 'md'
- `showText`: Show/hide "StudySphere AI" text - Default: true
- `useDefaultImage`: Use emoji vs. placeholder - Default: false

**Sizes:**
- `sm`: w-8 h-8 text-sm
- `md`: w-10 h-10 text-lg
- `lg`: w-20 h-20 text-3xl

**Usage:**
```tsx
import { Logo } from '@/components/Logo';

// Default
<Logo />

// Large without text
<Logo size="lg" showText={false} />

// Small with text
<Logo size="sm" showText={true} />
```

---

### 2. MarkdownRenderer Component

**File:** `components/MarkdownRenderer.tsx`

```tsx
interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer(props: MarkdownRendererProps): JSX.Element
```

**Props:**
- `content`: Markdown string to render
- `className`: CSS classes for the wrapper div

**Features:**
- ✅ Headers (h1-h6)
- ✅ Bold, italic, strikethrough
- ✅ Lists (ordered and unordered)
- ✅ Code blocks with syntax highlighting
- ✅ Inline code
- ✅ Blockquotes
- ✅ Tables
- ✅ Links
- ✅ Images
- ✅ Horizontal rules
- ✅ Dark mode support

**Supported Code Languages:**
- Python, JavaScript, TypeScript
- HTML, CSS, SQL
- Java, C++, C#, Go, Rust
- JSON, YAML, XML
- Bash, PowerShell
- And 100+ more via Prism

**Usage:**
```tsx
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

const markdown = `
# Title
This is **bold** and this is *italic*.

## Code Example
\`\`\`python
def hello():
    print("Hello, World!")
\`\`\`

| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |
`;

<MarkdownRenderer 
  content={markdown}
  className="prose dark:prose-invert"
/>
```

---

### 3. LaTeXRenderer Component

**File:** `components/LaTeXRenderer.tsx`

```tsx
interface LaTeXRendererProps {
  content: string;
  inline?: boolean;
  className?: string;
}

export function LaTeXRenderer(props: LaTeXRendererProps): JSX.Element

interface ExtractedPart {
  type: 'text' | 'inline' | 'block';
  content: string;
}

export function useLatexExtraction(text: string): ExtractedPart[]
```

**Props:**
- `content`: LaTeX formula string
- `inline`: Render inline vs block - Default: false
- `className`: CSS classes for wrapper

**LaTeX Delimiters:**
- Inline: `$formula$`
- Block: `$$formula$$`

**Supported Notation:**
- Greek letters: `\alpha`, `\beta`, `\Gamma`, etc.
- Fractions: `\frac{numerator}{denominator}`
- Superscripts: `x^2`
- Subscripts: `x_i`
- Square root: `\sqrt{x}`
- Summation: `\sum_{i=1}^{n}`
- Integration: `\int_{a}^{b}`
- Limits: `\lim_{x \to \infty}`
- Matrices: `\begin{matrix} ... \end{matrix}`
- And full LaTeX mathematical notation

**Hook: useLatexExtraction**
```tsx
const parts = useLatexExtraction(mixedText);
// Returns array of {type: 'text'|'inline'|'block', content: string}
```

**Usage:**
```tsx
import { LaTeXRenderer, useLatexExtraction } from '@/components/LaTeXRenderer';

// Direct inline rendering
<LaTeXRenderer content="E=mc^2" inline={true} />

// Direct block rendering
<LaTeXRenderer 
  content="\frac{-b \pm \sqrt{b^2-4ac}}{2a}" 
  inline={false} 
/>

// Extract and process mixed content
const parts = useLatexExtraction("The answer is $x = 5$");
```

---

### 4. ContentRenderer Component

**File:** `components/ContentRenderer.tsx`

```tsx
interface ContentRendererProps {
  content: string;
  className?: string;
  supportMarkdown?: boolean;
  supportLatex?: boolean;
}

export function ContentRenderer(props: ContentRendererProps): JSX.Element
```

**Props:**
- `content`: Mixed markdown and LaTeX content
- `className`: CSS classes for wrapper
- `supportMarkdown`: Enable markdown - Default: true
- `supportLatex`: Enable LaTeX - Default: true

**Features:**
- ✅ Automatic markdown parsing
- ✅ Automatic LaTeX detection
- ✅ Seamless integration
- ✅ Fallback support
- ✅ Configurable features

**Recommended Approach:**
This is the recommended component for most use cases as it handles both markdown and LaTeX automatically.

**Usage:**
```tsx
import { ContentRenderer } from '@/components/ContentRenderer';

const content = `
# Quadratic Formula

The solution is:

$$x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}$$

\`\`\`python
import math

def quadratic(a, b, c):
    d = b**2 - 4*a*c
    return (-b + math.sqrt(d)) / (2*a)
\`\`\`

More info at [Wikipedia](https://en.wikipedia.org/wiki/Quadratic_formula)
`;

<ContentRenderer 
  content={content}
  supportMarkdown={true}
  supportLatex={true}
  className="my-4"
/>
```

---

### 5. Updated AnswerCard Component

**File:** `components/AnswerCard.tsx`

```tsx
interface AnswerCardProps {
  question: string;
  answer: string;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  onSaveNote?: () => void;
  onCreateFlashcard?: () => void;
}

export function AnswerCard(props: AnswerCardProps): JSX.Element
```

**Updates:**
- ✅ Now uses `ContentRenderer` internally
- ✅ Full markdown and LaTeX support
- ✅ All previous features maintained
- ✅ Backward compatible

**Features Preserved:**
- ✅ Copy to clipboard
- ✅ Text-to-speech
- ✅ Save as note
- ✅ Create flashcard
- ✅ Subject and difficulty badges
- ✅ Animation and styling

**Usage:**
```tsx
import { AnswerCard } from '@/components/AnswerCard';

<AnswerCard
  question="What is the quadratic formula?"
  answer={aiGeneratedMarkdownAndLatexAnswer}
  subject="Mathematics"
  difficulty="medium"
  onSaveNote={() => console.log('Save')}
  onCreateFlashcard={() => console.log('Create flashcard')}
/>
```

---

## 🎨 Color & Styling

### Logo Colors (Default)
- Gradient: `from-blue-600 to-purple-600`
- Text color: White
- Shadow: `shadow-lg`

### MarkdownRenderer Styling
- Text: `text-gray-700 dark:text-gray-300`
- Headings: `text-gray-900 dark:text-white`
- Code blocks: Dark theme (atom-dark)
- Blockquotes: Blue accent with background
- Tables: Gray borders with zebra striping

### Dark Mode
All components automatically support dark mode via `dark:` variants.

---

## 📊 Integration Map

```
Landing Page
  └─ Logo (size: lg, showText: false)
  
Sidebar
  └─ Logo (size: md, showText: true)
  
AnswerCard
  └─ ContentRenderer
      ├─ MarkdownRenderer (for text)
      └─ LaTeXRenderer (for formulas)
      
Future Components (Flashcard, Notes, etc.)
  └─ ContentRenderer
```

---

## ⚙️ Performance Considerations

### Logo Component
- Lightweight, no rendering overhead
- CSS-based sizing (no JavaScript)
- Emoji emoji renders instantly

### MarkdownRenderer
- Parses on mount
- Memoization recommended for large content
- Code highlighting is the slowest operation

### LaTeXRenderer
- KaTeX rendering can be CPU intensive
- Caches compiled expressions
- Consider lazy loading for many formulas

### ContentRenderer
- Combines both renderers
- Recommended cache wrapper for repeated content
- Suitable for dynamic content

---

## 🔍 Debugging Tips

### Logo Not Displaying
- Check `showText` prop
- Verify size value is one of: 'sm', 'md', 'lg'
- Ensure gradient classes are working

### Markdown Not Rendering
- Verify markdown syntax
- Check console for parsing errors
- Ensure content is valid string

### LaTeX Not Rendering
- Verify formula syntax (KaTeX compatible)
- Check for escaped characters
- Use inline vs block correctly
- Try simpler formula first

### Content Not Displaying
- Check both markdown and LaTeX support are enabled
- Verify delimiters: `$formula$` and `$$formula$$`
- Check for nested delimiters (not supported)

---

## 📚 Example Components

### Creating a Rich Content Card
```tsx
import { ContentRenderer } from '@/components/ContentRenderer';
import { Card, CardContent } from '@/components/ui/card';

export function RichContentCard({ title, content }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <ContentRenderer 
          content={content}
          className="prose dark:prose-invert"
        />
      </CardContent>
    </Card>
  );
}
```

### Creating a Note Viewer
```tsx
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

export function NoteViewer({ note }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <MarkdownRenderer 
        content={note.content}
        className="max-w-3xl"
      />
    </div>
  );
}
```

### Creating a Formula Display
```tsx
import { LaTeXRenderer } from '@/components/LaTeXRenderer';

export function FormulaGallery() {
  const formulas = [
    { label: 'Pythagorean', formula: 'a^2 + b^2 = c^2' },
    { label: 'Quadratic', formula: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}' },
  ];
  
  return (
    <div className="grid gap-4">
      {formulas.map(f => (
        <div key={f.label}>
          <h3>{f.label}</h3>
          <LaTeXRenderer content={f.formula} inline={false} />
        </div>
      ))}
    </div>
  );
}
```

---

## 🚀 Best Practices

### 1. Use ContentRenderer by Default
```tsx
// ✅ Good - handles everything
<ContentRenderer content={mixedContent} />

// ❌ Avoid - unless you need specific behavior
<MarkdownRenderer content={content} />
```

### 2. Memoize ContentRenderer for Large Content
```tsx
import { useMemo } from 'react';

export function MyComponent({ content }) {
  const rendered = useMemo(
    () => <ContentRenderer content={content} />,
    [content]
  );
  return rendered;
}
```

### 3. Provide Custom Classes for Styling
```tsx
<ContentRenderer 
  content={content}
  className="prose prose-lg dark:prose-invert max-w-4xl"
/>
```

### 4. Error Boundaries Recommended
```tsx
<ErrorBoundary fallback={<div>Content render failed</div>}>
  <ContentRenderer content={content} />
</ErrorBoundary>
```

---

## 🔗 External Dependencies

### Required Packages (Already Installed)
- `react-markdown@^10.1.0`
- `react-syntax-highlighter@^15.6.6`
- `react-katex@^3.1.0`
- `katex@^0.16.25`

### Tailwind CSS
- Used for styling
- Dark mode support included

---

## 📞 Support & Documentation

- Component source code: Well-commented
- Examples: See `MARKDOWN_LATEX_EXAMPLES.md`
- Setup: See `BRANDING_AND_MARKDOWN_LATEX_UPDATE.md`
- Usage: See `IMPLEMENTATION_COMPLETE.md`

---

**Everything is ready to use! Start integrating these components into your app today.** 🚀
