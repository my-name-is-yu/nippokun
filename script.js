console.log("JavaScriptが読み込まれました！");

// h1タグをクリックしたらアラートを出す
const heading = document.querySelector('h1');
heading.addEventListener('click', () => {
  alert('H1がクリックされました！');
});