export { storeJson, getJson };

function storeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getJson(key) {
  return JSON.parse(localStorage.getItem(key));
}
