# Documentation

This directory contains technical documentation for the vanilla-chat-v2 project.

## Documentation

### [STAGE6-BUGFIX-CHANGELOG.md](STAGE6-BUGFIX-CHANGELOG.md)
**Status**: Production
**Date**: October 25, 2025

Complete changelog for Stage 6 Report Synthesis bug fixes. Documents two critical issues:
1. Property mapping errors (type vs runtime mismatch)
2. Model stream compatibility (Llama 3.3 → 3.1)

**Key Sections**:
- Executive Summary
- Technical Root Cause Analysis
- Code Changes with Before/After Examples
- Testing & Validation Procedures
- Performance Metrics
- Deployment Checklist

**Audience**: Developers, DevOps, Technical Stakeholders

---

## Related Documentation

### Project Root Documentation

- **[CLAUDE.md](../CLAUDE.md)** - Main project guide for Claude Code
  - Development commands
  - Architecture overview
  - File structure
  - Testing procedures
  - Multi-stage research generator overview

- **[RESEARCH-GENERATOR.md](../RESEARCH-GENERATOR.md)** - Feature documentation
  - User-facing feature description
  - 3-step wizard form
  - Single-stage vs Multi-stage generation
  - Test data tools
  - Output format

- **[MULTI-STAGE-IMPLEMENTATION.md](../MULTI-STAGE-IMPLEMENTATION.md)** - Technical implementation
  - 6-stage architecture
  - API endpoints
  - Prompt engineering
  - Token budget management
  - Error handling & retries

- **[cloudflare-best-practices.md](../cloudflare-best-practices.md)** - AI development best practices
  - **Section 4.4**: Context window management (CRITICAL for Stage 6)
  - Token budget calculation
  - Prompt optimization techniques
  - Production monitoring

- **[TESTING.md](../TESTING.md)** - Testing documentation
  - Playwright MCP integration
  - E2E testing procedures
  - Local vs remote testing

---

## Documentation Standards

### File Naming Convention

- **Production docs**: Use descriptive names with version/date if applicable
  - Example: `STAGE6-BUGFIX-CHANGELOG.md`
- **Archive docs**: Original filenames preserved
- **README files**: `README.md` in each directory

### Format Guidelines

1. **Markdown Headers**: Use ATX-style (`#`) headers
2. **Code Blocks**: Specify language for syntax highlighting
3. **Tables**: Use GitHub-flavored markdown tables
4. **Links**: Use relative paths for internal links
5. **Timestamps**: Use ISO 8601 format (YYYY-MM-DD)

### Content Structure

**Production Documentation Should Include**:
- Executive Summary
- Problem Statement
- Root Cause Analysis
- Solution Details
- Testing & Validation
- Deployment Instructions
- Related Documentation Links

---

## Contributing

When adding new documentation:

1. **For bug fixes/features**: Create production-ready changelog in `docs/`
2. **Update this README**: Add new files to appropriate section
3. **Cross-reference**: Link related docs bidirectionally

---

**Last Updated**: October 25, 2025
**Maintained By**: Development Team
