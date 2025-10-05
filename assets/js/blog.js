// === Enhanced Chirpy-Inspired Blog Script ===

// Configure marked.js
if (typeof marked !== 'undefined') {
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                return hljs.highlight(code, { language: lang }).value;
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });
}

// Global state
let allPosts = [];
let filteredPosts = [];
let currentFilters = {
    category: 'all',
    tags: [],
    keywords: [],
    search: ''
};
let currentPostIndex = -1;

// === Theme Management ===
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Update highlight.js themes
    const lightTheme = document.getElementById('highlight-theme-light');
    const darkTheme = document.getElementById('highlight-theme-dark');
    
    if (lightTheme && darkTheme) {
        if (newTheme === 'dark') {
            lightTheme.setAttribute('disabled', '');
            darkTheme.removeAttribute('disabled');
        } else {
            darkTheme.setAttribute('disabled', '');
            lightTheme.removeAttribute('disabled');
        }
    }
}

function updateThemeIcon(theme) {
    const icons = document.querySelectorAll('.theme-toggle i, .theme-toggle-mobile i');
    icons.forEach(icon => {
        icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// === Sidebar Management ===
function initSidebar() {
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// === Utility Functions ===
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// === Markdown Parsing ===
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        return { metadata: {}, content: content };
    }
    
    const frontmatterText = match[1];
    const bodyContent = match[2];
    const metadata = {};
    
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > 0) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim();
            metadata[key] = value;
        }
    });
    
    return { metadata, content: bodyContent };
}

function extractTitle(content) {
    const lines = content.split('\n');
    for (let line of lines) {
        if (line.startsWith('# ')) {
            return line.substring(2).trim();
        }
    }
    return 'Untitled Post';
}

function extractExcerpt(content, maxLength = 180) {
    let text = content
        .replace(/^#+ .+$/gm, '')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/```[\s\S]*?```/g, '')
        .trim();
    
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

// === Determine category from file path ===
function getCategoryFromPath(filePath) {
    if (filePath.includes('posts/exp/')) return 'experiment';
    if (filePath.includes('posts/study/')) return 'study';
    if (filePath.includes('posts/dailynote/')) return 'dailynote';
    return 'uncategorized';
}

// === Posts Loading ===
async function loadPosts() {
    try {
        // Check if POST_FILES is defined (from posts-index.js)
        if (typeof POST_FILES === 'undefined') {
            throw new Error('POST_FILES not defined. Please include posts-index.js');
        }
        
        allPosts = [];
        
        // Load each markdown file and extract all metadata from frontmatter
        for (let filePath of POST_FILES) {
            try {
                const contentResponse = await fetch('../' + filePath);
                if (contentResponse.ok) {
                    const markdownContent = await contentResponse.text();
                    const parsed = parseFrontmatter(markdownContent);
                    
                    // Extract all metadata from frontmatter
                    const post = {
                        path: filePath,
                        metadata: parsed.metadata,
                        fullContent: parsed.content,
                        
                        // Extract title (from frontmatter or content)
                        title: parsed.metadata.title || extractTitle(parsed.content),
                        
                        // Extract date (from frontmatter)
                        date: parsed.metadata.date || parsed.metadata.Date || new Date().toISOString().split('T')[0],
                        
                        // Extract category (Chirpy style: from categories array or fallback)
                        category: parsed.metadata.categories ? 
                            (Array.isArray(parsed.metadata.categories) ? parsed.metadata.categories[0] : parsed.metadata.categories) :
                            (parsed.metadata.category || getCategoryFromPath(filePath)),
                        
                        // Extract excerpt (from description or auto-generate)
                        excerpt: parsed.metadata.description || parsed.metadata.excerpt || extractExcerpt(parsed.content),
                        
                        // Calculate reading time
                        readingTime: calculateReadingTime(parsed.content),
                        
                        // Chirpy features
                        pin: parsed.metadata.pin === true || parsed.metadata.pin === 'true',
                        math: parsed.metadata.math === true || parsed.metadata.math === 'true',
                        mermaid: parsed.metadata.mermaid === true || parsed.metadata.mermaid === 'true',
                        image: parsed.metadata.image || null,
                        description: parsed.metadata.description || null
                    };
                    
                    // Parse tags (support both comma-separated string and array)
                    if (parsed.metadata.tags) {
                        if (typeof parsed.metadata.tags === 'string') {
                            post.tags = parsed.metadata.tags.split(',').map(t => t.trim()).filter(t => t);
                        } else if (Array.isArray(parsed.metadata.tags)) {
                            post.tags = parsed.metadata.tags;
                        }
                    } else {
                        post.tags = [];
                    }
                    
                    // Parse keywords (support both comma-separated string and array)
                    const keywordsField = parsed.metadata.key_words || parsed.metadata.keywords;
                    if (keywordsField) {
                        if (typeof keywordsField === 'string') {
                            post.keywords = keywordsField.split(',').map(k => k.trim()).filter(k => k);
                        } else if (Array.isArray(keywordsField)) {
                            post.keywords = keywordsField;
                        }
                    } else {
                        post.keywords = [];
                    }
                    
                    allPosts.push(post);
                } else {
                    console.warn(`Failed to load ${filePath}: ${contentResponse.status}`);
                }
            } catch (error) {
                console.error(`Failed to load ${filePath}:`, error);
            }
        }
        
        // Sort by pin status first, then by date (Chirpy style)
        allPosts.sort((a, b) => {
            // Pinned posts come first
            if (a.pin !== b.pin) {
                return b.pin ? 1 : -1;
            }
            // Then sort by date (newest first)
            return new Date(b.date) - new Date(a.date);
        });
        
        filteredPosts = [...allPosts];
        displayPosts(filteredPosts);
        displayTrendingTags(allPosts);
        displayCategories(allPosts);
        displayRecentPosts(allPosts);
        
        console.log(`✅ Loaded ${allPosts.length} posts successfully`);
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('posts-list').innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Failed to load blog posts. Error: ${error.message}</p>
            </div>
        `;
    }
}

// === Filtering Functions ===
function applyFilters() {
    filteredPosts = allPosts.filter(post => {
        // Category filter
        if (currentFilters.category !== 'all' && post.category !== currentFilters.category) {
            return false;
        }
        
        // Tags filter
        if (currentFilters.tags.length > 0) {
            const hasAllTags = currentFilters.tags.every(tag => 
                post.tags && post.tags.includes(tag)
            );
            if (!hasAllTags) return false;
        }
        
        // Keywords filter
        if (currentFilters.keywords.length > 0) {
            const hasAllKeywords = currentFilters.keywords.every(keyword => 
                post.keywords && post.keywords.includes(keyword)
            );
            if (!hasAllKeywords) return false;
        }
        
        // Search filter
        if (currentFilters.search) {
            const searchLower = currentFilters.search.toLowerCase();
            const searchableText = `${post.title} ${post.excerpt} ${post.tags?.join(' ') || ''} ${post.keywords?.join(' ') || ''}`.toLowerCase();
            if (!searchableText.includes(searchLower)) {
                return false;
            }
        }
        
        return true;
    });
    
    displayPosts(filteredPosts);
    updateActiveFiltersDisplay();
}

function updateActiveFiltersDisplay() {
    const hasActiveFilters = currentFilters.category !== 'all' || 
                            currentFilters.tags.length > 0 || 
                            currentFilters.keywords.length > 0 ||
                            currentFilters.search !== '';
    
    const activeFiltersDiv = document.getElementById('active-filters');
    const activeFiltersList = document.getElementById('active-filters-list');
    
    if (!hasActiveFilters) {
        activeFiltersDiv.style.display = 'none';
        return;
    }
    
    activeFiltersDiv.style.display = 'flex';
    activeFiltersList.innerHTML = '';
    
    // Category filter
    if (currentFilters.category !== 'all') {
        const tag = createFilterTag('Category: ' + currentFilters.category, () => {
            currentFilters.category = 'all';
            document.querySelectorAll('.filter-tab[data-type="category"]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.filter === 'all');
            });
            applyFilters();
        });
        activeFiltersList.appendChild(tag);
    }
    
    // Tag filters
    currentFilters.tags.forEach(tagName => {
        const tag = createFilterTag('Tag: ' + tagName, () => {
            currentFilters.tags = currentFilters.tags.filter(t => t !== tagName);
            applyFilters();
        });
        activeFiltersList.appendChild(tag);
    });
    
    // Keyword filters
    currentFilters.keywords.forEach(keyword => {
        const tag = createFilterTag('Keyword: ' + keyword, () => {
            currentFilters.keywords = currentFilters.keywords.filter(k => k !== keyword);
            applyFilters();
        });
        activeFiltersList.appendChild(tag);
    });
    
    // Search filter
    if (currentFilters.search) {
        const tag = createFilterTag('Search: "' + currentFilters.search + '"', () => {
            currentFilters.search = '';
            document.getElementById('search-input').value = '';
            applyFilters();
        });
        activeFiltersList.appendChild(tag);
    }
}

function createFilterTag(text, onRemove) {
    const span = document.createElement('span');
    span.className = 'active-filter-tag';
    span.innerHTML = `
        ${text}
        <button aria-label="Remove filter"><i class="fas fa-times"></i></button>
    `;
    span.querySelector('button').addEventListener('click', onRemove);
    return span;
}

function clearAllFilters() {
    currentFilters = {
        category: 'all',
        tags: [],
        keywords: [],
        search: ''
    };
    
    // Reset UI
    document.querySelectorAll('.filter-tab[data-type="category"]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === 'all');
    });
    document.getElementById('search-input').value = '';
    
    applyFilters();
}

// === Display Posts List ===
function displayPosts(posts) {
    const container = document.getElementById('posts-list');
    
    if (posts.length === 0) {
        container.innerHTML = `
            <div class="no-posts">
                <i class="fas fa-inbox"></i>
                <p>No posts found matching your filters.</p>
            </div>
        `;
        return;
    }
    
    // Get original indices for navigation
    const postsWithIndices = posts.map(post => ({
        ...post,
        originalIndex: allPosts.indexOf(post)
    }));
    
    container.innerHTML = postsWithIndices.map((post) => `
        <article class="post-item ${post.pin ? 'pinned' : ''}" onclick="showPost(${post.originalIndex})">
            <div class="post-item-header">
                ${post.pin ? '<span class="pin-indicator" title="Pinned Post"><i class="fas fa-thumbtack"></i> Pinned</span>' : ''}
                <time class="post-item-date">
                    <i class="far fa-calendar"></i> ${post.date || post.metadata?.Date || 'No date'}
                </time>
                ${post.category ? `<span class="post-item-category">${post.category}</span>` : ''}
            </div>
            ${post.image && typeof post.image === 'object' && post.image.path ? `
                <div class="post-item-image">
                    <img src="${post.image.path}" alt="${post.image.alt || post.title}" loading="lazy">
                </div>
            ` : ''}
            <h2 class="post-item-title">${post.title}</h2>
            <p class="post-item-excerpt">${post.excerpt}</p>
            ${post.tags && post.tags.length > 0 ? `
                <div class="post-item-tags">
                    ${post.tags.map(tag => `<span class="post-tag" onclick="event.stopPropagation(); filterByTag('${tag}')">${tag}</span>`).join('')}
                </div>
            ` : ''}
        </article>
    `).join('');
}

// === Filter by Tag/Keyword ===
function filterByTag(tagName) {
    if (!currentFilters.tags.includes(tagName)) {
        currentFilters.tags.push(tagName);
        applyFilters();
    }
}

function filterByKeyword(keyword) {
    if (!currentFilters.keywords.includes(keyword)) {
        currentFilters.keywords.push(keyword);
        applyFilters();
    }
}

function filterByCategory(category) {
    currentFilters.category = category;
    document.querySelectorAll('.filter-tab[data-type="category"]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.filter === category);
    });
    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === category);
    });
    applyFilters();
}

// === Display Trending Tags ===
function displayTrendingTags(posts) {
    const tagCount = {};
    posts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => {
                tagCount[tag] = (tagCount[tag] || 0) + 1;
            });
        }
    });
    
    const sortedTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 15);
    
    const container = document.getElementById('trending-tags');
    if (container) {
        container.innerHTML = sortedTags
            .map(([tag, count]) => 
                `<span class="post-tag" onclick="filterByTag('${tag}')" style="cursor: pointer;" title="Click to filter">${tag} (${count})</span>`
            )
            .join('');
    }
}

// === Display Categories ===
function displayCategories(posts) {
    const categoryCount = {};
    posts.forEach(post => {
        if (post.category) {
            categoryCount[post.category] = (categoryCount[post.category] || 0) + 1;
        }
    });
    
    const categoryIcons = {
        experiment: 'fa-flask',
        tutorial: 'fa-book',
        research: 'fa-microscope',
        default: 'fa-folder'
    };
    
    const container = document.getElementById('categories-list');
    if (container) {
        const categoriesHTML = Object.entries(categoryCount)
            .map(([category, count]) => `
                <div class="category-item" data-category="${category}" onclick="filterByCategory('${category}')">
                    <div class="category-name">
                        <i class="fas ${categoryIcons[category] || categoryIcons.default}"></i>
                        ${category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    <span class="category-count">${count}</span>
                </div>
            `)
            .join('');
        
        container.innerHTML = categoriesHTML;
    }
}

// === Display Recent Posts ===
function displayRecentPosts(posts) {
    const container = document.getElementById('recent-posts');
    if (container) {
        container.innerHTML = posts.slice(0, 5).map((post, index) => {
            const originalIndex = allPosts.indexOf(post);
            return `
                <a href="#" class="recent-post-link" onclick="event.preventDefault(); showPost(${originalIndex});">
                    <div class="recent-post-date">${post.date || 'No date'}</div>
                    <div class="recent-post-title">${post.title}</div>
                </a>
            `;
        }).join('');
    }
}

// === Generate Table of Contents ===
function generateTOC(content) {
    const tocContainer = document.getElementById('table-of-contents');
    const tocPanel = document.getElementById('toc-panel');
    if (!tocContainer) return;
    
    const headings = content.querySelectorAll('h1, h2, h3, h4');
    if (headings.length === 0) {
        tocPanel.style.display = 'none';
        return;
    }
    
    tocPanel.style.display = 'block';
    const tocList = document.createElement('ul');
    
    headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        
        const li = document.createElement('li');
        li.style.marginLeft = `${(parseInt(heading.tagName.substring(1)) - 1) * 1}rem`;
        
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.addEventListener('click', (e) => {
            e.preventDefault();
            heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update active state
            tocList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
            link.classList.add('active');
        });
        
        li.appendChild(link);
        tocList.appendChild(li);
    });
    
    tocContainer.innerHTML = '';
    tocContainer.appendChild(tocList);
    
    // Highlight active heading on scroll
    initTOCScrollSpy(headings, tocList);
}

function initTOCScrollSpy(headings, tocList) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocList.querySelectorAll('a').forEach(a => {
                    a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { rootMargin: '-20% 0px -70% 0px' });
    
    headings.forEach(heading => observer.observe(heading));
}

// === Show Individual Post ===
function showPost(index) {
    currentPostIndex = index;
    const post = allPosts[index];
    
    // Hide list view, show post view
    document.getElementById('blog-list-view').style.display = 'none';
    document.getElementById('blog-post-view').style.display = 'block';
    
    // Update post content
    const dateSpan = document.querySelector('#post-date span');
    if (dateSpan) {
        dateSpan.textContent = post.date || post.metadata?.Date || 'No date';
    }
    
    const readingTimeSpan = document.querySelector('#post-reading-time span');
    if (readingTimeSpan) {
        readingTimeSpan.textContent = post.readingTime || '5 min read';
    }
    
    const categorySpan = document.getElementById('post-category');
    if (categorySpan && post.category) {
        categorySpan.textContent = post.category;
        categorySpan.style.display = 'inline-block';
    } else if (categorySpan) {
        categorySpan.style.display = 'none';
    }
    
    document.getElementById('post-title').textContent = post.title;
    
    // Render markdown content
    const contentHtml = marked.parse(post.fullContent || '');
    const contentContainer = document.getElementById('post-content');
    contentContainer.innerHTML = contentHtml;
    
    // Highlight code blocks
    document.querySelectorAll('pre code').forEach((block) => {
        hljs.highlightElement(block);
    });
    
    // Generate TOC
    generateTOC(contentContainer);
    
    // Display tags with enhanced styling
    const tagsWrapper = document.getElementById('post-tags-wrapper');
    const tagsContainer = document.getElementById('post-tags');
    if (post.tags && post.tags.length > 0) {
        tagsWrapper.style.display = 'block';
        tagsContainer.innerHTML = post.tags.map(tag => 
            `<span class="post-tag" onclick="filterByTag('${tag}'); showBlogList();" title="Click to filter by this tag">${tag}</span>`
        ).join('');
    } else {
        tagsWrapper.style.display = 'none';
    }
    
    // Display keywords with enhanced styling
    const keywordsSection = document.getElementById('post-keywords-section');
    const keywordsContainer = document.getElementById('post-keywords');
    if (post.keywords && post.keywords.length > 0) {
        keywordsSection.style.display = 'block';
        keywordsContainer.innerHTML = post.keywords.map(keyword => 
            `<span class="keyword-tag" onclick="filterByKeyword('${keyword}'); showBlogList();" title="Click to filter by this keyword">${keyword}</span>`
        ).join('');
    } else {
        keywordsSection.style.display = 'none';
    }
    
    // Setup navigation buttons
    setupPostNavigation(index);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('post', index);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.pushState({ postIndex: index }, '', newUrl);
    
    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// === Setup Post Navigation ===
function setupPostNavigation(currentIndex) {
    const prevBtn = document.getElementById('prev-post');
    const nextBtn = document.getElementById('next-post');
    
    if (currentIndex > 0) {
        const prevPost = allPosts[currentIndex - 1];
        prevBtn.style.display = 'flex';
        prevBtn.querySelector('.nav-post-title').textContent = prevPost.title;
        prevBtn.onclick = () => showPost(currentIndex - 1);
    } else {
        prevBtn.style.display = 'none';
    }
    
    if (currentIndex < allPosts.length - 1) {
        const nextPost = allPosts[currentIndex + 1];
        nextBtn.style.display = 'flex';
        nextBtn.querySelector('.nav-post-title').textContent = nextPost.title;
        nextBtn.onclick = () => showPost(currentIndex + 1);
    } else {
        nextBtn.style.display = 'none';
    }
}

// === Show Blog List ===
function showBlogList() {
    document.getElementById('blog-list-view').style.display = 'block';
    document.getElementById('blog-post-view').style.display = 'none';
    document.getElementById('archive-view').style.display = 'none';
    
    const newUrl = window.location.pathname;
    window.history.pushState({}, '', newUrl);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close sidebar on mobile
    closeSidebar();
}

// === Show Archive ===
function showArchive() {
    document.getElementById('blog-list-view').style.display = 'none';
    document.getElementById('blog-post-view').style.display = 'none';
    document.getElementById('archive-view').style.display = 'block';
    
    // Generate archive timeline
    generateArchiveTimeline();
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Close sidebar on mobile
    closeSidebar();
}

// === Generate Archive Timeline ===
function generateArchiveTimeline() {
    const container = document.getElementById('archive-timeline');
    if (!container || allPosts.length === 0) return;
    
    // Group posts by year and month
    const postsByYearMonth = {};
    
    allPosts.forEach((post, index) => {
        const date = post.date || post.metadata?.Date || '2025-01-01';
        const [year, month] = date.split('-');
        
        if (!postsByYearMonth[year]) {
            postsByYearMonth[year] = {};
        }
        
        if (!postsByYearMonth[year][month]) {
            postsByYearMonth[year][month] = [];
        }
        
        postsByYearMonth[year][month].push({ ...post, originalIndex: index });
    });
    
    // Sort years descending
    const years = Object.keys(postsByYearMonth).sort((a, b) => b - a);
    
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const html = years.map(year => {
        const months = Object.keys(postsByYearMonth[year]).sort((a, b) => b - a);
        const totalPosts = months.reduce((sum, month) => sum + postsByYearMonth[year][month].length, 0);
        
        return `
            <div class="archive-year">
                <div class="year-header">
                    <div class="year-marker"></div>
                    <h2 class="year-title">${year}</h2>
                    <span class="year-count">${totalPosts} post${totalPosts !== 1 ? 's' : ''}</span>
                </div>
                ${months.map(month => {
                    const posts = postsByYearMonth[year][month];
                    const monthIndex = parseInt(month) - 1;
                    
                    return `
                        <div class="archive-month">
                            <h3 class="month-header">${monthNames[monthIndex]}</h3>
                            <div class="archive-posts-list">
                                ${posts.map(post => `
                                    <div class="archive-post-item" onclick="showPost(${post.originalIndex})">
                                        <div class="archive-post-info">
                                            <div class="archive-post-title">${post.title}</div>
                                            <div class="archive-post-meta">
                                                <span class="archive-post-date">
                                                    <i class="far fa-calendar-alt"></i>
                                                    ${post.date || 'No date'}
                                                </span>
                                                ${post.category ? `<span class="archive-post-category">${post.category}</span>` : ''}
                                            </div>
                                        </div>
                                        <i class="fas fa-arrow-right archive-post-icon"></i>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
}

// === Helper: Close Sidebar ===
function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (sidebar) sidebar.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
}

// === Search Functionality ===
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        const performSearch = () => {
            currentFilters.search = searchInput.value.trim();
            applyFilters();
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// === Back to Top Button ===
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// === Handle Browser Navigation ===
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.postIndex !== undefined) {
        showPost(event.state.postIndex);
    } else {
        showBlogList();
    }
});

// === Initialize ===
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();
    
    // Theme toggle buttons
    document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);
    document.getElementById('theme-toggle-mobile')?.addEventListener('click', toggleTheme);
    
    // Initialize sidebar
    initSidebar();
    
    // Setup filter buttons
    document.querySelectorAll('.filter-tab[data-type="category"]').forEach(btn => {
        btn.addEventListener('click', () => {
            filterByCategory(btn.dataset.filter);
        });
    });
    
    // Clear filters button
    document.getElementById('clear-filters-btn')?.addEventListener('click', clearAllFilters);
    
    // Initialize search
    initSearch();
    
    // Initialize back to top
    initBackToTop();
    
    // Load posts
    loadPosts();
    
    // Check if there's a post parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const postIndex = urlParams.get('post');
    if (postIndex !== null && !isNaN(postIndex)) {
        const checkPosts = setInterval(() => {
            if (allPosts.length > 0) {
                clearInterval(checkPosts);
                const index = parseInt(postIndex);
                if (index >= 0 && index < allPosts.length) {
                    showPost(index);
                }
            }
        }, 100);
    }
});
