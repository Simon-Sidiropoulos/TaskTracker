# GitHub Setup Guide

## Quick Steps to Push to GitHub

### 1. Create a new repository on GitHub
1. Go to https://github.com/new
2. Repository name: `productivity-hub` (or your choice)
3. Description: "All-in-one personal productivity platform with tasks, habits, goals, and time tracking"
4. Choose Public or Private
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

### 2. Push your local repository to GitHub

After creating the repo, GitHub will show you commands. Use these:

```bash
# Add the remote repository
git remote add origin https://github.com/YOUR_USERNAME/productivity-hub.git

# Push to GitHub
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Verify
Go to your repository URL: `https://github.com/YOUR_USERNAME/productivity-hub`

## Alternative: Using GitHub CLI

If you have GitHub CLI installed:

```bash
gh repo create productivity-hub --public --source=. --remote=origin --push
```

## What's Already Set Up ✅

- ✅ Git repository initialized
- ✅ Initial commit made with all files
- ✅ README documentation committed
- ✅ .gitignore configured
- ✅ All code committed and ready to push

## Next Steps After Pushing

1. **Enable GitHub Pages** (optional):
   - Settings → Pages
   - Source: GitHub Actions
   - Deploy with `npm run build`

2. **Add Topics** to your repo:
   - productivity, react, vite, tailwindcss, task-manager, habit-tracker

3. **Create Issues/Projects** for future features

4. **Set up branch protection** (for collaboration)

## Commands Reference

```bash
# View status
git status

# View commit history
git log --oneline

# Create a new branch
git checkout -b feature/new-feature

# Push new branch
git push -u origin feature/new-feature

# Pull latest changes
git pull origin main
```

## Continuous Updates

As you work on the project, commit regularly:

```bash
git add .
git commit -m "feat: Add new feature"
git push
```

### Commit Message Convention

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting)
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks
