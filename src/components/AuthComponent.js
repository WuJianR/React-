// 1.判断token是否存在
// 2.存在则正常渲染
// 3.不存在则重定向到登录路由

// 高阶组件：把一个组件当成另一个组件的参数传入
// 然后通过一定的判断，返回新的组件

import { getToken } from "@/utils";
import { Navigate } from "react-router-dom";

function AnthComponent({ children }) {
  const isToken = getToken();
  if (isToken) {
    return <>{children}</>;
  } else {
    return <Navigate to="/login"></Navigate>;
  }
}

// 例子
// 假如：<AuthComponent><Layout/></AuthComponent>
// 登录：<><Layout></Layout>
// 未登录：<Navigate to="/login" replace />

export { AnthComponent };
