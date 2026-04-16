import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Form, Select, DatePicker, Avatar } from 'antd'
import { SearchOutlined, EyeOutlined, FilterOutlined, FileTextOutlined } from '@ant-design/icons'
import './UserAssessment.css'

const { RangePicker } = DatePicker;

function UserAssessment() {
  const [form] = Form.useForm();

  const dataSource = [
    { 
      id: "0035432", 
      userAvatar: '/assets/images/founder.jpg',
      userName: '小刀',
      assessmentName: 'DTCI 135型人格测评 评 男生版',
      d_gene: 10.00,
      t_gene: 10.00,
      c_gene: 10.00,
      b_gene: 10.00,
      i_gene: 10.00,
      io_gene: 10.00,
      type_gene: 10.00,
      layer_gene: 10.00,
      amount: 88.00,
      status: 'paid',
      time: '2024-05-20 10:30'
    },
    { 
      id: "0035433", 
      userAvatar: '/assets/images/founder.jpg',
      userName: '小刀',
      assessmentName: 'DTCI 135型人格测评 评 女生版',
      d_gene: 10.00,
      t_gene: 10.00,
      c_gene: 10.00,
      b_gene: 10.00,
      i_gene: 10.00,
      io_gene: 10.00,
      type_gene: 10.00,
      layer_gene: 10.00,
      amount: 88.00,
      status: 'pending',
      time: '2024-05-20 11:45'
    }
  ]

  const columns = [
    { title: '订单编号', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      render: (text, record) => (
        <Space>
          <Avatar src={record.userAvatar} size="small" />
          <span>{text}</span>
        </Space>
      )
    },
    { title: '测评问卷名称', dataIndex: 'assessmentName', key: 'assessmentName', width: 220 },
    { title: 'D型基因', dataIndex: 'd_gene', key: 'd_gene', width: 80, render: v => v.toFixed(2) },
    { title: 'T型基因', dataIndex: 't_gene', key: 't_gene', width: 80, render: v => v.toFixed(2) },
    { title: 'C型基因', dataIndex: 'c_gene', key: 'c_gene', width: 80, render: v => v.toFixed(2) },
    { title: 'B型基因', dataIndex: 'b_gene', key: 'b_gene', width: 80, render: v => v.toFixed(2) },
    { title: 'I型基因', dataIndex: 'i_gene', key: 'i_gene', width: 80, render: v => v.toFixed(2) },
    { title: 'I+O基因', dataIndex: 'io_gene', key: 'io_gene', width: 80, render: v => v.toFixed(2) },
    { title: '型基因', dataIndex: 'type_gene', key: 'type_gene', width: 80, render: v => v.toFixed(2) },
    { title: '层基因', dataIndex: 'layer_gene', key: 'layer_gene', width: 100, render: v => v.toFixed(2) },
    { title: '订单金额', dataIndex: 'amount', key: 'amount', render: v => `¥${v.toFixed(2)}` },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={s === 'paid' ? 'green' : 'orange'}>{s === 'paid' ? '已支付' : '待支付'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" size="small" icon={<FileTextOutlined />}>导出</Button>
        </Space>
      )
    }
  ]

  return (
    <div className="user-assessment-container">
      <Card className="filter-card">
        <Form form={form} layout="inline">
          <Form.Item name="source" label="默认筛选方">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="keyword">
            <Input placeholder="输入编号/用户/手机" prefix={<SearchOutlined />} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item name="paper" label="问卷名称">
            <Select placeholder="请选择" style={{ width: 180 }}>
              <Select.Option value="1">DTCI 135型人格测评</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="订单状态">
            <Select placeholder="请选择" style={{ width: 120 }}>
              <Select.Option value="paid">已支付</Select.Option>
              <Select.Option value="pending">待支付</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="time" label="提交时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>

          <Form.Item name="operator" label="操作人">
            <Select placeholder="请选择" style={{ width: 120 }}>
              <Select.Option value="admin1">管理员1</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" icon={<FilterOutlined />} style={{ background: '#3BA38E' }}>
            筛选
          </Button>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          scroll={{ x: 1600 }}
          pagination={{ total: 100 }}
        />
      </Card>
    </div>
  )
}

export default UserAssessment
