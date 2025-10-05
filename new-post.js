#!/usr/bin/env node

/**
 * CLI Tool to create a new blog post quickly
 * 
 * Usage:
 *   npm run new-post
 *   npm run new-post "My Post Title"
 *   npm run new-post "My Post Title" experiment
 * 
 * Inspired by Jekyll Chirpy's post creation workflow
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Category configurations
const CATEGORIES = {
    'experiment': {
        folder: 'posts/exp',
        icon: '🧪',
        description: 'Experiments & Prototypes'
    },
    'study': {
        folder: 'posts/study',
        icon: '📚',
        description: 'Study Notes & Tutorials'
    },
    'dailynote': {
        folder: 'posts/dailynote',
        icon: '📝',
        description: 'Daily Notes & Thoughts'
    }
};

// Template for new posts (Chirpy-style frontmatter)
function generateTemplate(title, category, tags = [], pin = false) {
    const now = new Date();
    const date = now.toISOString().split('T')[0];
    const datetime = now.toISOString();
    
    return `---
title: ${title}
date: ${datetime}
categories: [${category}]
tags: [${tags.join(', ')}]
pin: ${pin}
math: false
mermaid: false
image:
  path: 
  alt: 
---

# ${title}

## Introduction

Write your introduction here...

## Content

Your main content goes here.

### Example Code Block

\`\`\`python
def hello_world():
    print("Hello, World!")
\`\`\`

### Example Math (if math: true)

$$
E = mc^2
$$

## Conclusion

Summarize your findings here.

## References

1. Reference 1
2. Reference 2

---

*Last updated: ${date}*
`;
}

// Prompt user for input
function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

// Create slug from title
function createSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// Main function
async function createNewPost() {
    console.log('\n🚀 Create a New Blog Post (Chirpy-style)\n');
    console.log('━'.repeat(50));
    
    // Get title
    let title = process.argv[2];
    if (!title) {
        title = await question('📝 Post title: ');
    }
    
    if (!title || title.trim() === '') {
        console.error('❌ Error: Title is required!');
        rl.close();
        process.exit(1);
    }
    
    // Get category
    console.log('\n📂 Available categories:');
    Object.entries(CATEGORIES).forEach(([key, value], index) => {
        console.log(`   ${index + 1}. ${value.icon} ${key} - ${value.description}`);
    });
    
    let category = process.argv[3];
    if (!category || !CATEGORIES[category]) {
        const categoryNum = await question('\nSelect category (1-3): ');
        const categoryKeys = Object.keys(CATEGORIES);
        category = categoryKeys[parseInt(categoryNum) - 1];
    }
    
    if (!CATEGORIES[category]) {
        console.error('❌ Error: Invalid category!');
        rl.close();
        process.exit(1);
    }
    
    // Get tags
    const tagsInput = await question('🏷️  Tags (comma-separated, e.g., ai, ml, python): ');
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
    
    // Ask if pinned
    const pinInput = await question('📌 Pin this post? (y/N): ');
    const pin = pinInput.toLowerCase() === 'y';
    
    // Generate filename
    const date = new Date().toISOString().split('T')[0];
    const slug = createSlug(title);
    const filename = `${date}-${slug}.md`;
    const folder = CATEGORIES[category].folder;
    const filepath = path.join(folder, filename);
    
    // Create folder if not exists
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
    
    // Check if file exists
    if (fs.existsSync(filepath)) {
        console.error(`\n❌ Error: File already exists: ${filepath}`);
        rl.close();
        process.exit(1);
    }
    
    // Generate and write template
    const template = generateTemplate(title, category, tags, pin);
    fs.writeFileSync(filepath, template, 'utf-8');
    
    // Generate posts index
    console.log('\n🔄 Updating posts index...');
    const { execSync } = require('child_process');
    try {
        execSync('node generate-posts-index.js', { stdio: 'inherit' });
    } catch (error) {
        console.warn('⚠️  Warning: Could not auto-update posts index');
    }
    
    // Success message
    console.log('\n✨ Post created successfully!\n');
    console.log('━'.repeat(50));
    console.log(`📄 File: ${filepath}`);
    console.log(`📂 Category: ${CATEGORIES[category].icon} ${category}`);
    console.log(`🏷️  Tags: ${tags.join(', ') || 'none'}`);
    console.log(`📌 Pinned: ${pin ? 'Yes' : 'No'}`);
    console.log('━'.repeat(50));
    console.log('\n📝 Next steps:');
    console.log(`   1. Edit: ${filepath}`);
    console.log('   2. Preview: Open blog/index.html in browser');
    console.log('   3. Commit: git add . && git commit -m "Add new post"');
    console.log('\n🎉 Happy writing!\n');
    
    rl.close();
}

// Run
createNewPost().catch(error => {
    console.error('❌ Error:', error.message);
    rl.close();
    process.exit(1);
});

