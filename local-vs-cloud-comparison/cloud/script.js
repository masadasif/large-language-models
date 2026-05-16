(function () {
  // ---------- DOM ----------
  const input = document.getElementById("password");
  const toggle = document.getElementById("toggle");
  const toggleIcon = toggle.querySelector(".field__toggle-icon");
  const bar = document.getElementById("meter-bar");
  const statusValue = document.getElementById("status-value");
  const hintsList = document.getElementById("hints");
  const hintNodes = {};
  hintsList.querySelectorAll(".hint").forEach((el) => {
    hintNodes[el.dataset.rule] = el;
  });

  const lengthSlider = document.getElementById("length");
  const lengthValue = document.getElementById("length-value");
  const generateBtn = document.getElementById("generate");
  const copyBtn = document.getElementById("copy");
  const optionInputs = document.querySelectorAll(".option input[type=checkbox]");
  const toast = document.getElementById("toast");

  // ---------- Strength scoring ----------
  const LEVELS = {
    0: { label: "—", color: "var(--track)", width: 0, key: null },
    1: { label: "Weak", color: "var(--weak)", width: 25, key: "weak" },
    2: { label: "Weak", color: "var(--weak)", width: 40, key: "weak" },
    3: { label: "Medium", color: "var(--medium)", width: 65, key: "medium" },
    4: { label: "Strong", color: "var(--strong)", width: 85, key: "strong" },
    5: { label: "Strong", color: "var(--strong)", width: 100, key: "strong" },
  };

  function evaluate(pw) {
    const rules = {
      length: pw.length >= 8,
      uppercase: /[A-Z]/.test(pw),
      lowercase: /[a-z]/.test(pw),
      number: /[0-9]/.test(pw),
      special: /[^A-Za-z0-9]/.test(pw),
    };
    const score = Object.values(rules).filter(Boolean).length;
    return { rules, score };
  }

  function render(pw) {
    const { rules, score } = evaluate(pw);
    const level = pw.length === 0 ? LEVELS[0] : LEVELS[score];

    bar.style.width = level.width + "%";
    bar.style.backgroundColor = level.color;

    statusValue.textContent = level.label;
    if (level.key) {
      statusValue.setAttribute("data-level", level.key);
    } else {
      statusValue.removeAttribute("data-level");
    }

    Object.keys(hintNodes).forEach((rule) => {
      hintNodes[rule].classList.toggle("is-met", !!rules[rule]);
    });
  }

  function setPassword(pw) {
    input.value = pw;
    render(pw);
  }

  // ---------- Generator ----------
  const POOLS = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    number: "0123456789",
    symbol: "!@#$%^&*()-_=+[]{};:,.<>?/~",
  };

  function getActivePools() {
    return Array.from(optionInputs)
      .filter((cb) => cb.checked)
      .map((cb) => cb.dataset.pool);
  }

  function randomInt(maxExclusive) {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % maxExclusive;
  }

  function pickFrom(str) {
    return str.charAt(randomInt(str.length));
  }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function generate(length, activePools) {
    if (activePools.length === 0) return "";
    const all = activePools.map((p) => POOLS[p]).join("");
    const chars = activePools.map((p) => pickFrom(POOLS[p])); // guarantee one of each
    while (chars.length < length) chars.push(pickFrom(all));
    return shuffle(chars).slice(0, length).join("");
  }

  function regenerate() {
    const length = Number(lengthSlider.value);
    const pools = getActivePools();
    if (pools.length === 0) {
      generateBtn.disabled = true;
      copyBtn.disabled = !input.value;
      return;
    }
    generateBtn.disabled = false;
    setPassword(generate(length, pools));
    copyBtn.disabled = false;
  }

  // ---------- Clipboard + toast ----------
  let toastTimer = null;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 1800);
  }

  async function copyToClipboard(text) {
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      showToast("Copied to clipboard");
    } catch (err) {
      showToast("Copy failed");
    }
  }

  // ---------- Wiring ----------
  input.addEventListener("input", (e) => {
    render(e.target.value);
    copyBtn.disabled = !e.target.value;
  });

  toggle.addEventListener("click", () => {
    const showing = input.type === "text";
    input.type = showing ? "password" : "text";
    toggle.setAttribute("aria-pressed", String(!showing));
    toggle.setAttribute(
      "aria-label",
      showing ? "Show password" : "Hide password"
    );
    toggleIcon.textContent = showing ? "show" : "hide";
    input.focus();
  });

  lengthSlider.addEventListener("input", () => {
    lengthValue.textContent = lengthSlider.value;
    regenerate();
  });

  optionInputs.forEach((cb) => cb.addEventListener("change", regenerate));

  generateBtn.addEventListener("click", regenerate);

  copyBtn.addEventListener("click", () => copyToClipboard(input.value));

  // ---------- Init ----------
  lengthValue.textContent = lengthSlider.value;
  regenerate();
})();
