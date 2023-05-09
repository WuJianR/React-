import { Layout, Menu, Popconfirm } from "antd";
import {
  HomeOutlined,
  DiffOutlined,
  EditOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useStore } from "@/store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

const { Header, Sider } = Layout;

function LayOut() {
  const location = useLocation();
  const { userStore, loginStore } = useStore();
  const navigate = useNavigate();
  // console.log(location);

  // 发送获取用户数据的请求
  useEffect(() => {
    userStore.getUserInfo();
  }, [userStore]);

  // 确定退出登录
  function loginOutConfirm() {
    loginStore.loginOut();
    navigate("/login");
  }
  // 取消退出登录
  function loginOutCancel() {}
  return (
    <Layout>
      <Header className="header">
        <div className="logo">
          {/* <img src={userStore.userInfo.photo} alt=""></img> */}
        </div>
        <div className="user-info">
          <span className="user-name">{userStore.userInfo.name}</span>
          <span className="user-logout">
            <Popconfirm
              title="是否确认退出？"
              okText="退出"
              cancelText="取消"
              onConfirm={loginOutConfirm}
              onCancel={loginOutCancel}
            >
              <LogoutOutlined />
              退出
            </Popconfirm>
          </span>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            theme="dark"
            defaultSelectedKeys={[location.pathname]}
            style={{ height: "100%", borderRight: 0 }}
          >
            <Menu.Item icon={<HomeOutlined />} key="/">
              <Link to={"/"}>数据概览</Link>
            </Menu.Item>
            <Menu.Item icon={<DiffOutlined />} key="/article">
              <Link to={"/article"}>内容管理</Link>
            </Menu.Item>
            <Menu.Item icon={<EditOutlined />} key="/publish">
              <Link to={"/publish"}>发布文章</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className="layout-content" style={{ padding: 20 }}>
          <Outlet></Outlet>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default observer(LayOut);
