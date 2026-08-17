(function () {
  'use strict';

  // A plain "random value divided by max, keeping the remainder" is
  // not perfectly fair: it very slightly favors lower results whenever
  // max does not divide evenly into the total range of possible random
  // values. This function throws away any random value that would
  // cause that unfairness and draws again, so every character has
  // exactly the same chance of being chosen.
  function drawUnbiasedRandomIndex(maximum) {
    const totalPossibleValues = 0x100000000;
    const largestFairLimit = totalPossibleValues - (totalPossibleValues % maximum);
    const buffer = new Uint32Array(1);
    let randomValue;
    do {
      crypto.getRandomValues(buffer);
      randomValue = buffer[0];
    } while (randomValue >= largestFairLimit);
    return randomValue % maximum;
  }

  // Shuffles a list into a random order, using the same fair random
  // selection method above, so no position in the final result is more
  // predictable than any other.
  function shuffleFairly(list) {
    for (let i = list.length - 1; i > 0; i--) {
      const swapWith = drawUnbiasedRandomIndex(i + 1);
      [list[i], list[swapWith]] = [list[swapWith], list[i]];
    }
    return list;
  }

  const CHARACTER_SETS = {
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{}|;:,.<>?/`~ ',
  };
  const CHARACTERS_THAT_LOOK_ALIKE = /[Il1O0]/g;

  // A curated list of three hundred and fourteen short, common
  // English words -- nouns, describing words, and action words mixed
  // together in one pool, written for this tool. This is not the
  // official word list published by the Electronic Frontier
  // Foundation for memorable passphrases, but it follows the same
  // real-world approach that list and most well-known passphrase
  // tools use: one flat, mixed pool of ordinary words, rather than
  // words grouped by grammatical type. Mixing word types this way
  // does not change the security of the result at all -- strength
  // depends only on how many different words are possible and how
  // fairly they are chosen, covered above -- it only makes the
  // resulting phrase read a little more naturally. Checked so that no
  // word in this list is the beginning of another word in the list
  // (for example, having both "cat" and "catalog" would be avoided),
  // which keeps every word unambiguous if it is ever typed by hand.
  // The strength calculation below always uses the list's real
  // length, so it stays accurate even if words are added or removed
  // later.
  const PASSPHRASE_WORD_LIST = [
    "acorn","amber","anchor","angle","apple","arch","arrow","ash","aspen","atlas",
    "badge","banjo","barn","basil","beacon","bear","beaver","bell","berry","birch",
    "bison","blaze","bloom","boat","bolt","bone","boot","brick","bridge","brook",
    "bronze","brush","cabin","cactus","camel","canyon","cape","cargo","cedar","chalk",
    "charm","cherry","chess","chime","cider","clay","cliff","cloak","clover","coal",
    "comet","copper","coral","cove","crane","creek","crest","crow","crystal","cub",
    "dawn","deer","delta","denim","dice","dock","dove","drift","drum","dune",
    "eagle","ember","emerald","falcon","feather","fern","fiddle","field","finch","fjord",
    "flame","flint","flower","forge","fox","frost","garnet","gate","gecko","glacier",
    "glow","grain","grape","grove","gull","harbor","hawk","hazel","heron","hill",
    "holly","honey","hoof","horn","husk","ibis","ice","ivory","ivy","jade",
    "jasper","jet","juniper","kelp","kite","lagoon","lake","lamb","lantern","larch",
    "leaf","lemon","lilac","lime","linen","lion","lotus","lynx","maple","marble",
    "marsh","meadow","mint","mist","moon","moss","moth","mountain","nest","north",
    "nova","nutmeg","oak","oasis","olive","onyx","opal","orbit","orchid","osprey",
    "otter","owl","oxide","pearl","pebble","perch","petal","pine","plum","pond",
    "poppy","prairie","prism","quail","quartz","quill","rabbit","raven","reed","reef",
    "ridge","river","robin","rose","ruby","saffron","sage","salmon","sand","sapphire",
    "shale","shore","silver","sky","slate","sloth","snow","sparrow","spruce","stag",
    "star","stone","storm","stream","summit","swan","tern","thistle","thorn","tide",
    "timber","topaz","trout","tulip","tundra","valley","vine","violet","walnut","wave",
    "wheat","willow","wolf","wood","wren","zephyr","zinc",
    "ancient","bold","brave","bright","calm","clever","cozy","crisp","daring","eager",
    "fair","fierce","fresh","gentle","golden","grand","happy","honest","humble","jolly",
    "keen","kind","lively","lucky","mellow","mighty","modest","noble","proud","quiet",
    "quick","rapid","rich","royal","rustic","sharp","shiny","silent","smooth","solid",
    "sturdy","subtle","sunny","swift","tender","tidy","vivid","warm","wild","wise",
    "build","carry","catch","climb","dance","dream","drive","explore","float",
    "fly","gather","glide","grow","guide","hunt","jump","leap","learn",
    "march","paint","plant","play","race","reach","ride","rise","roam","run",
    "sail","search","shape","shine","sing","soar","spin","sprint","stand",
    "steer","stride","swim","teach","travel","trust","voyage","wander","weave","write"
  ];

  let pageElements = {};
  let currentGeneratedValue = '';
  let pendingClipboardClearTimer = null;

  document.addEventListener('DOMContentLoaded', startPage);

  function startPage() {
    pageElements = findAllPageElements();
    setUpModeSwitching();
    setUpLiveNumberDisplays();
    setUpKeyboardShortcut();
    setUpEncryptionKeyMode();

    pageElements.generateButton.addEventListener('click', handleGenerateClick);
    pageElements.copyButton.addEventListener('click', handleCopyClick);
    pageElements.outputText.addEventListener('click', selectAllOutputText);
  }

  function findAllPageElements() {
    const nameMap = {
      'mode-random': 'modeRandom', 'mode-passphrase': 'modePassphrase',
      'mode-key': 'modeKey',
      'random-panel': 'randomPanel', 'passphrase-panel': 'passphrasePanel',
      'key-panel': 'keyPanel', 'standard-output-section': 'standardOutputSection',
      'length': 'length', 'length-value': 'lengthValueDisplay',
      'opt-upper': 'optUpper', 'opt-lower': 'optLower', 'opt-digits': 'optDigits',
      'opt-symbols': 'optSymbols', 'opt-exclude-ambiguous': 'optExcludeLookalikes',
      'opt-guarantee-each': 'optGuaranteeEachType',
      'word-count': 'wordCount', 'word-count-value': 'wordCountValueDisplay',
      'word-separator': 'wordSeparator', 'opt-capitalize': 'optCapitalize',
      'opt-append-number': 'optAppendNumber', 'generate-btn': 'generateButton',
      'copy-btn': 'copyButton', 'output': 'outputText',
      'entropy-bar': 'strengthBar', 'entropy-fill': 'strengthFill',
      'entropy-label': 'strengthLabel',
      'clipboard-clear-select': 'clipboardClearSelect', 'status-msg': 'statusMessage',
      'key-base64': 'keyBase64Field', 'key-hex': 'keyHexField',
      'copy-key-base64-btn': 'copyKeyBase64Button', 'copy-key-hex-btn': 'copyKeyHexButton',
      'key-base64-status': 'keyBase64Status', 'key-hex-status': 'keyHexStatus',
    };
    const found = {};
    Object.keys(nameMap).forEach(function (id) {
      found[nameMap[id]] = document.getElementById(id);
    });
    return found;
  }

  function setUpModeSwitching() {
    pageElements.modeRandom.addEventListener('change', showCorrectModePanel);
    pageElements.modePassphrase.addEventListener('change', showCorrectModePanel);
    pageElements.modeKey.addEventListener('change', showCorrectModePanel);
    showCorrectModePanel();
  }

  function showCorrectModePanel() {
    const keyModeIsSelected = pageElements.modeKey.checked;
    const randomModeIsSelected = pageElements.modeRandom.checked;
    pageElements.randomPanel.hidden = !randomModeIsSelected;
    pageElements.passphrasePanel.hidden = randomModeIsSelected || keyModeIsSelected;
    pageElements.keyPanel.hidden = !keyModeIsSelected;
    pageElements.standardOutputSection.hidden = keyModeIsSelected;
    clearAllGeneratedOutput();
  }

  function clearAllGeneratedOutput() {
    currentGeneratedValue = '';

    pageElements.outputText.textContent = 'Your password will appear here';
    pageElements.outputText.classList.add('placeholder');
    pageElements.strengthFill.style.width = '0%';
    pageElements.strengthFill.dataset.strength = 'weak';
    pageElements.strengthBar.setAttribute('aria-valuenow', '0');
    pageElements.strengthLabel.textContent = 'Strength: —';

    pageElements.keyBase64Field.value = '';
    pageElements.keyHexField.value = '';
    setKeyFieldStatus(pageElements.keyBase64Status, '', '');
    setKeyFieldStatus(pageElements.keyHexStatus, '', '');

    pageElements.statusMessage.textContent = '';
    pageElements.statusMessage.className = 'status-msg';
  }

  function setUpLiveNumberDisplays() {
    pageElements.length.addEventListener('input', function () {
      pageElements.lengthValueDisplay.textContent = pageElements.length.value;
    });
    pageElements.lengthValueDisplay.textContent = pageElements.length.value;

    pageElements.wordCount.addEventListener('input', function () {
      pageElements.wordCountValueDisplay.textContent = pageElements.wordCount.value;
    });
    pageElements.wordCountValueDisplay.textContent = pageElements.wordCount.value;
  }

  function setUpKeyboardShortcut() {
    document.addEventListener('keydown', function (event) {
      const controlOrCommandKeyHeld = event.ctrlKey || event.metaKey;
      if (controlOrCommandKeyHeld && event.key === 'Enter') {
        event.preventDefault();
        handleGenerateClick();
      }
    });
  }

  function buildSelectedCharacterSet() {
    let combined = '';
    if (pageElements.optUpper.checked) combined += CHARACTER_SETS.upper;
    if (pageElements.optLower.checked) combined += CHARACTER_SETS.lower;
    if (pageElements.optDigits.checked) combined += CHARACTER_SETS.digits;
    if (pageElements.optSymbols.checked) combined += CHARACTER_SETS.symbols;
    if (pageElements.optExcludeLookalikes.checked) {
      combined = combined.replace(CHARACTERS_THAT_LOOK_ALIKE, '');
    }
    return combined;
  }

  function removeLookalikesIfRequested(set) {
    return pageElements.optExcludeLookalikes.checked
      ? set.replace(CHARACTERS_THAT_LOOK_ALIKE, '')
      : set;
  }

  function generateRandomPassword() {
    const requestedLength = parseInt(pageElements.length.value, 10);
    if (isNaN(requestedLength) || requestedLength < 8 || requestedLength > 128) {
      showStatusMessage('Please choose a length between 8 and 128 characters.', 'error');
      return null;
    }
    const availableCharacters = buildSelectedCharacterSet();
    if (availableCharacters.length === 0) {
      showStatusMessage('Please select at least one character type.', 'error');
      return null;
    }

    let chosenCharacters = [];

    if (pageElements.optGuaranteeEachType.checked) {
      const requiredSets = [];
      if (pageElements.optUpper.checked) requiredSets.push(removeLookalikesIfRequested(CHARACTER_SETS.upper));
      if (pageElements.optLower.checked) requiredSets.push(removeLookalikesIfRequested(CHARACTER_SETS.lower));
      if (pageElements.optDigits.checked) requiredSets.push(removeLookalikesIfRequested(CHARACTER_SETS.digits));
      if (pageElements.optSymbols.checked) requiredSets.push(removeLookalikesIfRequested(CHARACTER_SETS.symbols));
      if (requiredSets.length > requestedLength) {
        showStatusMessage('The chosen length is too short to include one of every selected character type.', 'error');
        return null;
      }
      requiredSets.forEach(function (set) {
        if (set.length > 0) chosenCharacters.push(set[drawUnbiasedRandomIndex(set.length)]);
      });
      while (chosenCharacters.length < requestedLength) {
        chosenCharacters.push(availableCharacters[drawUnbiasedRandomIndex(availableCharacters.length)]);
      }
      shuffleFairly(chosenCharacters);
    } else {
      for (let i = 0; i < requestedLength; i++) {
        chosenCharacters.push(availableCharacters[drawUnbiasedRandomIndex(availableCharacters.length)]);
      }
    }

    const finishedPassword = chosenCharacters.join('');
    const strengthInBits = requestedLength * Math.log2(availableCharacters.length);

    if (requestedLength < 15) {
      showStatusMessage(
        'Password created. For an account protected by a password alone, a length of fifteen characters or more is recommended.',
        'warning'
      );
    } else {
      showStatusMessage('Password created.', 'success');
    }
    return { value: finishedPassword, strengthInBits: strengthInBits };
  }

  function bytesToBase64(bytes) {
    let binaryText = '';
    for (let i = 0; i < bytes.length; i++) binaryText += String.fromCharCode(bytes[i]);
    return btoa(binaryText);
  }

  function base64ToBytes(base64Text) {
    const trimmed = base64Text.trim();
    if (!trimmed) return null;
    const binaryText = atob(trimmed);
    const bytes = new Uint8Array(binaryText.length);
    for (let i = 0; i < binaryText.length; i++) bytes[i] = binaryText.charCodeAt(i);
    return bytes;
  }

  function bytesToGroupedHex(bytes) {
    let hexText = '';
    for (let i = 0; i < bytes.length; i++) {
      hexText += bytes[i].toString(16).padStart(2, '0').toUpperCase();
    }
    return (hexText.match(/.{1,4}/g) || [hexText]).join(' ');
  }

  function groupedHexToBytes(hexText) {
    const cleanedHex = hexText.replace(/\s+/g, '');
    if (!cleanedHex) return null;
    if (!/^[0-9A-Fa-f]+$/.test(cleanedHex)) {
      throw new Error('contains characters other than 0-9 and A-F');
    }
    if (cleanedHex.length % 2 !== 0) {
      throw new Error('has an odd number of hex digits');
    }
    const bytes = new Uint8Array(cleanedHex.length / 2);
    for (let i = 0; i < cleanedHex.length; i += 2) {
      bytes[i / 2] = parseInt(cleanedHex.substr(i, 2), 16);
    }
    return bytes;
  }

  function setUpEncryptionKeyMode() {
    let syncingFields = false;

    pageElements.keyBase64Field.addEventListener('input', function () {
      if (syncingFields) return;
      const value = pageElements.keyBase64Field.value;
      if (!value.trim()) {
        syncingFields = true;
        pageElements.keyHexField.value = '';
        syncingFields = false;
        setKeyFieldStatus(pageElements.keyBase64Status, '', '');
        setKeyFieldStatus(pageElements.keyHexStatus, '', '');
        return;
      }
      try {
        const bytes = base64ToBytes(value);
        syncingFields = true;
        pageElements.keyHexField.value = bytesToGroupedHex(bytes);
        syncingFields = false;
        describeKeyLength(bytes.length);
      } catch (error) {
        setKeyFieldStatus(pageElements.keyBase64Status, 'This is not valid base64 text.', 'error');
      }
    });

    pageElements.keyHexField.addEventListener('input', function () {
      if (syncingFields) return;
      const value = pageElements.keyHexField.value;
      if (!value.trim()) {
        syncingFields = true;
        pageElements.keyBase64Field.value = '';
        syncingFields = false;
        setKeyFieldStatus(pageElements.keyBase64Status, '', '');
        setKeyFieldStatus(pageElements.keyHexStatus, '', '');
        return;
      }
      try {
        const bytes = groupedHexToBytes(value);
        syncingFields = true;
        pageElements.keyBase64Field.value = bytesToBase64(bytes);
        syncingFields = false;
        describeKeyLength(bytes.length);
      } catch (error) {
        setKeyFieldStatus(pageElements.keyHexStatus, 'This is not valid hex text: ' + error.message + '.', 'error');
      }
    });

    pageElements.copyKeyBase64Button.addEventListener('click', function () {
      copyTextToClipboard(pageElements.keyBase64Field.value, pageElements.keyBase64Status);
    });
    pageElements.copyKeyHexButton.addEventListener('click', function () {
      copyTextToClipboard(pageElements.keyHexField.value, pageElements.keyHexStatus);
    });
  }

  function describeKeyLength(byteCount) {
    const message = 'Valid — ' + byteCount + ' bytes (' + (byteCount * 8) + ' bits)';
    setKeyFieldStatus(pageElements.keyBase64Status, message, 'success');
    setKeyFieldStatus(pageElements.keyHexStatus, message, 'success');
  }

  function setKeyFieldStatus(element, message, type) {
    element.textContent = message;
    element.className = type ? 'status-msg status-' + type : 'status-msg';
  }

  function copyTextToClipboard(text, statusElement) {
    if (!text) {
      setKeyFieldStatus(statusElement, 'Nothing to copy yet.', 'warning');
      return;
    }
    if (!navigator.clipboard) {
      setKeyFieldStatus(statusElement, 'Clipboard access is not available. Select the text manually.', 'warning');
      return;
    }
    navigator.clipboard.writeText(text).then(function () {
      setKeyFieldStatus(statusElement, 'Copied.', 'success');
    }).catch(function () {
      setKeyFieldStatus(statusElement, 'Copying failed. Select the text manually.', 'error');
    });
  }

  function generateEncryptionKey() {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const base64Value = bytesToBase64(bytes);
    const hexValue = bytesToGroupedHex(bytes);

    const roundTripBytes = groupedHexToBytes(hexValue);
    const roundTripBase64 = bytesToBase64(roundTripBytes);
    const selfCheckPassed = roundTripBase64 === base64Value;

    pageElements.keyBase64Field.value = base64Value;
    pageElements.keyHexField.value = hexValue;

    if (selfCheckPassed) {
      describeKeyLength(32);
      showStatusMessage('Encryption key created and verified.', 'success');
    } else {
      setKeyFieldStatus(pageElements.keyBase64Status, 'Self-check failed — please generate again.', 'error');
      setKeyFieldStatus(pageElements.keyHexStatus, 'Self-check failed — please generate again.', 'error');
      showStatusMessage('Something went wrong. Please generate again.', 'error');
    }
    return { value: base64Value, strengthInBits: 256 };
  }
  function generatePassphrase() {
    const requestedWordCount = parseInt(pageElements.wordCount.value, 10);
    if (isNaN(requestedWordCount) || requestedWordCount < 3 || requestedWordCount > 10) {
      showStatusMessage('Please choose between three and ten words.', 'error');
      return null;
    }
    const separatorOptions = { dash: '-', underscore: '_', space: ' ', none: '' };
    const chosenSeparator = separatorOptions[pageElements.wordSeparator.value] || '-';

    const chosenWords = [];
    for (let i = 0; i < requestedWordCount; i++) {
      let word = PASSPHRASE_WORD_LIST[drawUnbiasedRandomIndex(PASSPHRASE_WORD_LIST.length)];
      if (pageElements.optCapitalize.checked) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      chosenWords.push(word);
    }

    let finishedPassphrase = chosenWords.join(chosenSeparator);
    let strengthInBits = requestedWordCount * Math.log2(PASSPHRASE_WORD_LIST.length);

    if (pageElements.optAppendNumber.checked) {
      const randomDigit = drawUnbiasedRandomIndex(10);
      finishedPassphrase += chosenSeparator + randomDigit;
      strengthInBits += Math.log2(10);
    }

    showStatusMessage('Passphrase created.', 'success');
    return { value: finishedPassphrase, strengthInBits: strengthInBits };
  }

  function handleGenerateClick() {
    let result;
    if (pageElements.modeKey.checked) {
      result = generateEncryptionKey();
    } else if (pageElements.modeRandom.checked) {
      result = generateRandomPassword();
    } else {
      result = generatePassphrase();
    }
    if (!result) return;

    currentGeneratedValue = result.value;

    if (pageElements.modeKey.checked) return;

    pageElements.outputText.textContent = currentGeneratedValue;
    pageElements.outputText.classList.remove('placeholder');
    updateStrengthDisplay(result.strengthInBits);
  }

  function updateStrengthDisplay(strengthInBits) {
    const filledPercentage = Math.min(100, Math.round((strengthInBits / 128) * 100));
    let strengthLevel = 'weak';
    if (strengthInBits >= 128) strengthLevel = 'strong';
    else if (strengthInBits >= 80) strengthLevel = 'moderate';

    pageElements.strengthFill.style.width = filledPercentage + '%';
    pageElements.strengthFill.dataset.strength = strengthLevel;
    pageElements.strengthBar.setAttribute('aria-valuenow', String(Math.round(strengthInBits)));
    pageElements.strengthLabel.textContent = 'Strength: ' +
      strengthLevel.charAt(0).toUpperCase() + strengthLevel.slice(1) +
      ' (approximately ' + Math.round(strengthInBits) + ' bits of randomness)';
  }

  function handleCopyClick() {
    if (!currentGeneratedValue) {
      showStatusMessage('Please create a password or passphrase first.', 'warning');
      return;
    }
    if (!navigator.clipboard) {
      showStatusMessage('Clipboard access is not available in this browser. Click the text above to select it manually.', 'warning');
      return;
    }
    const copiedValue = currentGeneratedValue;
    navigator.clipboard.writeText(copiedValue).then(function () {
      const clearAfterSeconds = parseInt(pageElements.clipboardClearSelect.value, 10);
      if (clearAfterSeconds > 0) {
        scheduleClipboardClearing(copiedValue, clearAfterSeconds);
        showStatusMessage('Copied. The clipboard will be cleared automatically in ' + clearAfterSeconds + ' seconds.', 'success');
      } else {
        showStatusMessage('Copied.', 'success');
      }
    }).catch(function () {
      showStatusMessage('Copying failed. Click the text above to select it manually.', 'error');
    });
  }

  function scheduleClipboardClearing(copiedValue, delayInSeconds) {
    if (pendingClipboardClearTimer) clearTimeout(pendingClipboardClearTimer);
    pendingClipboardClearTimer = setTimeout(function () {
      if (navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (currentClipboardContent) {
          if (currentClipboardContent === copiedValue) {
            navigator.clipboard.writeText('');
          }
        }).catch(function () {
          navigator.clipboard.writeText('').catch(function () {});
        });
      } else {
        navigator.clipboard.writeText('').catch(function () {});
      }
    }, delayInSeconds * 1000);
  }

  function selectAllOutputText() {
    if (!currentGeneratedValue) return;
    const selectionRange = document.createRange();
    selectionRange.selectNodeContents(pageElements.outputText);
    const currentSelection = window.getSelection();
    currentSelection.removeAllRanges();
    currentSelection.addRange(selectionRange);
  }

  function showStatusMessage(message, type) {
    pageElements.statusMessage.textContent = message;
    pageElements.statusMessage.className = 'status-msg status-' + type;
  }
})();