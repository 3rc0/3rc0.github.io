---
layout: page
title: Password Generator
subtitle: Ultra-secure, customizable, and accessible password tool
author: "Diyar Hussein"
permalink: /password-generator/
---


<link rel="stylesheet" href="/assets/css/password-generator.css">
<script src="/assets/js/password-generator.js" defer></script>

<h2>🔐 Password Generator</h2>
<p>Generate a secure password with entropy strength and dark/light mode support.</p>

<label for="length">Password Length (8–128):</label>
<input type="number" id="length" min="8" max="128" value="32">
<br>
<button id="generate-btn">🔁 Generate Password</button>
<button id="copy-btn">📋 Copy</button>


<p id="password-box" class="placeholder">Your password will appear here.</p>

<div id="entropy-bar">
  <div id="entropy-fill"></div>
</div>
