---
layout: page
title: Password Generator
permalink: /password-generator/
---

<style>
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --bg-light: #f1f3f5;
  --text-light: #212529;
  --bg-dark: #1e1e1e;
  --text-dark: #f1f3f5;
  --box-bg-light: #e9ecef;
  --box-bg-dark: #2c2c2c;
}

body[data-theme='dark'] {
  background-color: var(--bg-dark);
  color: var(--text-dark);
}

[data-theme='dark'] #password-box {
  background-color: var(--box-bg-dark);
  color: var(--text-dark);
  border-color: #444;
}

[data-theme='dark'] button {
  background: linear-gradient(to right, #4f46e5, #3b82f6);
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4em;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 500;
  background: linear-gradient(to right, var(--primary-dark), var(--primary));
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 12px;
  margin-right: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
  cursor: pointer;
}
button:hover {
  transform: translateY(-1px);
}
button:active {
  transform: scale(0.98);
}

#password-box {
  font-family: monospace;
  font-size: 18px;
  padding: 12px;
  margin-top: 10px;
  background-color: var(--box-bg-light);
  border: 1px solid #ccc;
  border-radius: 8px;
  color: var(--text-light);
  text-align: center;
  word-break: break-word;
}

#prompt-text {
  color: #6c757d;
}

/* Toggle Switch */
.switch {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
}
.switch input {
  display: none;
}
.slider {
  width: 40px;
  height: 20px;
  background-color: #ccc;
  border-radius: 30px;
  position: relative;
  cursor: pointer;
  transition: 0.3s;
}
.slider::before {
  content: "";
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  border-radius: 50%;
  transition: 0.3s;
}
input:checked + .slider {
  background-color: var(--primary);
}
input:checked + .slider::before {
  transform: translateX(20px);
}
</style>

<!-- Dark Mode Switch -->
<div class="switch">
  <label>
    <input type="checkbox" id="theme-toggle" aria-label="Toggle dark mode">
    <span class="slider"></span>
  </label>
</div>

<h2>🔐 Password Generator</h2>
<p>Define the password length and click generate to get a secure, high-entropy password.</p>

<label for="length">Password Length (8–128):</label>
<input type="number" id="length" min="8" max="128" value="32">
<br>

<button onclick="generatePassword()">🔄 Generate New Password</button>
<button onclick="copyPassword()">📋 Copy to Clipboard</button>

<p id="password-box"><span id="prompt-text">Your password will appear here.</span></p>

<script>
// Toggle dark mode
document.getElementById('theme-toggle').addEventListener('change', function() {
  document.body.setAttribute('data-theme', this.checked ? 'dark' : 'light');
});

// Secure password generation with max entropy
function generatePassword() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/`~";
  const length = parseInt(document.getElementById("length").value);
  if (isNaN(length) || length < 8 || length > 128) {
    alert("Please choose a valid length between 8 and 128.");
    return;
  }

  let password = '';
  const cryptoArray = new Uint8Array(length);
  window.crypto.getRandomValues(cryptoArray);

  for (let i = 0; i < length; i++) {
    password += charset[cryptoArray[i] % charset.length];
  }

  document.getElementById("password-box").innerHTML = `<strong>${password}</strong>`;
}

// Clipboard copy
function copyPassword() {
  const box = document.getElementById("password-box");
  const text = box.innerText;
  if (!text || text.includes("Your password")) {
    alert("No password to copy!");
    return;
  }

  navigator.clipboard.writeText(text).then(() => {
    alert("Password copied to clipboard.");
  }).catch(err => {
    console.error("Copy failed", err);
    alert("Failed to copy. Try manually.");
  });
}
</script>
