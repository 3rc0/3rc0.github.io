(function(){
  var tabs = document.querySelectorAll('.certs-tab');
  var sections = document.querySelectorAll('.certs-section');
  tabs.forEach(function(tab){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('active'); });
      sections.forEach(function(s){ s.classList.remove('active'); });
      tab.classList.add('active');
      document.getElementById('section-' + tab.dataset.target).classList.add('active');
    });
  });
})();

(function(){
  var viewer = document.getElementById('doc-viewer');
  var body = document.getElementById('doc-viewer-body');
  var title = document.getElementById('doc-viewer-title');
  var openLink = document.getElementById('doc-viewer-open');
  var closeBtn = document.getElementById('doc-viewer-close');
  var lastTrigger = null;

  function openViewer(file, type, name, triggerEl, originalFile){
    lastTrigger = triggerEl;
    title.textContent = name;
    openLink.href = originalFile || file;
    body.innerHTML = '';

    if (type === 'pdf'){
      var iframe = document.createElement('iframe');
      iframe.src = file;
      iframe.title = name;
      body.appendChild(iframe);
    } else if (type === 'image'){
      var img = document.createElement('img');
      img.src = file;
      img.alt = name;
      body.appendChild(img);
    } else {
      var wrap = document.createElement('div');
      wrap.className = 'doc-viewer-unsupported';
      var msg = document.createElement('p');
      msg.textContent = "Preview isn't available for this file type.";
      var dl = document.createElement('a');
      dl.className = 'doc-viewer-download-link';
      dl.href = originalFile || file;
      dl.textContent = 'Download file';
      wrap.appendChild(msg);
      wrap.appendChild(dl);
      body.appendChild(wrap);
    }

    viewer.classList.add('open');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeViewer(){
    viewer.classList.remove('open');
    body.innerHTML = '';
    document.body.style.overflow = '';
    if (lastTrigger){ lastTrigger.focus(); }
  }

  document.querySelectorAll('.cert-card[data-file]').forEach(function(card){
    card.addEventListener('click', function(){
      openViewer(card.dataset.file, card.dataset.type, card.dataset.name, card, card.dataset.original);
    });
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openViewer(card.dataset.file, card.dataset.type, card.dataset.name, card, card.dataset.original);
      }
    });
  });

  closeBtn.addEventListener('click', closeViewer);
  viewer.addEventListener('click', function(e){ if (e.target === viewer) closeViewer(); });

  document.addEventListener('keydown', function(e){
    if (!viewer.classList.contains('open')) return;

    if (e.key === 'Escape'){
      closeViewer();
      return;
    }

    if (e.key === 'Tab'){
      var focusable = Array.prototype.slice.call(
        document.querySelectorAll('#doc-viewer-open, #doc-viewer-close, .doc-viewer-download-link')
      ).filter(function(el){ return el.offsetParent !== null; });
      if (focusable.length === 0) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first){
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last){
        e.preventDefault();
        first.focus();
      }
    }
  });
})();