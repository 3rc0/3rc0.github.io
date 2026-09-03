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

  function openViewer(file, type, name, triggerEl){
    lastTrigger = triggerEl;
    title.textContent = name;
    openLink.href = file;
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
      openViewer(card.dataset.file, card.dataset.type, card.dataset.name, card);
    });
    card.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        openViewer(card.dataset.file, card.dataset.type, card.dataset.name, card);
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

    // simple focus trap: only openLink and closeBtn are focusable inside the viewer
    if (e.key === 'Tab'){
      var focusable = [openLink, closeBtn];
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