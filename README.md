# Tran Phuoc Sang - Portfolio 👋

![PhuocSang's github views](https://komarev.com/ghpvc/?username=PhuocSang07)

Personal academic portfolio: LLM research and AI agent engineering. Live at https://phuocsang07.github.io/.

## 🌟 Features

- **Academic single-page layout**: About, Publications, Projects, Experience, Education, Awards, with a sticky section navigation
- **Data-driven**: all content lives in `content/site-data.js`; `node build-site.js` renders it into static HTML (plus SEO meta and JSON-LD)
- **Dark/Light Mode**: theme toggle, remembered in `localStorage['theme']`, defaults to the OS setting
- **No framework, no JS dependency for content**: plain HTML/CSS and a small enhancement script; prints cleanly as a CV

## 📁 Project Structure

```
├── content/site-data.js          # All page content (edit this)
├── build-site.js                 # Renders site-data.js into index.html
├── index.html                    # Generated regions between <!-- build:* --> markers
├── assets/css/portfolio.css
├── assets/js/portfolio.js        # Theme toggle, active nav link, role durations, image lightbox, BibTeX copy
├── assets/images/
├── favicon.svg, robots.txt, sitemap.xml
└── .github/workflows/static.yml  # Builds and deploys to GitHub Pages
```

## ✏️ Updating the site

1. Edit `content/site-data.js` (comments in the file explain each field; empty fields and empty sections are not rendered).
2. Run `node build-site.js`. It rewrites only the `<!-- build:* -->` regions of `index.html` and fails with a clear message if a field is invalid.
3. Commit and push. The deploy workflow also runs the build, so a forgotten local build is still published correctly.

Do not edit the generated regions of `index.html` by hand; they are overwritten on the next build.

To preview locally: `python -m http.server 8000`, then open http://localhost:8000.

## 👨‍💻 About Me

- 💼 AI Agent Developer at CodePresso
- 🎓 M.Sc. student in Computer Science at Ton Duc Thang University
- 🔬 Research interests: LLM distillation, reasoning in small language models, foundation models, transfer learning
- 🌐 Languages: Vietnamese (native), English (B2)

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
