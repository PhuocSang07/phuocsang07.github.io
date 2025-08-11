# Portfolio Website - Trần Phước Sang

## 🌟 Giới thiệu

Đây là trang web portfolio cá nhân của Trần Phước Sang, một sinh viên năm 4 chuyên ngành Khoa học Máy tính với đam mê về AI Engineering. Website được thiết kế hiện đại, responsive và hỗ trợ đa ngôn ngữ (Tiếng Việt/English).

## ✨ Tính năng

### 🎨 Giao diện và UX
- **Thiết kế hiện đại**: Sử dụng CSS Grid, Flexbox và CSS Variables
- **Responsive Design**: Tương thích hoàn hảo trên mọi thiết bị
- **Dark/Light Theme**: Chuyển đổi theme dễ dàng
- **Smooth Animations**: Hiệu ứng mượt mà và chuyên nghiệp
- **Particle Background**: Hiệu ứng hạt động cho hero section

### 🌐 Đa ngôn ngữ
- **Tiếng Việt / English**: Chuyển đổi ngôn ngữ tức thì
- **LocalStorage**: Lưu trữ ngôn ngữ đã chọn
- **Dynamic Content**: Nội dung thay đổi theo ngôn ngữ

### 📱 Navigation
- **Sticky Header**: Thanh điều hướng cố định với hiệu ứng blur
- **Mobile Menu**: Menu hamburger cho thiết bị di động
- **Smooth Scroll**: Cuộn mượt giữa các section
- **Active States**: Highlight section đang xem

### 🔧 Interactive Features
- **Scroll Animations**: Hiệu ứng xuất hiện khi cuộn
- **Hover Effects**: Tương tác với cards và buttons
- **Form Handling**: Xử lý form liên hệ với validation
- **Loading Animation**: Hiệu ứng tải trang

## 📋 Sections

### 1. **Hero Section**
- Giới thiệu bản thân với hiệu ứng gradient text
- Call-to-action buttons
- Avatar placeholder với hiệu ứng

### 2. **About Section** 
- Thông tin học vấn và kinh nghiệm
- Info cards với hover effects
- Skills và certifications

### 3. **Publications Section**
- Placeholder cho các công bố khoa học
- Sẵn sàng cho nội dung tương lai

### 4. **Projects Section**
- Showcase 3 dự án chính:
  - Fine-tune Qwen2.5-3B cho Legal Chatbot
  - Legal Chatbot với Advanced RAG  
  - Fine-tune Vistral-7B cho Travel Chatbot
- Tech stack badges
- Links đến GitHub/HuggingFace

### 5. **Experiments Section**
- Các thí nghiệm và nghiên cứu
- Model fine-tuning experiments
- RAG architecture testing

### 6. **Architecture Section**
- Sơ đồ kiến trúc hệ thống
- Mô tả flow công nghệ

### 7. **Contact Section**
- Thông tin liên hệ
- Form liên hệ interactive
- Social links

## 🚀 Cách sử dụng

### Chạy trực tiếp
1. Clone hoặc download repository
2. Mở file `index.html` trong trình duyệt
3. Enjoy! 🎉

### Local Development
```bash
# Sử dụng Live Server (VS Code extension)
# Hoặc Python HTTP Server
python -m http.server 8000

# Hoặc Node.js http-server
npx http-server
```

## 🛠️ Công nghệ sử dụng

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern CSS với CSS Grid, Flexbox, Variables
- **JavaScript ES6+**: Vanilla JS, OOP, Classes
- **Font Awesome**: Icons
- **Google Fonts**: Typography (Inter)

### Features
- **CSS Variables**: Quản lý theme và colors
- **LocalStorage**: Lưu trữ preferences
- **Intersection Observer**: Scroll animations
- **Canvas API**: Particle effects
- **CSS Transforms**: Smooth animations

## 📁 Cấu trúc file

```
portfolio/
├── index.html          # Main HTML file
├── styles.css          # All CSS styles
├── script.js           # JavaScript functionality
├── README.md           # Documentation
└── (assets/)           # Images, icons (if any)
```

## 🎨 Customization

### Thay đổi màu sắc
Chỉnh sửa CSS variables trong `styles.css`:
```css
:root {
    --primary-color: #6366f1;    /* Màu chủ đạo */
    --secondary-color: #f59e0b;  /* Màu phụ */
    --accent-color: #06b6d4;     /* Màu nhấn */
    /* ... */
}
```

### Thêm ngôn ngữ mới
Mở rộng object `translations` trong `script.js`:
```javascript
const translations = {
    vi: { /* ... */ },
    en: { /* ... */ },
    // Thêm ngôn ngữ mới
    fr: { /* French translations */ }
};
```

### Thêm section mới
1. Thêm HTML structure trong `index.html`
2. Thêm CSS styles trong `styles.css`
3. Cập nhật navigation menu
4. Thêm translations nếu cần

## 🔧 Tối ưu hóa

### Performance
- Minify CSS/JS cho production
- Optimize images
- Add lazy loading cho images
- Implement service worker cho caching

### SEO
- Add meta tags
- Structured data markup
- Sitemap.xml
- Open Graph tags

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

## 📞 Liên hệ

- **Email**: transhack09@gmail.com
- **Phone**: 0347763291
- **GitHub**: [github.com/PhuocSang07](https://github.com/PhuocSang07)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Được tạo với ❤️ bởi Trần Phước Sang**