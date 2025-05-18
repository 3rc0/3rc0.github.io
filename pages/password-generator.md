---
layout: page
title: Password Generator
permalink: /password-generator/
---

<style>
#password-generator-container {
  max-width: 600px;
  margin: 0 auto;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

#password-box {
  font-family: monospace;
  font-size: 1.1rem;
  padding: 12px;
  margin-top: 1rem;
  background-color: #f8f9fa;
  border: 1px solid #ced4da;
  border-radius: 8px;
  word-break: break-word;
  min-height: 40px;
  transition: all 0.2s ease;
  text-align: center;
}

#password-box.placeholder {
  color: #6c757d;
  font-style: italic;
  text-align: center;
}

#password-box.generated {
  color: #212529;
  font-weight: bold;
  font-style: normal;
}

button {
  margin-top: 10px;
  margin-right: 8px;
  padding: 8px 14px;
  font-size: 0.95rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #0056b3;
}

input[type="number"] {
  padding: 6px;
  width: 80px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-top: 5px;
  margin-bottom: 10px;
}
</style>

<div id="password-generator-container">
  <h2>🔐 Password Generator</h2>
  <p>Define the password length and click generate to get an extremely strong, secure password.</p>

  <label for="length">Password Length (Max 128):</label>
  <br>
  <input type="number" id="length" min="8" max="128" value="32">
  <br>
  <button onclick="generatePassword()">Generate New Password</button>
  <button onclick="copyPassword()">Copy to Clipboard</button>

  <p id="password-box" class="placeholder">Your password will appear here.</p>
</div>

<script>
function generatePassword() {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/`~";
  let length = parseInt(document.getElementById("length").value);
  if (isNaN(length) || length < 8 || length > 128) {
    alert("Please choose a valid length between 8 and 128.");
    return;
  }

  let password = '';
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);  // secure RNG

  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  const box = document.getElementById("password-box");
  box.innerText = password;
  box.classList.remove("placeholder");
  box.classList.add("generated");
}

function copyPassword() {
  const box = document.getElementById("password-box");
  const password = box.innerText;
  if (!password || box.classList.contains("placeholder")) {
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
