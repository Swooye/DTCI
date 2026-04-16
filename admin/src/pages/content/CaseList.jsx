import React, { useState } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Select, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function CaseList() {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, title: '基因检测改变了他的生活', author: '张三', geneType: 'INTJ', views: 1234, likes: 56, status: 'published', time: '2024-05-15' },
    { id: 2, title: '我的健康管理之路', author: '李四', geneType: 'ENFP', views: 856, likes: 32, status: 'published', time: '2024-05-12' },
    { id: 3, title: '基因报告解读分享', author: '王五', geneType: 'ISTJ', views: 0, likes: 0, status: 'draft', time: '2024-05-20' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '作者', dataIndex: 'author', key: 'author' },
    { title: '基因类型', dataIndex: 'geneType', key: 'geneType', render: (type) => <Tag color="blue">{type}</Tag> },
    { title: '浏览', dataIndex: 'views', key: 'views' },
    { title: '点赞', dataIndex: 'likes', key: 'likes' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'default'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      )
    },
    { title: '时间', dataIndex: 'time', key: 'time' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => setVisible(true)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">案例管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>添加案例</Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="案例"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => { setVisible(false); }}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="基因类型" name="geneType" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Select.Option value="INTJ">INTJ</Select.Option>
              <Select.Option value="ENFP">ENFP</Select.Option>
              <Select.Option value="ISTJ">ISTJ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="内容" name="content" rules={[{ required: true }]}>
            <Input.TextArea rows={6} placeholder="请输入案例内容" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CaseList
