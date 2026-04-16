import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, Steps, Radio } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function Questionnaire() {
  const [visible, setVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, name: '基因类型测评问卷', type: 'gene', questions: 50, status: 'published', createTime: '2024-01-15' },
    { id: 2, name: '健康风险评估问卷', type: 'health', questions: 40, status: 'draft', createTime: '2024-02-20' },
    { id: 3, name: '生活方式问卷', type: 'lifestyle', questions: 30, status: 'published', createTime: '2024-03-10' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '问卷名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => <Tag>{type}</Tag> },
    { title: '题目数', dataIndex: 'questions', key: 'questions' },
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
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
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

  const steps = [
    { title: '基本信息', description: '设置问卷名称和类型' },
    { title: '选择题目', description: '从题库选择题目' },
    { title: '测评设置', description: '设置测评参数' },
    { title: '发布', description: '发布问卷' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">问卷管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>创建问卷</Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="创建问卷"
        open={visible}
        onCancel={() => { setVisible(false); setCurrentStep(0); }}
        width={800}
        footer={null}
      >
        <Steps current={currentStep} items={steps} style={{ marginBottom: 24 }} />
        
        {currentStep === 0 && (
          <Form form={form} layout="vertical">
            <Form.Item label="问卷名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入问卷名称" />
            </Form.Item>
            <Form.Item label="问卷类型" name="type" rules={[{ required: true }]}>
              <Select placeholder="请选择类型">
                <Select.Option value="gene">基因类型</Select.Option>
                <Select.Option value="health">健康风险</Select.Option>
                <Select.Option value="lifestyle">生活方式</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="描述" name="description">
              <Input.TextArea rows={4} placeholder="请输入问卷描述" />
            </Form.Item>
          </Form>
        )}

        {currentStep === 1 && (
          <div>
            <Input placeholder="搜索题目" prefix={<span>🔍</span>} style={{ marginBottom: 16 }} />
            <Table
              columns={[
                { title: '选择', dataIndex: 'selected', render: () => <Radio /> },
                { title: '题目', dataIndex: 'question', key: 'question' },
                { title: '类型', dataIndex: 'type', key: 'type' }
              ]}
              dataSource={[]}
              rowKey="id"
              pagination={false}
            />
          </div>
        )}

        {currentStep === 2 && (
          <Form layout="vertical">
            <Form.Item label="测评时长（分钟）" name="duration">
              <Input type="number" placeholder="30" />
            </Form.Item>
            <Form.Item label="通过分数" name="passScore">
              <Input type="number" placeholder="60" />
            </Form.Item>
          </Form>
        )}

        {currentStep === 3 && (
          <div style={{ textAlign: 'center', padding: 24 }}>
            <h3>问卷已创建完成！</h3>
            <p>点击发布后将立即生效</p>
          </div>
        )}

        <Space style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
          {currentStep > 0 && <Button onClick={() => setCurrentStep(currentStep - 1)}>上一步</Button>}
          {currentStep < 3 && <Button type="primary" onClick={() => setCurrentStep(currentStep + 1)}>下一步</Button>}
          {currentStep === 3 && <Button type="primary" onClick={() => setVisible(false)}>发布</Button>}
        </Space>
      </Modal>
    </div>
  )
}

export default Questionnaire
