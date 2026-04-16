import React, { useState } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Switch, Upload, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'

function BannerList() {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, title: '基因检测优惠', image: 'https://via.placeholder.com/750x300', link: '/pages/detail?id=1', status: true, sort: 1 },
    { id: 2, title: '健康讲座', image: 'https://via.placeholder.com/750x300', link: '/pages/lecture?id=1', status: true, sort: 2 },
    { id: 3, title: '新品上线', image: 'https://via.placeholder.com/750x300', link: '/pages/product?id=1', status: false, sort: 3 }
  ]

  const columns = [
    { title: '排序', dataIndex: 'sort', key: 'sort', width: 80 },
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '图片', dataIndex: 'image', key: 'image', render: (src) => <img src={src} alt="banner" style={{ width: 100, height: 40, objectFit: 'cover' }} /> },
    { title: '跳转链接', dataIndex: 'link', key: 'link', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch checked={status} onChange={() => handleStatusChange(record)} />
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    }
  ]

  const handleStatusChange = (record) => {
    message.success(`已${record.status ? '禁用' : '启用'}`)
  }

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setVisible(true)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">轮播图管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>添加轮播图</Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="轮播图"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => { setVisible(false); message.success('保存成功'); }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          <Form.Item label="图片" name="image" rules={[{ required: true }]}>
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item label="跳转链接" name="link" rules={[{ required: true }]}>
            <Input placeholder="请输入跳转链接" />
          </Form.Item>
          <Form.Item label="排序" name="sort" initialValue={1}>
            <Input type="number" placeholder="数字越小越靠前" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default BannerList
