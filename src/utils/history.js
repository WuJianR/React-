// 该工具方法是实现
// 在组件之外也能跳转路由
// react在组件之外无法使用useNavigate()实现路由跳转，因此需要此工具方法

import { createBrowserHistory } from "history";

let history = createBrowserHistory();

export default history;
