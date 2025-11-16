# GitHub Setup Instructions

## ✅ Git Repository Initialized

Your local Git repository has been initialized and all files have been committed.

## 🚀 Push to GitHub

### Option 1: Create New Repository on GitHub (Recommended)

1. **Go to GitHub.com** and sign in
2. **Click the "+" icon** in the top right → "New repository"
3. **Repository name**: `ghostart-mini-app` (or your preferred name)
4. **Description**: "GHOSTART NFTs & Meme Token Trading Wallet - World Chain Mini App"
5. **Visibility**: Choose Public or Private
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. **Click "Create repository"**

### Option 2: Use Existing Repository

If you already have a GitHub repository, use its URL.

## 📤 Push Commands

After creating the repository on GitHub, run these commands:

```bash
# Add GitHub remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### Example:
```bash
git remote add origin https://github.com/yourusername/ghostart-mini-app.git
git push -u origin main
```

## 🔐 Authentication

If prompted for credentials:
- **Username**: Your GitHub username
- **Password**: Use a Personal Access Token (not your password)
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` scope
  - Use this token as your password

## ✅ Verify

After pushing, check your GitHub repository - all files should be there!

## 📝 Next Steps

1. **Set up GitHub Actions** (optional) for CI/CD
2. **Add repository description** and topics
3. **Connect to Vercel** for automatic deployments
4. **Add collaborators** if working in a team

