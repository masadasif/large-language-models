document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordInput = document.getElementById('password');
    const lengthSlider = document.getElementById('length-slider');
    const lengthValueSpan = document.getElementById('length-value');
    const upperCheck = document.getElementById('upper-check');
    const lowerCheck = document.getElementById('lower-check');
    const numberCheck = document.getElementById('number-check');
    const symbolCheck = document.getElementById('symbol-check');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const progressBar = document.getElementById('progress-bar');
    const strengthText = document.getElementById('strength-text');
    const hintsContainer = document.getElementById('hints');
    const toastNotification = document.getElementById('toast-notification');

    // --- UTILITY FUNCTIONS ---

    /**
     * Displays a temporary toast notification message.
     * @param {string} message The message to display.
     */
    const showToast = (message) => {
        toastNotification.textContent = message;
        toastNotification.style.opacity = '1';
        toastNotification.style.transform = 'translateX(-50%) translateY(0)';

        setTimeout(() => {
            toastNotification.style.opacity = '0';
            toastNotification.style.transform = 'translateX(-50%) translateY(20px)';
        }, 1500);
    };

    /**
     * Checks if the provided password meets specified criteria.
     * @param {string} password The password string.
     * @returns {boolean} True if the criteria are met.
     */
    const checkCriterion = (password, regex) => regex.test(password);

    /**
     * Calculates the password strength based on defined criteria.
     * @param {string} password The password string to check.
     * @param {object} criteriaFilters The filters set by checkboxes.
     * @returns {{score: number, level: object|null, metCriteria: string[]}} The calculated score, level, and list of met criteria names.
     */
    const calculateStrength = (password, criteriaFilters) => {
        if (!password) {
            return { score: 0, level: null, metCriteria: [] };
        }

        let score = 0;
        let metCriteria = [];

        const criteriaDefinitions = [
            { regex: /.{1}/, name: "Minimum length", required: true, regexString: /.{1}/ },
            { regex: /[a-z]/, name: "Lowercase letters", required: false, regexString: /[a-z]/ },
            { regex: /[A-Z]/, name: "Uppercase letters", required: false, regexString: /[A-Z]/ },
            { regex: /[0-9]/, name: "Numbers", required: false, regexString: /[0-9]/ },
            { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, name: "Symbols", required: false, regexString: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ }
        ];

        // Check for required criteria AND criteria filters
        criteriaDefinitions.forEach(criterion => {
            let shouldCheck = true;
            if (criterion.name !== "Minimum length") {
                // If the checkbox for this criterion is unchecked, skip the check
                const checkboxId = criterion.name.toLowerCase().replace(/ /g, '-').split('(')[0];
                if (checkboxId === 'upper-check' && !upperCheck.checked) {
                    shouldCheck = false;
                } else if (checkboxId === 'lower-check' && !lowerCheck.checked) {
                    shouldCheck = false;
                } else if (checkboxId === 'number-check' && !numberCheck.checked) {
                    shouldCheck = false;
                } else if (checkboxId === 'symbol-check' && !symbolCheck.checked) {
                    shouldCheck = false;
                }
            }

            if (shouldCheck && checkCriterion(password, criterion.regexString)) {
                score++;
                metCriteria.push(criterion.name);
            }
        });

        // Define strength levels based on score required
        const strengthLevels = [
            { name: "Weak", width: 20, colorClass: "weak", required: 1 },
            { name: "Medium", width: 60, colorClass: "medium", required: 3 },
            { name: "Strong", width: 100, colorClass: "strong", required: 5 }
        ];

        let level = null;
        for (let i = strengthLevels.length - 1; i >= 0; i--) {
            if (score >= strengthLevels[i].required) {
                level = strengthLevels[i];
                break;
            }
        }

        return { score, level, metCriteria };
    };

    /**
     * Updates the UI elements (Progress Bar, Text, Hints) based on the password strength.
     * @param {string} password The password string.
     */
    const updateStrengthUI = (password) => {
        const { score, level, metCriteria } = calculateStrength(password, {});

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

        const criterionDefinitions = [
            { regex: /.{1}/, name: "Minimum length", regexString: /.{1}/ },
            { regex: /[a-z]/, name: "Lowercase letters", regexString: /[a-z]/ },
            { regex: /[A-Z]/, name: "Uppercase letters", regexString: /[A-Z]/ },
            { regex: /[0-9]/, name: "Numbers", regexString: /[0-9]/ },
            { regex: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, regexString: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/ }
        ];

        criterionDefinitions.forEach(criterion => {
            const regexToTest = criterion.regexString;
            const met = checkCriterion(password, regexToTest);
            const icon = met ? '✅' : '❌';
            const colorClass = met ? 'strong' : 'weak';

            hintHTML += `<p><span class="${colorClass}">${icon}</span>${criterion.name}</p>`;
            if (!met) {
                allHintsMet = false;
            }
        });

        hintsContainer.innerHTML = hintHTML;
    };

    /**
     * Generates a random password based on selected options.
     * @param {number} length The desired length of the password.
     * @returns {string} The generated password.
     */
    const generatePassword = (length) => {
        let charSet = '';
        let mandatoryChars = '';

        // Build character set based on selected checkboxes
        if (upperCheck.checked) {
            charSet += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            mandatoryChars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        }
        if (lowerCheck.checked) {
            charSet += 'abcdefghijklmnopqrstuvwxyz';
            mandatoryChars += 'abcdefghijklmnopqrstuvwxyz';
        }
        if (numberCheck.checked) {
            charSet += '0123456789';
            mandatoryChars += '0123456789';
        }
        if (symbolCheck.checked) {
            charSet += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?';
            mandatoryChars += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?';
        }

        // Fallback if no options are selected (shouldn't happen with defaults)
        if (!charSet) return '';

        // Ensure at least one of each selected type is in the password (if possible)
        let guaranteedChars = '';
        if (upperCheck.checked) guaranteedChars += 'A';
        if (lowerCheck.checked) guaranteedChars += 'a';
        if (numberCheck.checked) guaranteedChars += '1';
        if (symbolCheck.checked) guaranteedChars += '!';

        let password = guaranteedChars;
        let availableChars = charSet.length;

        // Generate remaining characters
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * availableChars);
            password += charSet.charAt(randomIndex);
        }

        // Shuffle to ensure guaranteed chars aren't always at the start
        let result = password.split('');
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }

        return result.join('');
    };

    /**
     * Main handler: Generates, updates the password, and checks strength.
     * @param {boolean} isGeneration If true, the password comes from generation.
     */
    const updatePasswordAndCheckStrength = (isGeneration = false) => {
        const length = parseInt(lengthSlider.value);

        // 1. Generate Password if required
        let password = '';
        if (isGeneration) {
            password = generatePassword(length);
            passwordInput.value = password;
        } else {
            // Use value from input if not generating
            password = passwordInput.value;
        }

        // 2. Update UI
        updateStrengthUI(password);

        // Enable copy button only if a password exists
        copyBtn.disabled = password.length === 0;
        copyBtn.classList.toggle('disabled', copyBtn.disabled);
    };

    /**
     * Handles the click event for the Generate Password button.
     */
    const handleGenerate = () => {
        updatePasswordAndCheckStrength(true);
    };

    /**
     * Handles the click event for the Copy button.
     */
    const handleCopy = async () => {
        const password = passwordInput.value;
        if (!password) {
            showToast("Nothing to copy!");
            return;
        }

        try {
            await navigator.clipboard.writeText(password);
            showToast("✅ Password copied to clipboard!");
        } catch (err) {
            showToast("❌ Failed to copy. Please copy manually.");
        }
    };

    /**
     * Listener for all controls that trigger a password update and strength check.
     * This ensures consistency whether the user types, generates, or changes options.
     */
    const handleControlChange = () => {
        // If the user changes options, and the password input is currently empty,
        // we clear the input to force re-evaluation.
        if (!passwordInput.value && (upperCheck.checked !== upperCheck.dataset.initial)) {
             passwordInput.value = '';
        }

        // Update display for length slider
        lengthValueSpan.textContent = lengthSlider.value;

        // Update and check strength
        updatePasswordAndCheckStrength(false);
    };

    // --- EVENT LISTENERS SETUP ---

    // 1. Input Listener: When user types manually
    passwordInput.addEventListener('input', () => {
        updatePasswordAndCheckStrength(false);
    });

    // 2. Slider Listener: When length changes
    lengthSlider.addEventListener('input', handleControlChange);

    // 3. Checkbox Listeners: When requirements change
    [upperCheck, lowerCheck, numberCheck, symbolCheck].forEach(checkbox => {
        checkbox.addEventListener('change', handleControlChange);
    });

    // 4. Button Listeners
    generateBtn.addEventListener('click', handleGenerate);
    copyBtn.addEventListener('click', handleCopy);

    // --- INITIALIZATION ---
    // Set initial state of checkboxes to handle 'checked' property changes correctly
    upperCheck.dataset.initial = upperCheck.checked;
    lowerCheck.dataset.initial = lowerCheck.checked;
    numberCheck.dataset.initial = numberCheck.checked;
    symbolCheck.dataset.initial = symbolCheck.checked;

    // Initial run to set up the empty state
    updatePasswordAndCheckStrength(false);
});