document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const progressBar = document.getElementById('progress-bar');
    const strengthText = document.getElementById('strength-text');
    const hintsContainer = document.getElementById('hints');

    const criteria = [
        { regex: /.{1}/, name: "Minimum length (1 character)", isMet: (pass) => true },
        { regex: /[a-z]/, name: "Lowercase letters", isMet: (pass) => !!/[a-z]/.test(pass) },
        { regex: /[A-Z]/, name: "Uppercase letters", isMet: (pass) => !!/[A-Z]/.test(pass) },
        { regex: /[0-9]/, name: "Numbers", isMet: (pass) => !!/[0-9]/.test(pass) },
        { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, name: "Special characters", isMet: (pass) => !!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass) }
    ];

    const strengthLevels = [
        { name: "Weak", width: 20, colorClass: "weak", required: 1, description: "Only a few characters provided." },
        { name: "Medium", width: 60, colorClass: "medium", required: 3, description: "Includes mixed case, numbers, and special characters." },
        { name: "Strong", width: 100, colorClass: "strong", required: 5, description: "A strong combination of character types." }
    ];

    /**
     * Calculates the password strength based on defined criteria.
     * @param {string} password The password string to check.
     * @returns {{score: number, level: object|null}} The calculated score and the corresponding strength level object.
     */
    const checkPasswordStrength = (password) => {
        if (!password) {
            return { score: 0, level: null };
        }

        let score = 0;
        let metCriteria = [];

        criteria.forEach(criterion => {
            if (criterion.isMet(password)) {
                score++;
                metCriteria.push(criterion.name);
            }
        });

        let level = null;
        // Find the highest strength level that is achieved
        for (let i = strengthLevels.length - 1; i >= 0; i--) {
            if (score >= strengthLevels[i].required) {
                level = strengthLevels[i];
                break;
            }
        }

        return { score: score, level: level, metCriteria: metCriteria };
    };

    /**
     * Updates the UI elements (Progress Bar, Text, Hints) based on the password strength.
     * @param {string} password The current password value.
     */
    const updateStrength = (password) => {
        const { score, level, metCriteria } = checkPasswordStrength(password);

        // 1. Update Progress Bar and Text
        if (!password) {
            progressBar.style.width = '0%';
            strengthText.textContent = 'Strength: Not entered';
            strengthText.className = 'strength-text none';
            progressBar.className = 'progress-bar';
        } else {
            if (level) {
                progressBar.style.width = `${level.width}%`;
                strengthText.textContent = `Strength: ${level.name}`;
                strengthText.className = `strength-text ${level.colorClass}`;
                progressBar.className = `progress-bar ${level.colorClass}`;
            } else {
                progressBar.style.width = '0%';
                strengthText.textContent = 'Strength: Weak';
                strengthText.className = 'strength-text weak';
                progressBar.className = 'progress-bar weak';
            }
        }

        // 2. Update Hints
        let hintHTML = '';
        let allHintsMet = true;

        criteria.forEach(criterion => {
            const met = criterion.isMet(password);
            const icon = met ? '✅' : '❌';
            const colorClass = met ? 'strong' : 'weak';

            hintHTML += `<p><span class="${colorClass}">${icon}</span>${criterion.name}</p>`;
            if (!met) {
                allHintsMet = false;
            }
        });

        hintsContainer.innerHTML = hintHTML;
    };

    // Event listener for live checking
    passwordInput.addEventListener('input', (e) => {
        updateStrength(e.target.value);
    });

    // Initialize on load
    updateStrength('');
});