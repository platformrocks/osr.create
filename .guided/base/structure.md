<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: Document the complete .guided folder structure and file naming conventions
-->

# .guided/ Structure Reference

This document defines the canonical structure for Guided Engineering documentation.

## Folder Structure

| Path                    | Purpose                                             | Naming Rules                        |
| ----------------------- | --------------------------------------------------- | ----------------------------------- |
| `.guided/base/`         | Core project structure and setup instructions       | Use kebab-case for files            |
| `.guided/product/`      | Product requirements, personas, and roadmap         | Use snake_case for product docs     |
| `.guided/architecture/` | Technical architecture, stack, and design decisions | Use kebab-case for technical docs   |
| `.guided/assessment/`   | Technical assessments and analysis results          | Use kebab-case for assessment files |
| `.guided/testing/`      | Testing strategies, coverage, and risk analysis     | Use kebab-case for testing docs     |
| `.guided/operation/`    | Operational logs, troubleshooting, and maintenance  | Use kebab-case for operational docs |
| `.guided/prompts/`      | Guided engineering prompts and templates            | Use kebab-case.yaml for prompts     |
| `.guided/schema/`       | Schema definitions for prompts and data structures  | Use kebab-case.json for schemas     |
| `.guided/context/`      | Environment and contextual information              | Use kebab-case for context files    |
| `.guided/tmp/`          | Temporary files and working documents               | Any naming, files can be deleted    |

## Canonical File List

### Base Files

- `.guided/base/project.structure.md` - Project folder structure documentation
- `.guided/base/setup.instructions.md` - Development environment setup guide
- `.guided/base/structure.md` - This file - canonical structure reference

### Product Files

- `.guided/product/prd.md` - Product Requirements Document
- `.guided/product/roadmap.md` - Product roadmap and feature planning
- `.guided/product/personas.md` - User personas and target audiences

### Architecture Files

- `.guided/architecture/stack.md` - Technology stack and framework choices
- `.guided/architecture/rules.md` - Architectural rules and principles
- `.guided/architecture/context.md` - System boundaries and contexts
- `.guided/architecture/entities.md` - Core domain entities and relationships
- `.guided/architecture/guided.md` - Guided engineering architecture decisions
- `.guided/architecture/guardrails.md` - Technical guardrails and constraints
- `.guided/architecture/plugins.md` - Plugin architecture and extensibility

### Assessment Files

- `.guided/assessment/summary.md` - Overall technical assessment summary
- `.guided/assessment/structure.md` - Project structure analysis
- `.guided/assessment/stack.md` - Technology stack assessment
- `.guided/assessment/entities.md` - Domain entity analysis
- `.guided/assessment/plugins.md` - Plugin and extensibility assessment
- `.guided/assessment/risks.md` - Technical and operational risks
- `.guided/assessment/personas.md` - Persona analysis and validation

### Testing Files

- `.guided/testing/strategy.md` - Testing strategy and approach
- `.guided/testing/playbook.md` - Testing playbook and procedures
- `.guided/testing/coverage.md` - Test coverage analysis
- `.guided/testing/risks.md` - Testing gaps and risks

### Operation Files

- `.guided/operation/worklog.md` - Operational worklog and change history
- `.guided/operation/changelog.md` - Version changelog and release notes
- `.guided/operation/troubleshooting.md` - Common issues and solutions
- `.guided/operation/faq.md` - Frequently asked questions

### Context Files

- `.guided/context/local.md` - Local development context
- `.guided/context/env.md` - Environment configuration and variables

## Naming Conventions

1. **Files**: Use kebab-case for all files (e.g., `project-structure.md`)
2. **Folders**: Use kebab-case for all folders (e.g., `architecture/`)
3. **Headers**: Use standard Guided Engineering header in all files
4. **Extensions**:
   - `.md` for documentation
   - `.yaml` for prompts
   - `.json` for schemas
   - `.txt` for temporary notes

## File Header Template

```markdown
<!--
Guided Engineering Canonical File
DO NOT REMOVE THIS HEADER
Purpose: [Brief description of file purpose]
-->
```

## Maintenance Rules

1. **Idempotency**: Running setup multiple times should not overwrite existing content
2. **Preservation**: Always preserve existing content when updating
3. **Headers**: Ensure all files have the canonical header
4. **TODO Placeholders**: Replace TODO items with actual content during assessments
5. **Timestamps**: Include timestamps in worklog entries
