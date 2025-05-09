# 🤖 LLM Instruction Files: Model-Specific Guidance

This guide explains how different Large Language Models (LLMs) handle custom instructions and provides templates for creating model-specific instruction files in your projects.

---

## 🔍 What Are LLM Instruction Files?

LLM instruction files are special files that provide context and guidance to AI models about your project's conventions, requirements, and preferences. These files help ensure consistent, accurate, and relevant responses from AI assistants when working with your codebase.

Different LLM providers implement custom instructions in different ways, but the core concept is the same: providing persistent context that shapes AI responses without needing to repeat this information in every prompt.

---

## ⚙️ Key Benefits of Instruction Files

- **Consistency**: Ensure all team members get similar AI responses following project standards
- **Efficiency**: Avoid repeating the same context in every prompt
- **Precision**: Help models understand project-specific terminology and patterns
- **Integration**: Make AI assistants behave more like knowledgeable team members

---

## 📋 Model-Specific Implementation Guide

### GitHub Copilot

**File Path**: `.github/copilot-instructions.md`

GitHub Copilot uses a Markdown file in the `.github` directory to store repository-level instructions. These instructions are automatically included in every conversation with Copilot Chat in VS Code, Visual Studio, and on GitHub.com.

**Instructions Format**:
- Plain Markdown text
- No special syntax required
- Whitespace is ignored between instructions
- Supports code blocks, lists, and other Markdown formatting

**Example**:
```markdown
# Project Instructions

- We use TypeScript for all JavaScript files
- Follow the Angular style guide for component structure
- Unit tests are required for all new features
```

**Reference**: [GitHub Copilot Repository Custom Instructions](https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot)

---

### Anthropic Claude

**File Path**: `claude.md` (in repository root)

Claude often looks for a specific file named `claude.md` in the repository root to understand project context and requirements.

**Instructions Format**:
- Markdown format
- Can include headers, lists, code blocks
- Should focus on project-specific details

**Example**:
```markdown
# Claude Instructions

This repository uses:
- React for UI components
- Jest for testing
- ESLint with Airbnb configuration

When providing code examples, prefer TypeScript and functional components.
```

---

### OpenAI (ChatGPT/GPT-4)

**File Path**: `.openai` or `openai.jsonl` (in repository root)

OpenAI models don't have a standardized file for repository instructions, but custom instructions can be provided through API parameters or stored in configuration files for tools that integrate with these models.

**API Instructions Format**:
```json
{
  "system": "You are assisting with a frontend project that uses React, TypeScript and follows these conventions: [conventions list]"
}
```

---

### Google Gemini

**File Path**: `gemini.md` (in repository root)

Like Claude, Gemini often looks for specific files to understand project context, though this varies by integration method.

**Instructions Format**:
- Clear, concise Markdown
- Focus on actionable guidance

**Example**:
```markdown
# Gemini Instructions

This codebase follows Google's JavaScript style guide and uses:
- React for components
- Material-UI for styling
- Firebase for backend services
```

---

## 🧠 Creating a Universal Instructions File

For maximum compatibility across different LLMs, consider creating a central instructions file that can be referenced or linked from model-specific files:

**File Path**: `ai/instructions.md`

This file can contain comprehensive project details, which can then be referenced or included in model-specific instruction files using symlinks or by copying relevant sections.

**Example Structure**:
```markdown
# AI Assistant Instructions

## Project Overview
[Brief description of project purpose and architecture]

## Coding Standards
[Detailed information about code style, patterns, and best practices]

## Repository Structure
[Explanation of folder organization and file naming conventions]

## Development Workflow
[Information about branching strategy, testing requirements, etc.]
```

---

## ⚠️ Limitations and Considerations

- **File Size**: Most models have limits on how much context they can process
- **Specificity vs. Generality**: Over-specific instructions may limit helpful responses
- **Contradictions**: Avoid conflicting guidance in different instruction files
- **Updates**: Remember to update instruction files when project conventions change
- **Visibility**: Be mindful that instruction files may be visible to all repository contributors

---

## 💡 Best Practices

1. **Keep Instructions Concise**: Focus on what's truly important
2. **Use Examples**: Include snippets that demonstrate desired patterns
3. **Structure Clearly**: Use headers and lists for easy scanning
4. **Prioritize Information**: Place the most important guidance first
5. **Test Different Models**: Verify instructions work as expected across LLMs
6. **Update Regularly**: Maintain instructions as your project evolves

---

## 🧬 Summary

| LLM Provider | Primary Instruction File | Format | Auto-Applied? |
|-------------|-------------------------|--------|--------------|
| GitHub Copilot | `.github/copilot-instructions.md` | Markdown | Yes (in supported tools) |
| Anthropic Claude | `claude.md` | Markdown | Varies by integration |
| OpenAI | Varies | JSON/Markdown | Varies by integration |
| Google Gemini | Varies | Markdown | Varies by integration |

---

## 🔄 Implementation Workflow

1. Create the appropriate instruction file for your primary LLM
2. Test with simple queries to verify instructions are being applied
3. Refine based on response quality
4. Create additional model-specific files as needed
5. Consider a universal instructions file for cross-model consistency

---

## 🧪 Final Thoughts

LLM instruction files represent a powerful way to make AI assistants true collaborators in your development workflow. By providing clear, consistent guidance in the formats these models understand, you can dramatically improve their ability to provide relevant, accurate, and helpful responses tailored to your project's specific needs.

As this field evolves, expect more standardization in how different AI models handle project-specific instructions. For now, maintaining separate instruction files for key models you use is the most reliable approach.