(function(win, doc) {
  var form = doc.getElementsByTagName('form')[0];
  var spinner = doc.getElementById('spinner');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    showSpin();

    // Grab the form elements, do equivalent of $('form').serialize().
    var title = document.getElementById('report-title');
    var content = document.getElementById('report-content');
    var payload = [
      title.name + '=' + encodeURIComponent(title.value),
      content.name + '=' + encodeURIComponent(content.value)
    ].join('&');

    var post = new XMLHttpRequest();
    post.open('POST', '/pdf');
    post.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    post.responseType = 'arraybuffer';
    post.addEventListener('load', function(postEvent) {
      hideSpin();
      if (post.response) {
        var blob = new Blob([post.response], {type: 'application/pdf'});
        saveAs(blob, post.getResponseHeader('X-Filename'));
      } else {
        console.log('XHR POST loaded but no post.response. Something failed.');
      }
    });
    post.send(payload);
  });

  function showSpin() {
    spinner.style.display = "block";
  }
  function hideSpin() {
    spinner.style.display = "none";
  }
})(window, window.document);
