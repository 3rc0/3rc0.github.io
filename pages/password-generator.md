---
layout: page
title: Password Generator
subtitle: Generate ultra-secure passwords
gh-repo:
gh-badge: [star, fork, follow]
tags: [security, password, tool]
comments: false
mathjax: false
author: "Diyar Hussein"
permalink: /password-generator/
---

<style>
.password-container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  background: #ffffff;
  box-shadow: 0 0 12px rgba(0,0,0,0.1);
  border-radius: 12px;
  font-family: 'Segoe UI', sans-serif;
  color: #343a40;
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
  color:rgb(71, 76, 80);
}

label, input, button {
  display: block;
  margin-top: 1rem;
  font-size: 1rem;
  width: 100%;
}

input[type="number"] {
  padding: 8px;
  border: 1px solid #ced4da;
  border-radius: 6px;
}

button {
  margin-top: 1rem;
  padding: 10px;
  background-color: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.2s ease-in-out;
}

button:hover {
  background-color: #0b5ed7;
}
</style>

<div class="password-container">
  <h2>🔐 Password Generator</h2>
  <p>Enter desired password length (8–128) and click to generate a highly secure password.</p>

  <label for="length">Password Length (Max 128):</label>
  <input type="number" id="length" min="8" max="128" value="32">

  <button onclick="generatePassword()">Generate Password</button>
  <button onclick="copyPassword()">Copy to Clipboard</button>

  <p id="password-box" style="font-size: 14px; margin-center: 10px; color:rgb(169, 181, 194);">Your password will appear here.</p>
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
  window.crypto.getRandomValues(array); // Secure RNG

  for (let i = 0; i < length; i++) {
    password += charset[array[i] % charset.length];
  }

  document.getElementById("password-box").innerText = password;
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
