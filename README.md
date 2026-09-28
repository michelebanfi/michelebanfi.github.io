# Michele Banfi — Academic Portfolio

A modern, clean, minimalist academic portfolio and research website for **Michele Banfi**, PhD researcher in Quantum Error Correction at Politecnico di Milano.

## 🚀 Live Deployment on GitHub Pages

This repository is built as a zero-dependency, ultra-light static website ready for GitHub Pages:

1. Push this repository to your GitHub account: `https://github.com/michelebanfi/portfolio` (or `michelebanfi.github.io`).
2. Go to **Settings** > **Pages** on GitHub.
3. Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
4. Click **Save**. Your website will be live at `https://michelebanfi.github.io/` in seconds.

---

## 🎨 Features & Design

- **Light & Modern Academic Theme**: High-contrast, clean typography (`Inter` + `JetBrains Mono`) on crisp white/off-white background.
- **Interactive QEC Stabilizer Lattice**: Lightweight 60fps canvas simulation representing quantum stabilizer codes and parity checks that reacts softly to mouse movements.
- **Searchable Publications**: Real-time filtering by keyword, topic, author, or abstract, with instant keyboard shortcut (`/`).
- **One-Click BibTeX & Abstract**: Expandable abstract drawers and one-click BibTeX copy button with clipboard toast notification.
- **Academic SEO**: Pre-configured with Google Scholar meta tags (`citation_title`, `citation_author`, `citation_arxiv_id`, `citation_pdf_url`), Open Graph, and Twitter Cards.
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices.

---

## 📂 File Structure

```
├── index.html       # Semantic HTML5 layout with publications and research bio
├── style.css        # Clean CSS design system and responsive layout
├── app.js           # Interactive QEC canvas lattice, search, and drawer toggles
├── favicon.svg      # Quantum bracket |ψ⟩ vector favicon
└── README.md        # Documentation
```

---

## 📝 How to Update

- **Add a new publication**: Add a new `<article class="pub-item">` block inside `#pub-list` in `index.html`.
- **Change contact info**: Update the links in the `<section id="contact">` in `index.html`.
