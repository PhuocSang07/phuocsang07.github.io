// Language data
const translations = {
    vi: {
        // Navigation
        "Trần Phước Sang": "Trần Phước Sang",
        "Giới thiệu": "Giới thiệu",
        "Công bố": "Công bố",
        "Dự án": "Dự án",
        "Thí nghiệm": "Thí nghiệm",
        "Kiến trúc": "Kiến trúc",
        "Liên hệ": "Liên hệ",
        
        // Hero Section
        "Xin chào, tôi là": "Xin chào, tôi là",
        "AI Engineer | Sinh viên Khoa học Máy tính": "AI Engineer | Sinh viên Khoa học Máy tính",
        "Đam mê phát triển các giải pháp AI sáng tạo với chuyên môn về Machine Learning, Deep Learning và Natural Language Processing.": "Đam mê phát triển các giải pháp AI sáng tạo với chuyên môn về Machine Learning, Deep Learning và Natural Language Processing.",
        "Liên hệ": "Liên hệ",
        "Xem dự án": "Xem dự án",
        
        // About Section
        "Giới thiệu": "Giới thiệu",
        "Là sinh viên năm 4 chuyên ngành Khoa học Máy tính, tôi đang tìm kiếm cơ hội thực tập AI Engineer để áp dụng và mở rộng kiến thức về machine learning, deep learning. Mục tiêu của tôi là hợp tác với các chuyên gia, nâng cao kỹ năng kỹ thuật và đóng vai trò tích cực trong việc phát triển các giải pháp AI có tác động, góp phần vào sự phát triển và thành công của tổ chức.": "Là sinh viên năm 4 chuyên ngành Khoa học Máy tính, tôi đang tìm kiếm cơ hội thực tập AI Engineer để áp dụng và mở rộng kiến thức về machine learning, deep learning. Mục tiêu của tôi là hợp tác với các chuyên gia, nâng cao kỹ năng kỹ thuật và đóng vai trò tích cực trong việc phát triển các giải pháp AI có tác động, góp phần vào sự phát triển và thành công của tổ chức.",
        "Học vấn": "Học vấn",
        "Cử nhân Khoa học Máy tính<br>Đại học Tôn Đức Thắng<br>2021-2025 | GPA: 8.1": "Cử nhân Khoa học Máy tính<br>Đại học Tôn Đức Thắng<br>2021-2025 | GPA: 8.1",
        "Kỹ năng lập trình": "Kỹ năng lập trình",
        "Cơ sở dữ liệu": "Cơ sở dữ liệu",
        "Chứng chỉ": "Chứng chỉ",
        "Aptis B2, Agile & Scrum (2023), PyTorch-Image (2024)": "Aptis B2, Agile & Scrum (2023), PyTorch-Image (2024)",
        
        // Publications Section
        "Công bố khoa học": "Công bố khoa học",
        "Đang cập nhật...": "Đang cập nhật...",
        "Các công bố khoa học sẽ được cập nhật trong thời gian tới.": "Các công bố khoa học sẽ được cập nhật trong thời gian tới.",
        
        // Projects Section
        "Fine-tune Qwen2.5-3B cho Legal Chatbot": "Fine-tune Qwen2.5-3B cho Legal Chatbot",
        "Tinh chỉnh mô hình Qwen2.5-3B trên tập dữ liệu văn bản pháp lý và tập QA để tạo chatbot tư vấn pháp lý. Sử dụng thư viện unsloth kết hợp với kỹ thuật LoRA.": "Tinh chỉnh mô hình Qwen2.5-3B trên tập dữ liệu văn bản pháp lý và tập QA để tạo chatbot tư vấn pháp lý. Sử dụng thư viện unsloth kết hợp với kỹ thuật LoRA.",
        "Legal Chatbot với Advanced RAG": "Legal Chatbot với Advanced RAG",
        "Phát triển hệ thống chatbot pháp lý nâng cao cho luật Việt Nam sử dụng kỹ thuật RAG. Triển khai cơ chế truy xuất tài liệu phân cấp với giao diện Streamlit thân thiện.": "Phát triển hệ thống chatbot pháp lý nâng cao cho luật Việt Nam sử dụng kỹ thuật RAG. Triển khai cơ chế truy xuất tài liệu phân cấp với giao diện Streamlit thân thiện.",
        "Fine-tune Vistral-7B cho Travel Chatbot": "Fine-tune Vistral-7B cho Travel Chatbot",
        "Tải mô hình Viet-Mistral-7B-Chat với độ chính xác 4-bit và áp dụng công nghệ LoRA để tinh chỉnh trên tập dữ liệu du lịch Việt Nam được tạo bởi Gemini-1.5-pro.": "Tải mô hình Viet-Mistral-7B-Chat với độ chính xác 4-bit và áp dụng công nghệ LoRA để tinh chỉnh trên tập dữ liệu du lịch Việt Nam được tạo bởi Gemini-1.5-pro.",
        
        // Experiments Section
        "Model Fine-tuning Experiments": "Thí nghiệm Fine-tuning Mô hình",
        "Thực nghiệm với các kỹ thuật fine-tuning khác nhau để tối ưu hóa hiệu suất mô hình AI cho các tác vụ cụ thể.": "Thực nghiệm với các kỹ thuật fine-tuning khác nhau để tối ưu hóa hiệu suất mô hình AI cho các tác vụ cụ thể.",
        "RAG Architecture Testing": "Kiểm thử Kiến trúc RAG",
        "Kiểm tra và so sánh các kiến trúc RAG khác nhau để cải thiện độ chính xác trong việc truy xuất và tạo sinh thông tin.": "Kiểm tra và so sánh các kiến trúc RAG khác nhau để cải thiện độ chính xác trong việc truy xuất và tạo sinh thông tin.",
        
        // Architecture Section
        "Kiến trúc hệ thống": "Kiến trúc hệ thống",
        "Người dùng": "Người dùng",
        "Giao diện": "Giao diện",
        "API Backend": "API Backend",
        "AI Model": "Mô hình AI",
        "Cơ sở dữ liệu": "Cơ sở dữ liệu",
        "Kiến trúc hệ thống điển hình cho các ứng dụng AI, bao gồm giao diện người dùng, API backend, mô hình AI và cơ sở dữ liệu vector để lưu trữ và truy xuất thông tin hiệu quả.": "Kiến trúc hệ thống điển hình cho các ứng dụng AI, bao gồm giao diện người dùng, API backend, mô hình AI và cơ sở dữ liệu vector để lưu trữ và truy xuất thông tin hiệu quả.",
        
        // Contact Section
        "Điện thoại": "Điện thoại",
        "Gửi tin nhắn": "Gửi tin nhắn",
        
        // Footer
        "© 2024 Trần Phước Sang. Tất cả quyền được bảo lưu.": "© 2024 Trần Phước Sang. Tất cả quyền được bảo lưu."
    },
    
    en: {
        // Navigation
        "Trần Phước Sang": "Tran Phuoc Sang",
        "Giới thiệu": "About",
        "Công bố": "Publications",
        "Dự án": "Projects",
        "Thí nghiệm": "Experiments",
        "Kiến trúc": "Architecture",
        "Liên hệ": "Contact",
        
        // Hero Section
        "Xin chào, tôi là": "Hello, I'm",
        "AI Engineer | Sinh viên Khoa học Máy tính": "AI Engineer | Computer Science Student",
        "Đam mê phát triển các giải pháp AI sáng tạo với chuyên môn về Machine Learning, Deep Learning và Natural Language Processing.": "Passionate about developing innovative AI solutions with expertise in Machine Learning, Deep Learning, and Natural Language Processing.",
        "Liên hệ": "Contact Me",
        "Xem dự án": "View Projects",
        
        // About Section
        "Giới thiệu": "About Me",
        "Là sinh viên năm 4 chuyên ngành Khoa học Máy tính, tôi đang tìm kiếm cơ hội thực tập AI Engineer để áp dụng và mở rộng kiến thức về machine learning, deep learning. Mục tiêu của tôi là hợp tác với các chuyên gia, nâng cao kỹ năng kỹ thuật và đóng vai trò tích cực trong việc phát triển các giải pháp AI có tác động, góp phần vào sự phát triển và thành công của tổ chức.": "As a fourth-year Computer Science student, I am seeking an AI Engineer internship to apply and expand my knowledge in machine learning and deep learning. My goal is to collaborate with experts, enhance my technical skills, and play an active role in developing impactful AI solutions that contribute to the growth and success of the organization.",
        "Học vấn": "Education",
        "Cử nhân Khoa học Máy tính<br>Đại học Tôn Đức Thắng<br>2021-2025 | GPA: 8.1": "Bachelor of Computer Science<br>Ton Duc Thang University<br>2021-2025 | GPA: 8.1",
        "Kỹ năng lập trình": "Programming Skills",
        "Cơ sở dữ liệu": "Databases",
        "Chứng chỉ": "Certificates",
        "Aptis B2, Agile & Scrum (2023), PyTorch-Image (2024)": "Aptis B2, Agile & Scrum (2023), PyTorch-Image (2024)",
        
        // Publications Section
        "Công bố khoa học": "Publications",
        "Đang cập nhật...": "Coming Soon...",
        "Các công bố khoa học sẽ được cập nhật trong thời gian tới.": "Scientific publications will be updated soon.",
        
        // Projects Section
        "Fine-tune Qwen2.5-3B cho Legal Chatbot": "Fine-tune Qwen2.5-3B for Legal Chatbot",
        "Tinh chỉnh mô hình Qwen2.5-3B trên tập dữ liệu văn bản pháp lý và tập QA để tạo chatbot tư vấn pháp lý. Sử dụng thư viện unsloth kết hợp với kỹ thuật LoRA.": "Fine-tuned Qwen2.5-3B model on legal text corpus and QA dataset for legal chatbot. Used unsloth library combined with LoRA technique.",
        "Legal Chatbot với Advanced RAG": "Legal Chatbot with Advanced RAG",
        "Phát triển hệ thống chatbot pháp lý nâng cao cho luật Việt Nam sử dụng kỹ thuật RAG. Triển khai cơ chế truy xuất tài liệu phân cấp với giao diện Streamlit thân thiện.": "Developed advanced legal chatbot system for Vietnamese law using RAG techniques. Implemented hierarchical document retrieval with user-friendly Streamlit interface.",
        "Fine-tune Vistral-7B cho Travel Chatbot": "Fine-tune Vistral-7B For Travel Chatbot",
        "Tải mô hình Viet-Mistral-7B-Chat với độ chính xác 4-bit và áp dụng công nghệ LoRA để tinh chỉnh trên tập dữ liệu du lịch Việt Nam được tạo bởi Gemini-1.5-pro.": "Loaded Viet-Mistral-7B-Chat model in 4-bit precision and applied LoRA technology to fine-tune on Vietnamese travel QA dataset generated by Gemini-1.5-pro.",
        
        // Experiments Section
        "Model Fine-tuning Experiments": "Model Fine-tuning Experiments",
        "Thực nghiệm với các kỹ thuật fine-tuning khác nhau để tối ưu hóa hiệu suất mô hình AI cho các tác vụ cụ thể.": "Experimenting with different fine-tuning techniques to optimize AI model performance for specific tasks.",
        "RAG Architecture Testing": "RAG Architecture Testing",
        "Kiểm tra và so sánh các kiến trúc RAG khác nhau để cải thiện độ chính xác trong việc truy xuất và tạo sinh thông tin.": "Testing and comparing different RAG architectures to improve accuracy in information retrieval and generation.",
        
        // Architecture Section
        "Kiến trúc hệ thống": "System Architecture",
        "Người dùng": "User",
        "Giao diện": "Frontend",
        "API Backend": "API Backend",
        "AI Model": "AI Model",
        "Cơ sở dữ liệu": "Database",
        "Kiến trúc hệ thống điển hình cho các ứng dụng AI, bao gồm giao diện người dùng, API backend, mô hình AI và cơ sở dữ liệu vector để lưu trữ và truy xuất thông tin hiệu quả.": "Typical system architecture for AI applications, including user interface, backend API, AI models, and vector database for efficient information storage and retrieval.",
        
        // Contact Section
        "Điện thoại": "Phone",
        "Gửi tin nhắn": "Send Message",
        
        // Footer
        "© 2024 Trần Phước Sang. Tất cả quyền được bảo lưu.": "© 2024 Tran Phuoc Sang. All rights reserved."
    }
};

// Typewriter class (for hero section)
class Typewriter {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            loop: false,
            delay: 75,
            ...options,
        };
        this.queue = [];
        this.isTyping = false;
        this.isPaused = false;
    }

    typeString(string) {
        this.addToQueue((resolve) => {
            let i = 0;
            const interval = setInterval(() => {
                this.element.textContent += string[i];
                i++;
                if (i >= string.length) {
                    clearInterval(interval);
                    resolve();
                }
            }, this.options.delay);
        });
        return this;
    }

    deleteChars(count) {
        this.addToQueue((resolve) => {
            let i = 0;
            const interval = setInterval(() => {
                this.element.textContent = this.element.textContent.slice(0, -1);
                i++;
                if (i >= count) {
                    clearInterval(interval);
                    resolve();
                }
            }, this.options.delay / 2);
        });
        return this;
    }

    deleteAll() {
        this.addToQueue((resolve) => {
            const interval = setInterval(() => {
                this.element.textContent = this.element.textContent.slice(0, -1);
                if (this.element.textContent.length === 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, this.options.delay / 2);
        });
        return this;
    }

    pauseFor(ms) {
        this.addToQueue((resolve) => {
            setTimeout(resolve, ms);
        });
        return this;
    }

    async start() {
        this.isTyping = true;
        while (this.isTyping) {
            for (const func of this.queue) {
                await func();
            }
            if (!this.options.loop) {
                this.isTyping = false;
            }
        }
    }

    addToQueue(callback) {
        this.queue.push(() => new Promise(callback));
    }
}

// Particle background animation
class ParticleBackground {
    constructor(container) {
        this.container = container;
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.animate();
        this.bindEvents();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        this.container.style.position = 'relative';
        this.container.appendChild(this.canvas);
        this.resize();
    }
    
    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            this.ctx.fill();
        });
        
        requestAnimationFrame(() => this.animate());
    }
    
    resize() {
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
    }
    
    bindEvents() {
        window.addEventListener('resize', () => this.resize());
    }
}

// Form handling
class FormHandler {
    constructor() {
        this.init();
    }
    
    init() {
        const form = document.querySelector('.contact-form form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit(form);
            });
        }
    }
    
    handleSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Show success message
        this.showMessage('Cảm ơn bạn đã liên hệ! Tôi sẽ phản hồi sớm nhất có thể.', 'success');
        
        // Reset form
        form.reset();
        
        // In a real application, you would send the data to your server
        console.log('Form submitted:', data);
    }
    
    showMessage(message, type = 'info') {
        // Remove existing messages
        const existingMessage = document.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: ${type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 10000;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            animation: fadeInUp 0.3s ease-out;
        `;
        
        document.body.appendChild(messageDiv);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => messageDiv.remove(), 300);
        }, 3000);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {

    // --- LOADING SCREEN ---
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        // Run a very quick, almost instant sequence
        const progressFill = document.querySelector('.progress-fill');
        const loadingTextContainer = document.getElementById('loading-text');

        progressFill.style.width = '100%';
        const p = document.createElement('p');
        p.textContent = 'Welcome.';
        p.classList.add('loading-line', 'visible');
        loadingTextContainer.appendChild(p);

        // Hide the screen quickly
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
        }, 250); // Reduced to a quarter of a second
    }

    // --- TYPEWRITER EFFECT ---
    const typewriterElement = document.getElementById('heroTypewriter');
    if (typewriterElement) {
        const typewriter = new Typewriter(typewriterElement, {
            loop: true,
            delay: 75,
        });

        typewriter
            .typeString('AI R&D')
            .pauseFor(2500)
            .deleteAll()
            .typeString('AI ENGINEER')
            .pauseFor(2500)
            .deleteAll()
            .typeString('AI ASSISTANT RESEARCH')
            .pauseFor(2500)
            .deleteAll()
            .start();
    }
    
    // --- NAVIGATION ---
    class Navigation {
        constructor() {
            this.hamburger = document.querySelector('.hamburger');
            this.navMenu = document.querySelector('.nav-menu');
            this.navLinks = document.querySelectorAll('.nav-menu a');
            this.init();
        }

        init() {
            this.hamburger.addEventListener('click', () => this.toggleMenu());
            this.navLinks.forEach(link => {
                link.addEventListener('click', () => this.closeMenu());
            });
            window.addEventListener('scroll', () => this.updateActiveLink());
        }

        toggleMenu() {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        }

        closeMenu() {
            this.hamburger.classList.remove('active');
            this.navMenu.classList.remove('active');
        }

        updateActiveLink() {
            let current = '';
            const sections = document.querySelectorAll('section[id]');
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                if (pageYOffset >= sectionTop - 75) {
                    current = section.getAttribute('id');
                }
            });

            this.navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').includes(current)) {
                    link.classList.add('active');
                }
            });
        }
    }

    // --- SCROLL ANIMATIONS ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section[id], .skill-category, .project-card, .achievement-card, .experience-card, .publication-card').forEach(el => {
        observer.observe(el);
    });
    
    // Initialize Navigation
    new Navigation();
    
    // Initialize hero section enhancements
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        new ParticleBackground(heroSection);
    }
    
    // Initialize typing animation for subtitle
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && languageManager.currentLang === 'en') {
        const texts = [
            'AI Engineer',
            'Computer Science Student',
            'Machine Learning Enthusiast',
            'Deep Learning Researcher'
        ];
        // new TypingAnimation(heroSubtitle, texts);
    }
    
    // Add smooth reveal animations to sections
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.animationDelay = `${index * 0.1}s`;
    });
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

