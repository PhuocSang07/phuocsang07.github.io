// Progressive enhancements for the home page. All content is readable without JS.
(function () {
    'use strict';

    var root = document.documentElement;
    root.classList.add('js');

    // Mark the section currently in view in the top navigation.
    var nav = document.querySelector('.site-nav');
    var navLinks = {};
    // Scroll only the nav strip sideways. Element.scrollIntoView would also
    // cancel a smooth page scroll that is still in flight.
    function revealInNav(a) {
        var left = a.offsetLeft;
        var right = left + a.offsetWidth;
        if (left < nav.scrollLeft) nav.scrollLeft = left - 8;
        else if (right > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = right - nav.clientWidth + 8;
    }
    document.querySelectorAll('.site-nav a').forEach(function (a) {
        navLinks[a.getAttribute('href').slice(1)] = a;
    });
    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                Object.keys(navLinks).forEach(function (id) {
                    if (id === entry.target.id) {
                        navLinks[id].setAttribute('aria-current', 'true');
                        revealInNav(navLinks[id]);
                    } else {
                        navLinks[id].removeAttribute('aria-current');
                    }
                });
            });
            // A section is "current" while it crosses a thin band below the sticky bar.
        }, { rootMargin: '-25% 0px -70% 0px' });
        Object.keys(navLinks).forEach(function (id) {
            var target = document.getElementById(id);
            if (target) observer.observe(target);
        });
    }

    // Award photos open in a lightbox instead of leaving the page.
    var photoLinks = document.querySelectorAll('.award-images a');
    if (photoLinks.length && window.HTMLDialogElement) {
        var dialog = document.createElement('dialog');
        dialog.className = 'lightbox';
        var closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'lightbox-close';
        closeBtn.setAttribute('aria-label', 'Close image');
        closeBtn.textContent = '\u00d7';
        var big = document.createElement('img');
        dialog.appendChild(closeBtn);
        dialog.appendChild(big);
        document.body.appendChild(dialog);
        dialog.addEventListener('click', function () { dialog.close(); });
        photoLinks.forEach(function (a) {
            a.addEventListener('click', function (event) {
                event.preventDefault();
                big.src = a.getAttribute('href');
                big.alt = a.querySelector('img').alt;
                dialog.showModal();
            });
        });
    }

    // Theme toggle, persisted in localStorage['theme'] and applied as <html data-theme>.
    var toggle = document.querySelector('.theme-toggle');
    function syncToggle() {
        if (toggle) toggle.setAttribute('aria-pressed', String(root.getAttribute('data-theme') === 'dark'));
    }
    if (toggle) {
        toggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            try { localStorage.setItem('theme', next); } catch (e) { }
            syncToggle();
        });
        syncToggle();
    }

    // Role durations, computed from data-start / data-end ("YYYY-MM"), e.g. "1 yr 5 mos".
    function monthIndex(ym) {
        var parts = ym.split('-');
        return Number(parts[0]) * 12 + Number(parts[1]) - 1;
    }
    var now = new Date();
    var nowIndex = now.getFullYear() * 12 + now.getMonth();
    document.querySelectorAll('.duration[data-start]').forEach(function (el) {
        var end = el.dataset.end ? monthIndex(el.dataset.end) : nowIndex;
        var months = end - monthIndex(el.dataset.start) + 1; // inclusive, LinkedIn-style
        if (months < 1) return;
        var y = Math.floor(months / 12);
        var m = months % 12;
        var out = [];
        if (y) out.push(y + (y === 1 ? ' yr' : ' yrs'));
        if (m) out.push(m + (m === 1 ? ' mo' : ' mos'));
        el.textContent = out.join(' ');
    });

    // Copy button for BibTeX blocks.
    document.querySelectorAll('pre.bibtex').forEach(function (pre) {
        if (!navigator.clipboard) return;
        var wrap = document.createElement('div');
        wrap.className = 'bibtex-wrap';
        pre.parentNode.insertBefore(wrap, pre);
        wrap.appendChild(pre);

        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', function () {
            navigator.clipboard.writeText(pre.textContent).then(function () {
                btn.textContent = 'Copied';
                setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
            });
        });
        wrap.appendChild(btn);
    });
})();
