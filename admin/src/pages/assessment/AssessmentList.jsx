import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, message } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function AssessmentList() {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, name: '基因类型测评', type: 'gene', questions: 50, duration: 30, status: 'online', participants: 1234 },
    { id: 2, name: '健康风险评估', type: 'health', questions: 40, duration: 25, status: 'online', participants: 856 },
    { id: 3, name: '生活方式测评', type: 'lifestyle', questions: 30, duration: 20, status: 'offline', participants: 432 },
    { id: 4, name: '营养需求测评', type: 'nutrition', questions: 35, duration: 25, status: 'draft', participants: 0 }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '测评名称', dataIndex: 'name', key: 'name' },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          gene: { label: '基因类型', color: 'blue' },
          health: { label: '健康风险', color: 'green' },
          lifestyle: { label: '生活方式', color: 'orange' },
          nutrition: { label: '营养需求', color: 'purple' }
        }
        return <Tag color={typeMap[type].color}>{typeMap[type].label}</Tag>
      }
    },
    { title: '题目数', dataIndex: 'questions', key: 'questions' },
    { title: '时长(分钟)', dataIndex: 'duration', key: 'duration' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          online: { label: '已上线', color: 'green' },
          offline: { label: '已下线', color: 'red' },
          draft: { label: '草稿', color: 'default' }
        }
        return <Tag color={statusMap[status].color}>{statusMap[status].label}</Tag>
      }
    },
    { title: '参与人数', dataIndex: 'participants', key: 'participants' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    }
  ]

  const handleAdd = () => {
    form.resetFields()
    setVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      message.success('创建成功')
      setVisible(false)
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">测评管理</h1>
        <Space>
          <Input placeholder="搜索测评" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加测评</Button>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="添加测评"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="测评名称" rules={[{ required: true }]}>
            <Input placeholder="请输入测评名称" />
          </Form.Item>
          <Form.Item name="type" label="测评类型" rules={[{ required: true }]}>
            <Select placeholder="请选择类型">
              <Select.Option value="gene">基因类型</Select.Option>
              <Select.Option value="health">健康风险</Select.Option>
              <Select.Option value="lifestyle">生活方式</Select.Option>
              <Select.Option value="nutrition">营养需求</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="description" label="测评描述">
            <Input.TextArea rows={4} placeholder="请输入测评描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AssessmentList
