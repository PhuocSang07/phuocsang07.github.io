# Tran Phuoc Sang - Portfolio & Blog 👋

![PhuocSang's github views](https://komarev.com/ghpvc/?username=PhuocSang07)

Personal portfolio website with integrated blog system for sharing AI research, experiments, and technical notes.

## 🌟 Features

### Portfolio
- **Modern Portfolio**: Responsive cyberpunk-themed portfolio showcasing skills, experience, and projects
- **Dark/Light Mode**: Theme switching with persistent preferences

### Blog System (Chirpy-Inspired 🎯)
- **Auto-Post Detection**: Just add markdown files - they appear automatically!
- **Git Hooks Integration**: Auto-generate posts index on commit
- **CLI Tool**: Create posts with templates in seconds (`npm run new-post`)
- **Watch Mode**: Auto-reload during development (`npm run dev`)
- **Pinned Posts**: Pin important posts to the top (Chirpy feature)
- **Rich Frontmatter**: Full support for categories, tags, math, mermaid, images
- **Categories & Tags**: Organize posts by topics and keywords
- **Archive View**: Chronological timeline of all posts
- **Search & Filter**: Full-text search and multi-criteria filtering
- **Reading Time**: Automatic calculation of estimated reading time
- **Table of Contents**: Auto-generated TOC for long posts
- **Syntax Highlighting**: Code blocks with highlight.js
- **Math Formulas**: LaTeX support with MathJax/KaTeX
- **Mermaid Diagrams**: Flow charts and diagrams

## 📁 Project Structure

See [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md) for detailed structure information.

```
PhuocSang07/
├── assets/           # Static resources (CSS, JS, images)
├── blog/            # Blog interface
├── posts/           # Markdown blog posts
├── docs/            # Documentation
├── template/        # Post templates
├── index.html       # Portfolio homepage
└── posts-index.js   # Blog posts index (just filenames!)
```

## 🚀 Quick Start

### View the Site

1. **Clone the repository**
   ```bash
   git clone https://github.com/PhuocSang07/PhuocSang07.git
   cd PhuocSang07
   ```

2. **Open in browser**
   - Portfolio: Open `index.html`
   - Blog: Navigate to `/blog/` or click "Blog" in the navigation

### Add a New Post (Chirpy-Style! ⚡)

**Method 1: CLI Tool (Recommended)**
```bash
# Interactive mode - answers prompts
npm run new-post

# Quick mode - provide title and category
npm run new "My Amazing Post" experiment

# Commit (git hook auto-generates index)
git add .
git commit -m "Add new post"
git push
```

**Method 2: Manual**
```bash
# Create markdown file in posts/exp/, posts/study/, or posts/dailynote/
# Example: posts/exp/2025-10-04-my-experiment.md

# Add frontmatter (Chirpy-style)
---
title: My Experiment
date: 2025-10-04T10:00:00+07:00
categories: [experiment]
tags: [ai, ml, python]
pin: false
math: false
mermaid: false
---

# Your content here...

# Commit (git hook handles the rest!)
git add .
git commit -m "Add new post"
git push
```

**Method 3: Development Mode**
```bash
# Start watch mode
npm run dev

# Add/edit markdown files - index auto-updates!
# Preview in browser
```

📖 **See [docs/QUICK_START.md](docs/QUICK_START.md) or [docs/CHIRPY_WORKFLOW.md](docs/CHIRPY_WORKFLOW.md) for detailed guide**

## 📖 Documentation

### Getting Started (Start Here! 🎯)
- **[QUICK_START.md](docs/QUICK_START.md)**: ⚡ 3-step quick start guide
- **[CHIRPY_WORKFLOW.md](docs/CHIRPY_WORKFLOW.md)**: 🚀 Complete Chirpy-inspired workflow guide

### Blog & Posts
- **[AUTO_GENERATE_POSTS.md](docs/AUTO_GENERATE_POSTS.md)**: Auto-generate posts index (RECOMMENDED!)
- **[ADDING_POSTS.md](docs/ADDING_POSTS.md)**: Quick guide to add new blog posts
- **[BLOG_GUIDE.md](docs/BLOG_GUIDE.md)**: Comprehensive guide for using the blog system

### Reference
- **[PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)**: Detailed project structure documentation
- **[IMPROVEMENTS.md](docs/IMPROVEMENTS.md)**: History of improvements and features
- **[MIGRATION_posts-index.md](docs/MIGRATION_posts-index.md)**: Why we switched from posts.json

## 📝 Available Commands

```bash
# Create new post
npm run new-post          # Interactive mode
npm run new "Title" exp   # Quick create

# Development
npm run dev              # Watch mode (auto-reload)
npm run watch            # Same as dev

# Build
npm run update-posts     # Regenerate posts index
npm run refresh          # Same as update-posts
```

## 🎨 Post Templates

Three templates available in `template/`:
- **post-exp.md**: For experiments and prototypes
- **post-study.md**: For study notes and tutorials  
- **post-dailynote.md**: For daily notes and thoughts

Each template includes:
- ✅ Full Chirpy-style frontmatter
- ✅ Structured sections
- ✅ Code examples
- ✅ Best practices

## 👨‍💻 About Me

- 🌱 Currently learning Computer Science at Ton Duc Thang University
- 🔬 AI Research Assistant interested in Machine Learning and Deep Learning
- 💼 Intern with less than 1 year of experience
- 🎓 English Proficiency: Aptis Level B2

# 📫 How to reach me: 
[![Linkedin](https://i.stack.imgur.com/gVE0j.png) LinkedIn](https://www.linkedin.com/in/phuocsang2412/)
[![GitHub](https://i.stack.imgur.com/tskMh.png) GitHub](https://github.com/PhuocSang07/) 

<!-- # Skills: -->


# Github:
![PhuocSang's github stats](https://github-readme-stats-git-masterrstaa-rickstaa.vercel.app/api?username=PhuocSang07&show_icons=true&theme=tokyonight&hide=contribs,prs,issues)
<!--
<a href="https://github.com/uvipen/QuickDraw/">
  <!-- Change the `github-readme-stats.anuraghazra1.vercel.app` to `github-readme-stats.vercel.app`  -->
<!--  
  <img align="center" src="https://github-readme-stats.anuraghazra1.vercel.app/api/pin/?username=uvipen&repo=QuickDraw&theme=radical" />
</a>    
-->
