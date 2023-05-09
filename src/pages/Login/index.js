import { useNavigate } from "react-router-dom";
import { Card, Form, Input, Checkbox, Button, message } from "antd";
import logo from "@/assets/logo.png";
import "./index.scss";
import { useStore } from "@/store";

function Login() {
  const { loginStore } = useStore();
  const navigate = useNavigate();
  async function onFinish(values) {
    // values：放置的是所有表单项中用户输入的内容
    // console.log(values);
    await loginStore.getToken({
      mobile: values.mobile,
      code: values.code,
    });
    // 跳转首页
    navigate("/", { replace: true });
    // 提示用户
    message.success("登录成功");
  }
  function onFinishFailed(errorInfo) {
    // console.log(errorInfo);
  }
  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt=""></img>
        {/* 登录表单 */}
        <Form
          validateTrigger={["onBlur", "onChange"]}
          initialValues={{
            remember: true,
            mobile: "13811111111",
            code: "246810",
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: "请输入手机号" },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: "请输入正确的手机号",
                validateTrigger: "onBlur",
              },
            ]}
          >
            <Input size="large" placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[
              { required: true, message: "请输入密码" },
              { len: 6, message: "请输入6位密码", validateTrigger: "onBlur" },
            ]}
          >
            <Input placeholder="请输入验证码" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox className="login-checkbox-label">
              我已阅读并同意「用户协议」和「隐私条款」
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Login;
