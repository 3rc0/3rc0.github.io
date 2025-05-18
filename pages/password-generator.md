---
layout: page
title: Password Generator
subtitle: Ultra-secure, customizable, and accessible password tool
author: "Diyar Hussein"
permalink: /password-generator/
---

<style>
body[data-theme="dark"] {
  background-color: #121212;
  color: #e0e0e0;
}

#password-box {
  font-family: monospace;
  font-size: 1.2em;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  word-break: break-word;
  text-align: center;
  margin-top: 10px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

[data-theme="dark"] #password-box {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-color: #555;
}

button {
  margin: 10px 5px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
}

button i {
  margin-right: 5px;
}

.btn-generate {
  background-color: #1976d2;
  color: white;
}

.btn-copy {
  background-color: #388e3c;
  color: white;
}

#strength-bar {
  height: 10px;
  width: 100%;
  background-color: #ddd;
  border-radius: 5px;
  margin-top: 10px;
  overflow: hidden;
}

#strength-level {
  height: 100%;
  transition: width 0.5s ease, background-color 0.5s ease;
}

.toggle-dark {
  background-color: #444;
  color: white;
  float: right;
}
</style>

<button class="toggle-dark" onclick="toggleTheme()">🌓 Toggle Dark Mode</button>
<h2>🔐 Password Generator</h2>
<p>Define the password length and click generate to get an ultra-secure password.</p>

<label for="length">Password Length (Max 128):</label>
<input type="number" id="length" min="8" max="128" value="32">
<br>
<button class="btn-generate" onclick="generatePassword()"><i>🔄</i>Generate Password</button>
<button class="btn-copy" onclick="copyPassword()"><i>📋</i>Copy Password</button>

<p id="password-box" aria-live="polite">Your password will appear here.</p>
<div id="strength-bar"><div id="strength-level"></div></div>

<script>
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  document.body.setAttribute('data-theme', currentTheme === 'dark' ? 'light' : 'dark');
}

function calculateEntropy(password) {
  let charsetSize = 0;
  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  const entropy = password.length * Math.log2(charsetSize);
  return entropy;
}

function showStrength(entropy) {
  const level = document.getElementById('strength-level');
  let width = Math.min(entropy, 128) + "%";
  let color = "red";
  if (entropy > 80) color = "green";
  else if (entropy > 60) color = "orange";
  else if (entropy > 40) color = "yellow";
  level.style.width = width;
  level.style.backgroundColor = color;
}

function generatePassword() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/`~";
  let length = parseInt(document.getElementById("length").value);
  if (isNaN(length) || length < 8 || length > 128) {
    alert("Please choose a valid length between 8 and 128.");
    return;
  }

  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);

  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  const passwordBox = document.getElementById("password-box");
  passwordBox.innerText = password;
  const entropy = calculateEntropy(password);
  showStrength(entropy);
}

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
    alert("Failed to copy. Please try manually.");
  });
}
</script>
