/**
 * Michele Banfi — Academic Portfolio
 * Interactive QEC Stabilizer Lattice & Desktop Margin Art Visualisations
 */

(function () {
  'use strict';

  // -------------------------------------------------------------------------
  // 1. Interactive Quantum Error Correction (QEC) Stabilizer Lattice Canvas
  // -------------------------------------------------------------------------
  const bgCanvas = document.getElementById('qec-canvas');
  let bgCtx, bgWidth, bgHeight;
  let dpr = window.devicePixelRatio || 1;
  let bgAnimationFrameId = null;
  let bgIsRunning = true;

  let nodes = [];
  let links = [];
  let mouse = { x: -1000, y: -1000, active: false };

  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initLattice() {
    if (!bgCanvas) return;
    bgCtx = bgCanvas.getContext('2d');
    bgWidth = window.innerWidth;
    bgHeight = window.innerHeight;
    bgCanvas.width = bgWidth * dpr;
    bgCanvas.height = bgHeight * dpr;
    bgCtx.scale(dpr, dpr);

    nodes = [];
    links = [];

    // Subtle lattice spacing
    const spacing = Math.max(75, Math.min(105, Math.floor(bgWidth / 14)));
    const cols = Math.ceil(bgWidth / spacing) + 2;
    const rows = Math.ceil(bgHeight / spacing) + 2;
    const offsetX = (bgWidth - (cols - 1) * spacing) / 2;
    const offsetY = (bgHeight - (rows - 1) * spacing) / 2;

    const grid = [];

    for (let r = 0; r < rows; r++) {
      grid[r] = [];
      for (let c = 0; c < cols; c++) {
        const baseX = offsetX + c * spacing;
        const baseY = offsetY + r * spacing;

        const isDataQubit = (r + c) % 2 === 0;
        const isXCheck = !isDataQubit && r % 2 === 0;
        const type = isDataQubit ? 'data' : (isXCheck ? 'x-check' : 'z-check');

        const node = {
          x: baseX,
          y: baseY,
          baseX: baseX,
          baseY: baseY,
          vx: 0,
          vy: 0,
          type: type,
          radius: isDataQubit ? 2.2 : 1.8,
          pulse: 0,
          r: r,
          c: c
        };

        nodes.push(node);
        grid[r][c] = node;
      }
    }

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const curr = grid[r][c];
        if (c + 1 < cols) {
          links.push({ source: curr, target: grid[r][c + 1] });
        }
        if (r + 1 < rows) {
          links.push({ source: curr, target: grid[r + 1][c] });
        }
      }
    }
  }

  function animateLattice(timestamp) {
    if (!bgIsRunning || !bgCtx) return;

    bgCtx.clearRect(0, 0, bgWidth, bgHeight);

    const springK = 0.045;
    const damping = 0.88;
    const interactionRadius = 130;

    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];

      if (mouse.active) {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < interactionRadius && dist > 0) {
          const force = (1 - dist / interactionRadius) * 18;
          node.vx -= (dx / dist) * force * 0.12;
          node.vy -= (dy / dist) * force * 0.12;
          node.pulse = Math.min(1, node.pulse + 0.08);
        }
      }

      const fx = (node.baseX - node.x) * springK;
      const fy = (node.baseY - node.y) * springK;

      node.vx = (node.vx + fx) * damping;
      node.vy = (node.vy + fy) * damping;

      node.x += node.vx;
      node.y += node.vy;

      node.pulse *= 0.94;
    }

    // Draw clean subtle lattice links
    bgCtx.lineWidth = 1.0;
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      const p1 = link.source;
      const p2 = link.target;
      const avgPulse = (p1.pulse + p2.pulse) * 0.5;

      if (avgPulse > 0.05) {
        bgCtx.strokeStyle = `rgba(37, 99, 235, ${0.08 + avgPulse * 0.22})`; // Subtle blue pulse
      } else {
        bgCtx.strokeStyle = 'rgba(15, 23, 42, 0.038)'; // Clean subtle neutral line
      }

      bgCtx.beginPath();
      bgCtx.moveTo(p1.x, p1.y);
      bgCtx.lineTo(p2.x, p2.y);
      bgCtx.stroke();
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const hasPulse = node.pulse > 0.05;

      bgCtx.beginPath();
      bgCtx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

      if (node.type === 'data') {
        bgCtx.fillStyle = hasPulse
          ? `rgba(37, 99, 235, ${0.35 + node.pulse * 0.35})`
          : 'rgba(71, 85, 105, 0.24)';
        bgCtx.fill();
      } else {
        bgCtx.fillStyle = '#ffffff';
        bgCtx.fill();
        bgCtx.strokeStyle = hasPulse
          ? `rgba(37, 99, 235, ${0.4 + node.pulse * 0.3})`
          : 'rgba(148, 163, 184, 0.25)';
        bgCtx.lineWidth = 1.0;
        bgCtx.stroke();
      }
    }

    bgAnimationFrameId = requestAnimationFrame(animateLattice);
  }

  if (bgCanvas) {
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.active = false;
    });

    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(initLattice, 150);
    });

    initLattice();
    if (!prefersReducedMotion) {
      bgAnimationFrameId = requestAnimationFrame(animateLattice);
    } else {
      animateLattice(0);
      bgIsRunning = false;
    }

    const toggleAnimBtn = document.getElementById('toggle-anim-btn');
    if (toggleAnimBtn) {
      toggleAnimBtn.addEventListener('click', () => {
        bgIsRunning = !bgIsRunning;
        if (bgIsRunning) {
          bgAnimationFrameId = requestAnimationFrame(animateLattice);
        } else {
          cancelAnimationFrame(bgAnimationFrameId);
        }
        showToast(bgIsRunning ? 'Background animation resumed' : 'Background animation paused');
      });
    }
  }

  // -------------------------------------------------------------------------
  // 2. Publication Search & Category Filtering
  // -------------------------------------------------------------------------
  const searchInput = document.getElementById('pub-search');
  const searchClear = document.getElementById('search-clear');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const pubItems = document.querySelectorAll('.pub-item');
  const pubCountEl = document.getElementById('pub-count');
  const noResultsEl = document.getElementById('no-results');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterPublications() {
    let visibleCount = 0;
    const query = searchQuery.toLowerCase().trim();

    pubItems.forEach((item) => {
      const title = item.querySelector('.pub-title')?.textContent.toLowerCase() || '';
      const authors = item.querySelector('.pub-authors')?.textContent.toLowerCase() || '';
      const tags = item.getAttribute('data-tags')?.toLowerCase() || '';
      const category = item.getAttribute('data-category') || '';
      const abstract = item.querySelector('.abstract-content')?.textContent.toLowerCase() || '';

      const matchesSearch =
        !query ||
        title.includes(query) ||
        authors.includes(query) ||
        tags.includes(query) ||
        abstract.includes(query);

      const matchesCategory =
        currentCategory === 'all' || category === currentCategory || tags.includes(currentCategory);

      if (matchesSearch && matchesCategory) {
        item.classList.remove('hidden');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (pubCountEl) {
      pubCountEl.textContent = `${visibleCount} work${visibleCount === 1 ? '' : 's'}`;
    }

    if (noResultsEl) {
      noResultsEl.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (searchClear) {
      searchClear.style.display = query.length > 0 ? 'flex' : 'none';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterPublications();
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== searchInput && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
      }
      if (e.key === 'Escape' && document.activeElement === searchInput) {
        searchInput.value = '';
        searchQuery = '';
        searchInput.blur();
        filterPublications();
      }
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchQuery = '';
      searchInput.focus();
      filterPublications();
    });
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';
      filterPublications();
    });
  });

  // -------------------------------------------------------------------------
  // 4. Expandable Drawers (Abstract & BibTeX) & Email Copier
  // -------------------------------------------------------------------------
  document.addEventListener('click', (e) => {
    const abstractBtn = e.target.closest('.btn-toggle-abstract');
    if (abstractBtn) {
      const pubItem = abstractBtn.closest('.pub-item');
      const drawer = pubItem.querySelector('.abstract-drawer');
      const isExpanded = drawer.classList.contains('open');

      drawer.classList.toggle('open');
      abstractBtn.setAttribute('aria-expanded', !isExpanded);
      abstractBtn.classList.toggle('active', !isExpanded);
      return;
    }

    const bibtexBtn = e.target.closest('.btn-toggle-bibtex');
    if (bibtexBtn) {
      const pubItem = bibtexBtn.closest('.pub-item');
      const drawer = pubItem.querySelector('.bibtex-drawer');
      const isExpanded = drawer.classList.contains('open');

      drawer.classList.toggle('open');
      bibtexBtn.setAttribute('aria-expanded', !isExpanded);
      bibtexBtn.classList.toggle('active', !isExpanded);
      return;
    }

    const copyBibBtn = e.target.closest('.bibtex-copy-btn');
    if (copyBibBtn) {
      const bibContent = copyBibBtn.closest('.bibtex-wrapper').querySelector('.bibtex-content').textContent;
      copyToClipboard(bibContent, 'BibTeX entry copied to clipboard');
      const originalText = copyBibBtn.innerHTML;
      copyBibBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg> Copied!`;
      setTimeout(() => {
        copyBibBtn.innerHTML = originalText;
      }, 2000);
      return;
    }

    const copyEmailBtn = e.target.closest('.btn-copy-email');
    if (copyEmailBtn) {
      const email = copyEmailBtn.getAttribute('data-email');
      if (email) {
        copyToClipboard(email, 'Email address copied to clipboard');
      }
      return;
    }

    const pipCopyBtn = e.target.closest('.pip-copy');
    if (pipCopyBtn) {
      const cmd = pipCopyBtn.closest('.pip-box').querySelector('.pip-cmd').textContent.trim();
      copyToClipboard(cmd, 'pip command copied to clipboard');
      const originalHtml = pipCopyBtn.innerHTML;
      pipCopyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg> Copied!`;
      setTimeout(() => {
        pipCopyBtn.innerHTML = originalHtml;
      }, 2000);
      return;
    }
  });

  // -------------------------------------------------------------------------
  // 5. Clipboard & Toast Notifications
  // -------------------------------------------------------------------------
  const toast = document.getElementById('toast');
  let toastTimeout;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function copyToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || 'Copied to clipboard');
      }).catch(() => {
        fallbackCopy(text, successMsg);
      });
    } else {
      fallbackCopy(text, successMsg);
    }
  }

  function fallbackCopy(text, successMsg) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(successMsg || 'Copied to clipboard');
    } catch (err) {
      showToast('Failed to copy');
    }
    document.body.removeChild(textArea);
  }

  // -------------------------------------------------------------------------
  // 6. Back to Top Button
  // -------------------------------------------------------------------------
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        backToTopBtn.style.display = 'flex';
      } else {
        backToTopBtn.style.display = 'none';
      }
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // -------------------------------------------------------------------------
  // 7. Dynamic Year
  // -------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

})();
