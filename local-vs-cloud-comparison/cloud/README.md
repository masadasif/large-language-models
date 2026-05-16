# Cloud LLMs

A small web app built incrementally by a cloud-hosted LLM, one prompt at a time. Each prompt extends the same app — the files in this folder always reflect the latest state.

Files:
- [index.html](index.html)
- [styles.css](styles.css)
- [script.js](script.js)

Open `index.html` directly in a browser to try it. No frameworks, no external assets, no build step.

## Prompt history

### Prompt 1 — Password Strength Checker
Modern password strength checker built with HTML, CSS and vanilla JavaScript. Centered responsive card, live strength meter (Weak / Medium / Strong), animated progress bar, and real-time validation hints for length, uppercase, lowercase, number, and special-character rules.

### Prompt 2 — Password Generator Extension
Extended the checker with a generator section: length slider with live value, four character-type checkboxes (uppercase, lowercase, numbers, symbols), Generate and Copy buttons, and a toast notification on copy. Passwords regenerate automatically when options change and flow through the existing strength checker. Uses `crypto.getRandomValues` for randomness and guarantees at least one character from each selected pool. Controls collapse to a single column on narrow screens.
