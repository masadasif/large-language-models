# Local vs Cloud LLM Comparison

An experiment comparing how a locally-run LLM and a cloud-hosted LLM handle the same series of prompts. Each side builds the same app, starting from the same blank slate and receiving the same prompts in the same order. The outputs live in:

- [`cloud/`](cloud/) — built by the cloud LLM
- [`local/`](local/) — built by the local LLM

## Constraints

- No frameworks or libraries
- No internet at runtime — everything must work from `file://`
- Each prompt either extends or transforms the previous state; the files in each folder always reflect the latest state

## Prompts

### Prompt 1 — Password Strength Checker

Create a modern password strength checker using HTML, CSS and vanilla JavaScript.

**Requirements:**

- A centered responsive card layout
- Password input field
- Live strength detection while typing
- Strength levels:
  - Weak
  - Medium
  - Strong
- A progress bar that animates smoothly
- Evaluate password strength based on:
  - length
  - uppercase letters
  - lowercase letters
  - numbers
  - special characters
- Show small validation hints below the input
- Add subtle UI animations and hover effects
- Use separate files:
  - `index.html`
  - `styles.css`
  - `script.js`
- Do not use any frameworks or libraries.

---

### Prompt 2 — Password Generator Extension

Extend the existing password strength checker without rewriting the project.

**Add the following features:**

- "Generate Password" button
- Password length slider
- Checkboxes for:
  - uppercase letters
  - lowercase letters
  - numbers
  - symbols
- Copy-to-clipboard button
- Toast notification after copying
- Regenerate password automatically when options change
- Generated passwords should also pass through the strength checker

**UI requirements:**

- Keep the existing design consistent
- Add smooth transitions
- Make the controls mobile responsive

**Technical requirements:**

- Refactor duplicated logic if necessary
- Keep the code modular and readable

---

### Prompt 3 — Typing Speed Test Transformation

Transform the project into a typing speed test application while reusing as much existing structure and styling as possible.

**Requirements:**

- Display a random sentence for the user to type
- Highlight:
  - correct characters
  - incorrect characters
  - current cursor position
- Add a 60 second countdown timer
- Calculate:
  - WPM (words per minute)
  - accuracy percentage
  - total mistakes
- Add a "Restart Test" button
- Prevent copy/paste cheating
- Add smooth animations for state changes

**UI requirements:**

- Modern responsive layout
- Real-time updates without lag
- Dark/light mode toggle with saved preference

**Technical requirements:**

- Use only vanilla JavaScript
- Organize logic cleanly
- Avoid global variables where possible
