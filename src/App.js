import { Route, Routes } from "react-router-dom";
// 导入实现在组件外实现路由跳转的包
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "./utils/history";

import { AnthComponent } from "@comp/AuthComponent";
// import LayOut from "@/pages/Layout";
// import Login from "@/pages/Login";
// import Publish from "./pages/Publish";
// import Home from "./pages/Home";
// import Article from "./pages/Article";
import "./App.css";
// 导入路由懒加载必要组件
import { lazy, Suspense } from "react";
// 按需导入路由组件
const Login = lazy(() => import("./pages/Login"));
const LayOut = lazy(() => import("./pages/LayOut"));
const Article = lazy(() => import("./pages/Article"));
const Home = lazy(() => import("./pages/Home"));
const Publish = lazy(() => import("./pages/Publish"));

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        {/* 路由懒加载  */}
        <Suspense
          fallback={
            <div style={{ textAlign: "center", marginTop: 200 }}>
              loading...
            </div>
          }
        >
          <Routes>
            {/* 不需要鉴权的组件 */}
            <Route path="/Login" element={<Login></Login>}></Route>
            {/* 需要鉴权的组件 */}
            <Route
              path="/"
              element={
                <AnthComponent>
                  <LayOut></LayOut>
                </AnthComponent>
              }
            >
              {/* 二级路由默认页面 */}
              <Route index element={<Home></Home>}></Route>
              <Route path="article" element={<Article></Article>}></Route>
              <Route path="publish" element={<Publish></Publish>}></Route>
            </Route>
          </Routes>
        </Suspense>
      </div>
    </HistoryRouter>
  );
}

export default App;
