(function () {
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

  input.addEventListener("input", (e) => render(e.target.value));

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

  render("");
})();
