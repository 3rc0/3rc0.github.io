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