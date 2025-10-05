#!/usr/bin/env node

/**
 * Watch mode for blog development
 * Auto-regenerate posts-index.js when markdown files change
 * 
 * Usage:
 *   npm run watch
 * 
 * Features:
 * - Watches posts/ directory for changes
 * - Auto-generates posts-index.js
 * - Provides live server (optional)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WATCH_DIRECTORIES = ['posts/exp', 'posts/study', 'posts/dailynote'];
const DEBOUNCE_DELAY = 1000; // ms

let debounceTimer = null;
let isGenerating = false;

console.log('🔍 Watch Mode Started\n');
console.log('━'.repeat(60));
console.log('👀 Watching directories:');
WATCH_DIRECTORIES.forEach(dir => {
    console.log(`   - ${dir}/`);
});
console.log('━'.repeat(60));
console.log('\n💡 Tips:');
console.log('   - Add/edit markdown files in posts/ folders');
console.log('   - Posts index will auto-regenerate on save');
console.log('   - Press Ctrl+C to stop watching\n');
console.log('━'.repeat(60));
console.log('\n📝 Waiting for changes...\n');

function regeneratePostsIndex() {
    if (isGenerating) {
        console.log('⏳ Generation already in progress, skipping...');
        return;
    }
    
    isGenerating = true;
    const timestamp = new Date().toLocaleTimeString();
    
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`⏰ [${timestamp}] Change detected! Regenerating posts index...`);
    
    try {
        execSync('node generate-posts-index.js', { stdio: 'inherit' });
        console.log(`✅ [${timestamp}] Posts index updated successfully!`);
    } catch (error) {
        console.error(`❌ [${timestamp}] Error regenerating posts index:`, error.message);
    }
    
    console.log(`${'─'.repeat(60)}\n`);
    console.log('📝 Watching for more changes...\n');
    
    isGenerating = false;
}

function handleChange(eventType, filename, directory) {
    if (!filename || !filename.endsWith('.md')) {
        return;
    }
    
    const timestamp = new Date().toLocaleTimeString();
    console.log(`🔄 [${timestamp}] Detected: ${eventType} - ${directory}/${filename}`);
    
    // Debounce: wait for multiple rapid changes to settle
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        regeneratePostsIndex();
    }, DEBOUNCE_DELAY);
}

// Watch each directory
WATCH_DIRECTORIES.forEach(dir => {
    // Create directory if not exists
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}/`);
    }
    
    // Watch for changes
    try {
        fs.watch(dir, { recursive: true }, (eventType, filename) => {
            handleChange(eventType, filename, dir);
        });
        console.log(`✓ Watching: ${dir}/`);
    } catch (error) {
        console.error(`✗ Failed to watch: ${dir}/`, error.message);
    }
});

// Initial generation
console.log('\n🔄 Running initial posts index generation...\n');
regeneratePostsIndex();

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Stopping watch mode...');
    console.log('✨ Thanks for using watch mode!\n');
    process.exit(0);
});

// Keep process alive
process.stdin.resume();

