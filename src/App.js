import { Route, Routes } from "react-router-dom";
// 导入实现在组件外实现路由跳转的包
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import history from "./utils/history";

import { AnthComponent } from "@comp/AuthComponent";
import LayOut from "@/pages/Layout";
import Login from "@/pages/Login";
import Publish from "./pages/Publish";
import Home from "./pages/Home";
import Article from "./pages/Article";

import "./App.css";

function App() {
  return (
    // 路由配置
    <HistoryRouter history={history}>
      <div className="App">
        <Routes>
          <Route path="/Login" element={<Login></Login>}></Route>
          <Route
            path="/"
            element={
              <AnthComponent>
                <LayOut></LayOut>
              </AnthComponent>
            }
          >
            <Route index element={<Home></Home>}></Route>
            <Route path="article" element={<Article></Article>}></Route>
            <Route path="publish" element={<Publish></Publish>}></Route>
          </Route>
        </Routes>
      </div>
    </HistoryRouter>
  );
}

export default App;
