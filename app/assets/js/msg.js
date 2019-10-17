export { showMsg };

const msgbox = document.getElementById('msgbox');
const msg = document.getElementById('msg');

function showMsg(text) {
  msg.innerHTML = text;
  msgbox.classList.remove("no-display");
}
