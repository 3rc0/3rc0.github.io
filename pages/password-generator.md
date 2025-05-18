---
layout: page
title: Password Geneator
subtitle: 
gh-repo: 
gh-badge: [star, fork, follow]
tags: [test]
comments: true
mathjax: true
author: "Diyar Hussein"
permalink: /password-generator/
---


<style>
#password-box {
  font-family: monospace;
  font-size: 1.2em;
  padding: 10px;
  background-color: #f8f9fa;
  border: 1px solid #ccc;
  word-break: break-all;
}
button {
  margin-top: 10px;
  margin-right: 5px;
}
</style>

<h2>🔐 Ultra-Secure Password Generator</h2>
<p>Define the password length and click generate to get an extremely strong, secure password.</p>

<label for="length">Password Length (Max 128):</label>
<input type="number" id="length" min="8" max="128" value="32">
<br>
<button onclick="generatePassword()">Generate Password</button>
<button onclick="copyPassword()">Copy to Clipboard</button>

<p id="password-box">Your password will appear here.</p>

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
  window.crypto.getRandomValues(array); // Cryptographically secure RNG

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