# Contributing to Better Analytics

Thank you for your interest in contributing to Better Analytics! This document outlines the process for contributing to our project and maintaining high code quality.

## Table of Contents
- [Development Workflow](#development-workflow)
- [Branch Protection](#branch-protection)
- [Issue Management](#issue-management)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [License](#license)

## Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bug/*` - Bug fixes
- `hotfix/*` - Urgent fixes that need to be applied to `main`
- `release/*` - Release preparation

### Issue-First Development
1. **Create an Issue First**
   - Every change should start with an issue
   - Use issue templates for bugs, features, and documentation
   - Clearly describe the problem or feature request to the best of your ability - the more information you provide, the better. This includes screenshots, code snippets, and any other relevant information.
   - Include acceptance criteria when applicable

2. **Branch Naming**
   - Format: `type/issue-number-description`
   - Example: `feature/42-add-user-authentication`

3. **Pull Request Process**
   - Create PRs against the `develop` branch
   - Link PR to the relevant issue
   - Use PR templates for consistent documentation (TODO)
   - Ensure all CI checks pass (TODO)
   - Get at least one review before merging

## Branch Protection

The following rules are enforced on protected branches (TODO):

### Main Branch
- No direct pushes
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date before merging
- Require linear history
- Require signed commits

### Develop Branch
- No direct pushes
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date before merging

## Issue Management

### Issue Labels
- `bug` - Something isn't working
- `feature` - A new feature
- `task` - A task that needs to be done
- `enhancement` - Minor addition or feature enhancement
- `documentation` - Documentation only changes
- `security` - Security related changes
- `refactor` - Code change that neither fixes a bug nor adds a feature
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `priority: high/medium/low` - Issue priority
- `status: in progress` - Currently being worked on
- `status: blocked` - Blocked by other issues

## Pull Request Process

1. **Before Creating a PR**
   - Ensure your branch is up to date with `develop`
   - Run all tests locally
   - Follow the code style guide
   - Update documentation if needed

2. **PR Description**
   - Link to the related issue
   - Describe the changes made
   - List any breaking changes
   - Include screenshots for UI changes
   - Document testing steps

3. **Review Process**
   - Address all review comments
   - Keep PRs focused and small
   - Update PR if base branch changes
   - Squash commits before merging

## Code Review Guidelines

### For Reviewers
- Be constructive and specific
- Check for security implications
- Verify test coverage
- Ensure documentation is updated
- Consider performance impact
- Keep a good tone

### For Authors
- Respond to all review comments
- Keep PRs up to date
- Be open to feedback
- Document complex decisions

## License

By contributing to Better Analytics, you agree that your contributions will be licensed under the AGPL-3.0 license. 