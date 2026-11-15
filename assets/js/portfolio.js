// Progressive enhancements for the home page. All content is readable without JS.
(function () {
    'use strict';

    var root = document.documentElement;

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
