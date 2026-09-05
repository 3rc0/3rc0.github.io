(function(){
  var lessons = window.TRAINING_DATA || [];
  var categoryOrder = [
    "System Virtualization & OS Installation",
    "Cloud Computing (AWS)",
    "Linux Systems & Server Administration",
    "Designcenter Solid Edge — Practical Training Course",
    "Embedded Systems (Arduino)"
  ];

  var grouped = {};
  lessons.forEach(function(l){
    if (!grouped[l.category]) grouped[l.category] = [];
    grouped[l.category].push(l);
  });

  var sidebar = document.getElementById('sidebar');
  var player = document.getElementById('training-player');
  var codeEl = document.getElementById('training-code');
  var titleEl = document.getElementById('training-title');

  function loadLesson(item, rowEl){
    player.src = 'https://www.youtube.com/embed/' + item.video_id;
    player.title = item.title;
    codeEl.textContent = item.code;
    titleEl.textContent = item.title;
    document.querySelectorAll('.lesson-row').forEach(function(r){
      r.classList.remove('selected');
      r.setAttribute('aria-current', 'false');
      var chk = r.querySelector('.fa-check');
      if (chk) chk.remove();
    });
    rowEl.classList.add('selected');
    rowEl.setAttribute('aria-current', 'true');
    var mark = document.createElement('i');
    mark.className = 'fas fa-check';
    mark.setAttribute('aria-hidden', 'true');
    rowEl.prepend(mark);
  }

  categoryOrder.forEach(function(catName, ci){
    var items = grouped[catName];
    if (!items || items.length === 0) return;

    var header = document.createElement('button');
    header.className = 'cat-header';
    header.setAttribute('aria-expanded', ci === 0 ? 'true' : 'false');
    header.innerHTML = '<span>' + catName + '</span><i class="fas fa-chevron-down" aria-hidden="true"></i>';

    var group = document.createElement('div');
    group.className = 'lesson-group' + (ci === 0 ? ' open' : '');
    group.setAttribute('role', 'group');

    items.forEach(function(item, ii){
      var row = document.createElement('button');
      row.className = 'lesson-row';
      row.textContent = item.title;
      row.addEventListener('click', function(){ loadLesson(item, row); });
      group.appendChild(row);
      if (ci === 0 && ii === 0){ loadLesson(item, row); }
    });

    header.addEventListener('click', function(){
      var open = group.classList.contains('open');
      group.classList.toggle('open', !open);
      header.setAttribute('aria-expanded', open ? 'false' : 'true');
    });

    sidebar.appendChild(header);
    sidebar.appendChild(group);
  });
})();