import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
// 导入富文本编辑器相关组件和样式
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./index.scss";
import { http } from "@/utils";
import { useEffect, useRef, useState } from "react";
// 导入存有channels列表的仓库
import { useStore } from "@/store";
// 导入仓库和react链接的中间件
import { observer } from "mobx-react-lite";

const { Option } = Select;

const Publish = () => {
  const navigate = useNavigate();
  // 存储已上传封面图片地址
  const [fileList, setFileList] = useState([]);
  // 解构出频道仓库
  const { channelsStore } = useStore();
  // 使用useRef声明一个暂存仓库
  const cacheImgList = useRef();
  // 上传图片事件
  const onUploadChange = (info) => {
    // console.log(info);
    const fileList = info.fileList.map((file) => {
      if (file.response) {
        return {
          url: file.response.data.url,
        };
      }
      return file;
    });
    setFileList(fileList);
    // 同时把图片列表存入仓库一份
    cacheImgList.current = fileList;
  };
  // 获取频道列表
  useEffect(() => {
    channelsStore.getChannels();
  }, [channelsStore]);
  // 封面单图、三图、无图 选项变化触发的事件
  const [imgCount, setImageCount] = useState(1);
  const radioChange = (e) => {
    // console.log(e.target.value);
    setImageCount(e.target.value);
    // console.log(imgCount);
    // 从仓库里面取对应的图片数量，交给我们用来渲染图片列表的fileList
    // 通过调用setFileList
    if (e.target.value === 1) {
      setFileList(cacheImgList.current);
    } else if (imgCount === 3) {
      const img = cacheImgList.current ? cacheImgList.current[0] : [];
      setFileList([img]);
    }
  };
  // 表单提交
  const onFinish = async (form) => {
    // console.log(form);
    const params = {
      ...form,
      cover: {
        type: form.type,
        images: fileList.map((item) => item.url),
      },
    };
    // console.log(params);
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params);
    } else {
      await http.post("/mp/articles?draft=false", params);
    }
    // 跳转列表，提示用户
    navigate("/article");
    message.success(`${id ? "更新成功" : "发布成功"}`);
  };

  // 编辑功能
  // 文案适配 路由参数id 判断条件
  const [params] = useSearchParams();
  const id = params.get("id");
  // console.log("route", id);

  // 数据回填 id调用接口 1.表单回填 2.暂存列表 3.Upload组件fileList
  const form = useRef(null);
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`);
      // console.log(res);
      const data = res.data;
      // 表单数据回传
      form.current.setFieldsValue({ ...data, type: data.cover.type });
      // 调用setFileList方法回填upload
      const formatImgList = data.cover.images.map((url) => {
        return {
          url,
        };
      });
      setFileList(formatImgList);
      // 暂存列表里也存一份
      cacheImgList.current = formatImgList;
    };
    // 必须是编辑状态 才可以发送请求
    if (id) {
      loadDetail();
      // console.log(form.current);
    }
  }, [id]);
  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? "编辑" : "发布"}文章</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: "this is content" }}
          onFinish={onFinish}
          ref={form}
        >
          <Form.Item
            label="标题"
            name="title"
            rules={[{ required: true, message: "请输入文章标题" }]}
          >
            <Input placeholder="请输入文章标题" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="频道"
            name="channel_id"
            rules={[{ required: true, message: "请选择文章频道" }]}
          >
            <Select placeholder="请选择文章频道" style={{ width: 400 }}>
              {channelsStore.channelsList.map((channel) => {
                return (
                  <Option value={channel.name} key={channel.id}>
                    {channel.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="封面">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>单图</Radio>
                <Radio value={3}>三图</Radio>
                <Radio value={0}>无图</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                maxCount={imgCount}
                multiple={imgCount > 1 ? true : false}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}
          </Form.Item>
          <Form.Item
            label="内容"
            name="content"
            rules={[{ required: true, message: "请输入文章内容" }]}
          >
            <ReactQuill
              className="publish-quill"
              theme="snow"
              placeholder="请输入文章内容"
            ></ReactQuill>
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? "编辑" : "发布"}文章
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default observer(Publish);
