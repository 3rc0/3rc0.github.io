---
layout: page
title: Cryptographically Secure Password Generator
subtitle: Random passwords and NIST-aligned passphrases, generated entirely in your browser
description: "Generate strong, truly random passwords and passphrases using your browser's own built-in Web Cryptography feature. Nothing you generate ever leaves your browser."
author: "Diyar Hussein"
permalink: /cryptogen/
---
<link rel="stylesheet" href="/assets/css/cryptographically-secure-password-generator.css">
<script src="/assets/js/cryptographically-secure-password-generator.js" defer></script>

<section class="pwgen" aria-labelledby="pwgen-heading">
  <h1 id="pwgen-heading">🔐 Cryptographically Secure Password Generator</h1>

  <div class="mode-switch" role="radiogroup" aria-label="Generator mode">
    <input type="radio" name="mode" id="mode-random" checked>
    <label for="mode-random">Random Password</label>
    <input type="radio" name="mode" id="mode-passphrase">
    <label for="mode-passphrase">Passphrase</label>
  </div>

  <div id="random-panel">
    <div class="pwgen-field">
      <label for="length">Length: <span id="length-value">20</span> characters</label>
      <input type="range" id="length" min="8" max="128" value="20">
    </div>

    <fieldset class="pwgen-options">
      <legend>Character types</legend>
      <label><input type="checkbox" id="opt-upper" checked> Uppercase (A–Z)</label>
      <label><input type="checkbox" id="opt-lower" checked> Lowercase (a–z)</label>
      <label><input type="checkbox" id="opt-digits" checked> Digits (0–9)</label>
      <label><input type="checkbox" id="opt-symbols" checked> Symbols (!@#$…)</label>
      <label><input type="checkbox" id="opt-exclude-ambiguous"> Exclude ambiguous characters (l, 1, I, O, 0)</label>
      <label><input type="checkbox" id="opt-guarantee-each"> Guarantee at least one of each selected type</label>
    </fieldset>
  </div>

  <div id="passphrase-panel" hidden>
    <div class="pwgen-field">
      <label for="word-count">Words: <span id="word-count-value">5</span></label>
      <input type="range" id="word-count" min="3" max="10" value="5">
    </div>

    <div class="pwgen-field">
      <label for="word-separator">Separator</label>
      <select id="word-separator">
        <option value="dash" selected>Dash ( - )</option>
        <option value="underscore">Underscore ( _ )</option>
        <option value="space">Space</option>
        <option value="none">None</option>
      </select>
    </div>

    <fieldset class="pwgen-options">
      <legend>Options</legend>
      <label><input type="checkbox" id="opt-capitalize" checked> Capitalize each word</label>
      <label><input type="checkbox" id="opt-append-number" checked> Append a random digit</label>
    </fieldset>
  </div>

  <div class="pwgen-field">
    <label for="clipboard-clear-select">Auto-clear clipboard after copying</label>
    <select id="clipboard-clear-select">
      <option value="0">Never (not recommended)</option>
      <option value="15">15 seconds</option>
      <option value="30" selected>30 seconds</option>
      <option value="60">60 seconds</option>
    </select>
  </div>

  <div class="pwgen-actions">
    <button id="generate-btn" type="button">🔁 Generate (Ctrl/Cmd+Enter)</button>
    <button id="copy-btn" type="button">📋 Copy</button>
  </div>

  <p id="output" class="pwgen-output placeholder" tabindex="0" aria-live="polite">Your password will appear here</p>

  <div id="entropy-bar" class="entropy-bar" role="progressbar" aria-valuemin="0" aria-valuemax="128" aria-valuenow="0" aria-label="Password strength">
    <div id="entropy-fill" class="entropy-fill" data-strength="weak"></div>
  </div>
  <p id="entropy-label" class="entropy-label">Strength: —</p>
  <p id="crack-time-label" class="crack-time-label">Estimated offline crack time: —</p>

  <p id="status-msg" class="status-msg" role="status" aria-live="polite"></p>

  <div class="pwgen-history">
    <h3>
      This session's history
      <button id="clear-history-btn" type="button">Clear</button>
    </h3>
    <ul id="history-list"><li class="history-empty">No history yet this session.</li></ul>
  </div>

  <button id="toggle-theme" type="button" class="theme-toggle">🌓 Toggle theme</button>
</section>