'use strict';

(function() {
  var l;

  window.__karma__.loaded = function() {
    window.addEventListener('polymer-ready', function() {
      window.__karma__.start();
    });
  };

  l = document.createElement('link');
  l.rel = 'import';
  l.href = '/base/client/components/mock-ajax/mock-ajax.html';
  document.head.appendChild(l);

  l = document.createElement('link');
  l.rel = 'import';
  l.href = '/base/client/webcomponents/nn-annotable.html';
  document.head.appendChild(l);
})();
