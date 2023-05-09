import { Link } from "react-router-dom";
import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  DatePicker,
  Select,
  Table,
  Tag,
  Space,
  Popconfirm,
} from "antd";
import "dayjs/locale/zh-cn";
import locale from "antd/es/date-picker/locale/zh_CN";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import "./index.scss";
import img404 from "@/assets/error.png";
import { useEffect, useState } from "react";
import { http } from "@/utils";
import history from "@/utils/history";

const { Option } = Select;
const { RangePicker } = DatePicker;

const Article = () => {
  // 频道列表管理
  const [channelList, setChannelList] = useState([]);
  const loadChannelList = async () => {
    const res = await http.get("/channels");
    setChannelList(res.data.channels);
  };
  const onFinish = (value) => {
    // console.log(value);
    const { status, channel_id, date } = value;
    // 格式化表单数据
    const _params = {};
    // 格式化status
    _params.status = status;
    if (channel_id) {
      _params.channel_id = channel_id;
    }
    if (date) {
      _params.begin_pubdate = date[0].format("YYYY-MM-DD");
      _params.end_pubdate = date[1].format("YYYY-MM-DD");
    }
    // 修改params参数 触发接口再次发起
    setParams({
      ...params,
      ..._params,
    });
  };
  // 文章列表管理(表格数据)
  const [list, setList] = useState({
    list: [], // 文章列表
    count: 0, // 文章数量
  });
  // 文章参数管理
  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
  });

  // 翻页触发事件
  const pageChange = (page) => {
    setParams({
      ...params,
      page,
    });
  };
  // 调用接口 渲染dom
  useEffect(() => {
    loadChannelList();
  }, []);
  // 如果异步请求函数需要依赖一些数据的变化而重新执行，推荐把它写到副作用函数的内部
  useEffect(() => {
    async function fetchArticleList() {
      const res = await http.get("/mp/articles", { params });
      // console.log(res);
      const { results, total_count } = res.data;
      setList({
        list: results,
        count: total_count,
      });
    }
    fetchArticleList();
  }, [params]);
  // 删除文章
  const delArticle = async (id) => {
    await http.delete(`/mp/articles/${id}`);
    // 更新列表
    setParams({
      page: 1,
      per_page: 10,
    });
  };
  // 表格列
  const columns = [
    {
      title: "封面",
      dataIndex: "cover",
      width: 120,
      render: (cover) => {
        return <img src={cover || img404} width={80} height={60} alt=""></img>;
      },
    },
    {
      title: "标题",
      dataIndex: "title",
      width: 220,
    },
    {
      title: "状态",
      dataIndex: "status",
      render: (data) => <Tag color="green">审核通过</Tag>,
    },
    {
      title: "发布时间",
      dataIndex: "pubdate",
    },
    {
      title: "阅读数",
      dataIndex: "read_count",
    },
    {
      title: "评论数",
      dataIndex: "comment_count",
    },
    {
      title: "点赞数",
      dataIndex: "like_count",
    },
    {
      title: "操作",
      render: (data) => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                history.push(`/publish?id=${data.id}`);
              }}
            ></Button>
            <Popconfirm
              title="确定删除该条文章吗？"
              onConfirm={() => delArticle(data.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                danger
                shape="circle"
                icon={<DeleteOutlined />}
              ></Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  return (
    <div>
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>内容管理</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form initialValues={{ status: -1 }} onFinish={onFinish}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={-1}>全部</Radio>
              <Radio value={0}>草稿</Radio>
              <Radio value={1}>待审核</Radio>
              <Radio value={2}>审核通过</Radio>
              <Radio value={3}>审核失败</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="频道" name="channel_id">
            <Select placeholder="请选择文章频道" style={{ width: 120 }}>
              {channelList.map((channel) => {
                return (
                  <Option value={channel.name} key={channel.id}>
                    {channel.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="日期" name="date">
            {/* 传入locale属性，控制中文显示 */}
            <RangePicker locale={locale}></RangePicker>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card title={`根据筛选条件共查询到 ${list.count} 条结果`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list.list}
          pagination={{
            pageSize: params.per_page,
            total: list.count,
            onChange: pageChange,
          }}
        ></Table>
      </Card>
    </div>
  );
};

export default Article;
