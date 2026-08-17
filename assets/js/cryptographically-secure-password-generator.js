document.addEventListener('DOMContentLoaded', () => {
  document.getElementById("generate-btn").addEventListener("click", generatePassword);
  document.getElementById("copy-btn").addEventListener("click", copyPassword);
  const toggleButton = document.getElementById("toggle-theme");
  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem('theme', document.body.classList.contains("dark-mode") ? 'dark' : 'light');
    });

    // Load theme on page load
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  }
});

// Password generation
function generatePassword() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/`~";
  const length = parseInt(document.getElementById("length").value);
  const passwordBox = document.getElementById("password-box");

  if (isNaN(length) || length < 8 || length > 128) {
    alert("Please choose a valid password length between 8 and 128.");
    return;
  }

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  let password = '';
  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  passwordBox.innerText = password;
  passwordBox.classList.remove('placeholder');

  updateEntropy(password, charset.length);
}

// Clipboard copy
function copyPassword() {
  const password = document.getElementById("password-box").innerText;
  if (!password || password.includes("Your password")) {
    alert("No password to copy!");
    return;
  }

  navigator.clipboard.writeText(password).then(() => {
    alert("Password copied to clipboard.");
  }).catch(err => {
    console.error("Copy failed", err);
    alert("Failed to copy. Try manually.");
  });
}

// Entropy visual
function updateEntropy(password, charsetSize) {
  const entropy = password.length * Math.log2(charsetSize);
  const fill = document.getElementById("entropy-fill");
  const percentage = Math.min(100, Math.round((entropy / 128) * 100));
  fill.style.width = `${percentage}%`;
  fill.style.backgroundColor = getEntropyColor(entropy);
}

function getEntropyColor(entropy) {
  if (entropy >= 128) return "#28a745"; // strong
  if (entropy >= 80) return "#ffc107"; // moderate
  return "#dc3545"; // weak
}
