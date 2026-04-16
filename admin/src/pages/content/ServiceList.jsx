import React, { useState } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, InputNumber, Switch, Upload, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'

function ServiceList() {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, name: '基因类型测评', price: 199, originalPrice: 399, sales: 1234, status: true, image: 'https://via.placeholder.com/200' },
    { id: 2, name: '个性化健康方案', price: 299, originalPrice: 599, sales: 856, status: true, image: 'https://via.placeholder.com/200' },
    { id: 3, name: '专家咨询', price: 99, originalPrice: 199, sales: 432, status: false, image: 'https://via.placeholder.com/200' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '图片', dataIndex: 'image', key: 'image', render: (src) => <img src={src} alt="service" style={{ width: 60, height: 60, objectFit: 'cover' }} /> },
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { title: '现价', dataIndex: 'price', key: 'price', render: (val) => `¥${val}` },
    { title: '原价', dataIndex: 'originalPrice', key: 'originalPrice', render: (val) => `¥${val}` },
    { title: '销量', dataIndex: 'sales', key: 'sales' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Switch checked={status} />
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

  const handleEdit = (record) => {
    form.setFieldsValue(record)
    setVisible(true)
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">服务管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setVisible(true); }}>添加服务</Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="服务"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => { setVisible(false); message.success('保存成功'); }}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="服务名称" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          <Form.Item label="服务图片" name="image">
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
          <Space style={{ width: '100%' }}>
            <Form.Item label="现价" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="¥" placeholder="现价" />
            </Form.Item>
            <Form.Item label="原价" name="originalPrice" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="¥" placeholder="原价" />
            </Form.Item>
          </Space>
          <Form.Item label="服务描述" name="description">
            <Input.TextArea rows={4} placeholder="请输入服务描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ServiceList
