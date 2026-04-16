import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

function QuestionBank() {
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  const dataSource = [
    { id: 1, question: '您是否有家族遗传病史？', type: 'single', options: 4, difficulty: 'easy', geneType: 'gene' },
    { id: 2, question: '您每天的运动时长是多少？', type: 'single', options: 4, difficulty: 'medium', geneType: 'health' },
    { id: 3, question: '您的饮食习惯属于以下哪种？', type: 'multiple', options: 5, difficulty: 'medium', geneType: 'lifestyle' },
    { id: 4, question: '请描述您的睡眠质量情况', type: 'text', options: 0, difficulty: 'easy', geneType: 'nutrition' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '题目', dataIndex: 'question', key: 'question', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        const typeMap = {
          single: { label: '单选', color: 'blue' },
          multiple: { label: '多选', color: 'green' },
          text: { label: '文本', color: 'orange' }
        }
        return <Tag color={typeMap[type].color}>{typeMap[type].label}</Tag>
      }
    },
    { title: '选项数', dataIndex: 'options', key: 'options' },
    {
      title: '难度',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff) => {
        const diffMap = { easy: '简单', medium: '中等', hard: '困难' }
        const colorMap = { easy: 'green', medium: 'orange', hard: 'red' }
        return <Tag color={colorMap[diff]}>{diffMap[diff]}</Tag>
      }
    },
    { title: '基因类型', dataIndex: 'geneType', key: 'geneType' },
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
        <h1 className="page-title">题库管理</h1>
        <Space>
          <Input placeholder="搜索题目" style={{ width: 200 }} />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>添加题目</Button>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="添加题目"
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="题目类型" name="type" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Select.Option value="single">单选</Select.Option>
              <Select.Option value="multiple">多选</Select.Option>
              <Select.Option value="text">文本</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="题目内容" name="question" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="请输入题目内容" />
          </Form.Item>
          <Form.Item label="难度" name="difficulty" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Select.Option value="easy">简单</Select.Option>
              <Select.Option value="medium">中等</Select.Option>
              <Select.Option value="hard">困难</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="基因类型" name="geneType" rules={[{ required: true }]}>
            <Select placeholder="请选择">
              <Select.Option value="gene">基因类型</Select.Option>
              <Select.Option value="health">健康风险</Select.Option>
              <Select.Option value="lifestyle">生活方式</Select.Option>
              <Select.Option value="nutrition">营养需求</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default QuestionBank
