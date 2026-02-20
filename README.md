# Halal Finance Tracker

A simple, local-first personal finance tracker focused on halal-friendly budgeting and expense tracking. This repository contains a minimal client-side web app (HTML/CSS/JS) for tracking income, expenses, and viewing simple summaries.

Features
- Track income and expenses
- Categorize transactions (e.g., Groceries, Bills, Zakat)
- Monthly summary and running balance
- Client-side storage (no server required)

Quick start
- Open `index.html` in your browser.
- To run a local server (recommended):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Usage
- Add transactions using the app UI in `index.html`.
- Use categories to filter and summarize spending.
- Export or screenshot the data if you need backups — the app is local-first and does not sync.

Project structure
- `index.html` — app shell and UI
- `css/` — styles
- `js/` — application logic (see `js/app.js`)
- `assets/` — images and icons

Development
- Edit files in `js/` and `css/`, then reload the page.
- Use a live-reload tool or the simple Python server above for faster feedback.

Data format
- Transactions are stored in browser storage (LocalStorage). If you want CSV export, I can add an export button.

Contributing
- Open issues or PRs to suggest features or fixes.
- If you send a PR, include a short description and screenshots where sensible.

License
- MIT (add a `LICENSE` file if you want the license text included).

Contact
- Repo: https://github.com/Zawminsoe27/Halal-Finance-Tracker

Next steps I can help with
- Add sample data and a demo mode
- Add CSV export / import
- Add screenshots or a GIF for the README

If you want any of the above, tell me which and I'll implement it.
