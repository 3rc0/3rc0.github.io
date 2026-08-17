---
layout: page
title: Cryptographically Secure Password Generator
subtitle: Random passwords and NIST-aligned passphrases, generated entirely in your browser
description: "Generate strong, truly random passwords and passphrases using your browser's own built-in Web Cryptography feature. Nothing you generate ever leaves your browser."
author: "Diyar Hussein"
permalink: /cryptogen/
---
<link rel="stylesheet" href="/assets/css/cryptographically-secure-password-generator.css">
<script src="/assets/js/qrcode.js" defer></script>
<script src="/assets/js/cryptographically-secure-password-generator.js" defer></script>

<section class="pwgen">
  <div class="mode-switch" role="radiogroup" aria-label="Generator mode">
    <input type="radio" name="mode" id="mode-random" checked>
    <label for="mode-random">Random Password</label>
    <input type="radio" name="mode" id="mode-passphrase">
    <label for="mode-passphrase">Passphrase</label>
    <input type="radio" name="mode" id="mode-key">
    <label for="mode-key">Encryption Key</label>
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
      <label><input type="checkbox" id="opt-symbols" checked> Symbols, including space (!@#$…)</label>
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

  <div id="key-panel" hidden>
    <div class="pwgen-field">
      <label for="key-base64">Base64</label>
      <textarea id="key-base64" rows="2" spellcheck="false" placeholder="Paste base64 here, or click Generate below"></textarea>
      <div class="pwgen-key-row">
        <button id="copy-key-base64-btn" type="button">📋 Copy Base64</button>
        <span id="key-base64-status" class="status-msg"></span>
      </div>
      <div id="key-base64-qr" class="pwgen-qr" hidden></div>
    </div>

    <div class="pwgen-field">
      <label for="key-hex">Hex (grouped)</label>
      <textarea id="key-hex" rows="2" spellcheck="false" placeholder="Paste hex here, or click Generate below"></textarea>
      <div class="pwgen-key-row">
        <button id="copy-key-hex-btn" type="button">📋 Copy Hex</button>
        <span id="key-hex-status" class="status-msg"></span>
      </div>
    </div>

    <div class="pwgen-field">
      <label for="key-bits">Binary</label>
      <textarea id="key-bits" rows="3" spellcheck="false" placeholder="Paste binary (0s and 1s) here, or click Generate below"></textarea>
      <div class="pwgen-key-row">
        <button id="copy-key-bits-btn" type="button">📋 Copy Binary</button>
        <span id="key-bits-status" class="status-msg"></span>
      </div>
    </div>
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
  </div>

  <div id="standard-output-section">
    <div class="pwgen-actions">
      <button id="copy-btn" type="button">📋 Copy</button>
    </div>

    <p id="output" class="pwgen-output placeholder" tabindex="0" aria-live="polite">Your password will appear here</p>
    <div id="output-qr" class="pwgen-qr" hidden></div>

    <div id="entropy-bar" class="entropy-bar" role="progressbar" aria-valuemin="0" aria-valuemax="128" aria-valuenow="0" aria-label="Password strength">
      <div id="entropy-fill" class="entropy-fill" data-strength="weak"></div>
    </div>
    <p id="entropy-label" class="entropy-label">Strength: —</p>
  </div>

  <p id="status-msg" class="status-msg" role="status" aria-live="polite"></p>

  <div id="key-extras-panel" hidden>
    <p class="pwgen-section-label">Extra tools, using the key above</p>

    <div class="pwgen-field">
      <label for="uuid-output">Random UUID</label>
      <textarea id="uuid-output" rows="1" spellcheck="false" readonly placeholder="Click Generate UUID"></textarea>
      <div class="pwgen-key-row">
        <button id="generate-uuid-btn" type="button">🔁 Generate UUID</button>
        <button id="copy-uuid-btn" type="button">📋 Copy</button>
        <span id="uuid-status" class="status-msg"></span>
      </div>
      <div id="uuid-qr" class="pwgen-qr" hidden></div>
    </div>

    <div class="pwgen-field">
      <label for="encrypt-plaintext">Text to encrypt</label>
      <textarea id="encrypt-plaintext" rows="3" spellcheck="false"></textarea>
      <div class="pwgen-key-row">
        <button id="encrypt-btn" type="button">🔒 Encrypt</button>
        <span id="encrypt-status" class="status-msg"></span>
      </div>
    </div>

    <div class="pwgen-field">
      <label for="encrypt-output">Encrypted result</label>
      <textarea id="encrypt-output" rows="2" spellcheck="false" readonly placeholder="Encrypted text will appear here"></textarea>
      <div class="pwgen-key-row">
        <button id="copy-encrypt-output-btn" type="button">📋 Copy</button>
      </div>
      <div id="encrypt-output-qr" class="pwgen-qr" hidden></div>
    </div>

    <div class="pwgen-field">
      <label for="decrypt-ciphertext">Encrypted text to decrypt</label>
      <textarea id="decrypt-ciphertext" rows="2" spellcheck="false"></textarea>
      <div class="pwgen-key-row">
        <button id="decrypt-btn" type="button">🔓 Decrypt</button>
        <span id="decrypt-status" class="status-msg"></span>
      </div>
    </div>

    <div class="pwgen-field">
      <label for="decrypt-output">Decrypted result</label>
      <textarea id="decrypt-output" rows="3" spellcheck="false" readonly placeholder="Decrypted text will appear here"></textarea>
      <div class="pwgen-key-row">
        <button id="copy-decrypt-output-btn" type="button">📋 Copy</button>
      </div>
      <div id="decrypt-output-qr" class="pwgen-qr" hidden></div>
    </div>
  </div>
</section>