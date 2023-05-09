// 封装ls存取token

const key = "pc-key";

const setToken = (token) => {
  window.localStorage.setItem(key, token);
  return;
};

const getToken = () => {
  return window.localStorage.getItem(key);
};

const removeToken = () => {
  window.localStorage.removeItem(key);
  return;
};

export { setToken, getToken, removeToken };
