# Local LLMs Experiment

This directory contains A small web app built incrementally by a Local LLM, one prompt at a time. Each prompt extends the same app.

## 📂 Prompt 1: Password Strength Checker

**Goal:** Create a basic password strength checker with core validation features.

**Features:**
- Live strength detection as you type.
- Visual feedback via an animated progress bar.
- Validation hints for:
    - Length (min 8 characters)
    - Uppercase letters
    - Lowercase letters
    - Numbers
    - Special characters
- Password visibility toggle.
- Responsive card layout.

## 🔐 Prompt 2: Password Generator Extension

**Goal:** Extend the checker by adding generation and advanced character control.

**Features:**
- **Generation**: Dedicated "Generate Password" button using random character selection.
- **Advanced Controls**:
    - **Length Slider**: Sets the desired password length (Min 6 to Max 32).
    - **Character Checkboxes**: Select specific character types (Uppercase, Lowercase, Numbers, Symbols).
    - **Custom Character Sets**: Ability to define and include custom characters (e.g., emojis, accent marks) to increase complexity.
- **UX Enhancements**:
    - **Copy-to-clipboard**: Button with toast notification confirmation.
    - **Automatic Refresh**: Generated passwords immediately update the strength checker.
    - **Responsive Design**: Maintains a clean, mobile-friendly layout.

## 💡 Objectives
- Compare code quality across different models.
- Evaluate ability to follow specific architectural constraints (no frameworks).
- Test UI/UX design capabilities.
- Implement complex interactive features (generation, copy, custom inputs).