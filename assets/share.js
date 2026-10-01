(function () {
  var root = document.querySelector('[data-id]');
  var url = root.dataset.url, img = root.dataset.img, wish = root.dataset.wish, id = root.dataset.id;
  var text = 'Новогодняя открытка для тебя: «' + wish + '»';
  var e = encodeURIComponent;
  var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  document.getElementById('hint').style.display = isIOS ? 'block' : 'none';

  document.getElementById('tg').href = 'https://t.me/share/url?url=' + e(url) + '&text=' + e(text);
  document.getElementById('wa').href = 'https://wa.me/?text=' + e(text + ' ' + url);
  document.getElementById('vk').href = 'https://vk.com/share.php?url=' + e(url) + '&title=' + e(text);
  document.getElementById('ok').href = 'https://connect.ok.ru/offer?url=' + e(url) + '&title=' + e(text);
  document.getElementById('fb').href = 'https://www.facebook.com/sharer/sharer.php?u=' + e(url);

  function toast(msg) {
    var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }
  function copy() {
    var done = function () { toast('Ссылка скопирована'); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, fallback); else fallback();
    function fallback() {
      var ta = document.createElement('textarea'); ta.value = url; document.body.appendChild(ta);
      ta.select(); try { document.execCommand('copy'); done(); } catch (x) {} ta.remove();
    }
  }
  // Системное меню «Поделиться»: в нём есть все установленные мессенджеры — Max, Telegram, WhatsApp...
  // Сначала пробуем отправить саму картинку, если нельзя — ссылку.
  function share(fallbackMsg) {
    if (!navigator.share) { copy(); if (fallbackMsg) toast(fallbackMsg); return; }
    fetch(img).then(function (r) { return r.blob(); }).then(function (b) {
      var file = new File([b], 'otkrytka-' + id + '.jpg', { type: 'image/jpeg' });
      var data = { files: [file], title: 'Новогодняя открытка', text: text + ' ' + url };
      if (navigator.canShare && navigator.canShare(data)) return navigator.share(data);
      return navigator.share({ title: 'Новогодняя открытка', text: text, url: url });
    }).catch(function () {
      navigator.share({ title: 'Новогодняя открытка', text: text, url: url }).catch(function () {});
    });
  }
  document.getElementById('share').onclick = function () { share(); };
  document.getElementById('max').onclick = function () { share('Ссылка скопирована — вставьте её в чат Max'); };
  document.getElementById('copy').onclick = copy;
})();
