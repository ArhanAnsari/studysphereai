# 📚 Markdown & LaTeX Examples for StudySphere AI

This guide shows practical examples of Markdown and LaTeX content that can be rendered in your StudySphere AI application.

---

## 🧮 Mathematical Formulas

### Quadratic Equation
```markdown
## Solving Quadratic Equations

The standard form of a quadratic equation is:

$$ax^2 + bx + c = 0$$

The quadratic formula gives us:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

Where:
- $a$, $b$, $c$ are coefficients
- The expression $b^2 - 4ac$ is called the discriminant
- If discriminant > 0: two real solutions
- If discriminant = 0: one solution
- If discriminant < 0: no real solutions
```

### Calculus Example
```markdown
## Integration by Parts

The formula for integration by parts is:

$$\int u \, dv = uv - \int v \, du$$

### Example:
Find $\int x e^x \, dx$

Let $u = x$ and $dv = e^x dx$

Then $du = dx$ and $v = e^x$

$$\int x e^x \, dx = xe^x - \int e^x \, dx = xe^x - e^x + C$$
```

### Matrix Operations
```markdown
## Matrix Multiplication

To multiply two matrices, we compute:

$$(AB)_{ij} = \sum_{k=1}^{n} a_{ik} b_{kj}$$

### Example:
$$\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix} \times \begin{pmatrix} 5 & 6 \\ 7 & 8 \end{pmatrix}$$
```

### Statistical Formulas
```markdown
## Normal Distribution

The probability density function:

$$f(x) = \frac{1}{\sigma\sqrt{2\pi}} e^{-\frac{(x-\mu)^2}{2\sigma^2}}$$

- $\mu$ = mean
- $\sigma$ = standard deviation
- $e$ = Euler's number ($\approx 2.71828$)
```

---

## 💻 Code Examples with Syntax Highlighting

### Python Example
```markdown
## Python - Fibonacci Sequence

\`\`\`python
def fibonacci(n):
    """Generate Fibonacci sequence up to n terms"""
    sequence = [0, 1]
    
    for i in range(2, n):
        sequence.append(sequence[i-1] + sequence[i-2])
    
    return sequence[:n]

# Example usage
result = fibonacci(10)
print(result)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
\`\`\`
```

### JavaScript Example
```markdown
## JavaScript - Async/Await

\`\`\`javascript
async function fetchUserData(userId) {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
  }
}
\`\`\`
```

### SQL Example
```markdown
## SQL - Complex Query

\`\`\`sql
SELECT 
    students.name,
    COUNT(grades.grade_id) as total_grades,
    AVG(grades.value) as average_grade
FROM students
LEFT JOIN grades ON students.student_id = grades.student_id
WHERE grades.value >= 70
GROUP BY students.student_id, students.name
HAVING COUNT(grades.grade_id) > 5
ORDER BY average_grade DESC
LIMIT 10;
\`\`\`
```

---

## 📊 Rich Text Formatting

### Comprehensive Physics Lesson
```markdown
# Newton's Laws of Motion

## First Law: Law of Inertia

An object at rest stays at rest, and an object in motion stays in motion 
unless acted upon by an external force.

$$F_{net} = 0 \Rightarrow a = 0$$

## Second Law: F = ma

The acceleration of an object is directly proportional to the net force 
acting on it and inversely proportional to its mass.

$$F_{net} = ma$$

### Example Calculation:
A 2 kg object experiences a net force of 10 N. What is its acceleration?

$$a = \frac{F}{m} = \frac{10 \text{ N}}{2 \text{ kg}} = 5 \text{ m/s}^2$$

## Third Law: Action-Reaction

For every action, there is an equal and opposite reaction.

$$F_{AB} = -F_{BA}$$

### Real-World Applications:
- Rocket propulsion
- Car acceleration
- Jumping
- Swimming
- Bird flight

---

## Key Concepts Table

| Law | Formula | Application |
|-----|---------|-------------|
| Inertia | $F=0 \Rightarrow a=0$ | No force = no acceleration |
| Force | $F = ma$ | Greater force = more acceleration |
| Momentum | $p = mv$ | Force changes momentum |
```

### Chemistry with Equations
```markdown
# Balancing Chemical Equations

## Example: Combustion of Methane

Unbalanced: $CH_4 + O_2 \rightarrow CO_2 + H_2O$

Balanced: $$CH_4 + 2O_2 \rightarrow CO_2 + 2H_2O$$

This means:
- 1 molecule of methane
- 2 molecules of oxygen
- Produces 1 molecule of carbon dioxide
- 2 molecules of water

### Stoichiometry Calculation:

How much $CO_2$ is produced from 16g of $CH_4$?

$$\text{Moles of } CH_4 = \frac{16 \text{ g}}{16 \text{ g/mol}} = 1 \text{ mol}$$

From the balanced equation (1:1 ratio):
$$\text{Moles of } CO_2 = 1 \text{ mol}$$

$$\text{Mass of } CO_2 = 1 \text{ mol} \times 44 \text{ g/mol} = 44 \text{ g}$$
```

---

## 📐 Complex Mathematical Content

### Calculus Integration
```markdown
## Advanced Integration Techniques

### Integration by Substitution

For $\int f(g(x)) \cdot g'(x) \, dx$, let $u = g(x)$:

$$\int f(u) \, du$$

**Example:** $\int 2x(x^2 + 1)^3 \, dx$

Let $u = x^2 + 1$, then $du = 2x \, dx$

$$\int u^3 \, du = \frac{u^4}{4} + C = \frac{(x^2+1)^4}{4} + C$$

### Integration by Parts

$$\int u \, dv = uv - \int v \, du$$

**Useful mnemonic:** LIATE (Logarithmic, Inverse trig, Algebraic, Trigonometric, Exponential)

**Example:** $\int x \sin(x) \, dx$

- $u = x \Rightarrow du = dx$
- $dv = \sin(x) \, dx \Rightarrow v = -\cos(x)$

$$\int x \sin(x) \, dx = -x\cos(x) + \int \cos(x) \, dx = -x\cos(x) + \sin(x) + C$$
```

### Linear Algebra
```markdown
## Determinant of 3×3 Matrix

For matrix $A = \begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}$

$$\det(A) = a(ei - fh) - b(di - fg) + c(dh - eg)$$

### Example:
$$\det\begin{pmatrix} 1 & 2 & 3 \\ 4 & 5 & 6 \\ 7 & 8 & 9 \end{pmatrix}$$

$$= 1(5 \cdot 9 - 6 \cdot 8) - 2(4 \cdot 9 - 6 \cdot 7) + 3(4 \cdot 8 - 5 \cdot 7)$$

$$= 1(45-48) - 2(36-42) + 3(32-35)$$

$$= -3 + 12 - 9 = 0$$
```

---

## 🎯 Study Tips with Mixed Content

```markdown
# Effective Study Strategy

## Active Recall Formula

The probability of remembering information:

$$P(\text{recall}) = e^{-\frac{t}{S}}$$

Where:
- $t$ = time since learning
- $S$ = strength of memory (increases with review)

## Spaced Repetition Schedule

Review intervals: 1 day, 3 days, 7 days, 14 days, 30 days

\`\`\`python
def calculate_next_review(last_review, interval):
    from datetime import timedelta, datetime
    next_date = datetime.now() + timedelta(days=interval)
    return next_date
\`\`\`

## 80/20 Study Method

Focus on the 20% of concepts that cover 80% of exam content:

1. **Priority Topics** (80% value)
   - Core concepts
   - Common formulas
   - Frequent question types

2. **Supplementary Material** (20% value)
   - Advanced applications
   - Edge cases
   - Additional depth
```

---

## 🔬 Biology with Multiple Elements

```markdown
# Photosynthesis: Light-Dependent Reactions

## Overview

$$\text{Light Energy} + 6H_2O + 6CO_2 \rightarrow C_6H_{12}O_6 + 6O_2$$

## Detailed Process

### Step 1: Light Absorption

When light hits chlorophyll:

\`\`\`
Energy State: Ground → Excited State
\`\`\`

### Step 2: Water Splitting

$$2H_2O \rightarrow O_2 + 4H^+ + 4e^-$$

### Step 3: Electron Transport Chain

The electrons travel through:
1. Photosystem II
2. Cytochrome b6f complex
3. Photosystem I

### Step 4: NADPH Production

$$NADP^+ + 2e^- + H^+ \rightarrow NADPH$$

## Location and Key Points

| Component | Location | Function |
|-----------|----------|----------|
| Photosystem II | Thylakoid | Absorbs light, splits water |
| Cyt b6f | Thylakoid | Transports electrons |
| Photosystem I | Thylakoid | Reduces NADP⁺ |
| ATP Synthase | Thylakoid | Produces ATP |
```

---

## ✨ Interactive Learning Content

These examples demonstrate how StudySphere AI can provide rich, interactive learning experiences with:

- ✅ Mathematical formulas for STEM subjects
- ✅ Code examples with proper syntax highlighting
- ✅ Structured content with headings and lists
- ✅ Tables for organized data
- ✅ Blockquotes for emphasis
- ✅ Mixed media content

---

## 🚀 Using These Examples

### To test in your app:

1. Go to the **Ask AI** page (`/ask`)
2. Ask a question like "Explain the quadratic formula"
3. The AI response will render with full markdown and LaTeX support

### To add to your study materials:

1. Copy any example above
2. Use the `ContentRenderer` component
3. It will automatically parse and display correctly

---

## 📖 More Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [KaTeX Documentation](https://katex.org/docs/support_table.html)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [React KaTeX](https://github.com/talyssonoc/react-katex)

Happy Learning! 🎓
