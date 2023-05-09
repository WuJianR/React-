import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// 引入antd样式文件
import "antd/dist/reset.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
