import React from 'react'
import { Table, Tag, Button, Input, Space, Card, Select, DatePicker, Statistic, Row, Col } from 'antd'
import { SearchOutlined, ExportOutlined } from '@ant-design/icons'

function Commission() {
  const dataSource = [
    { id: 1, orderId: 'ORD20240520001', user: '张三', distributor: '张分销', amount: 199, commission: 19.9, rate: '10%', status: 'settled', time: '2024-05-20 10:30' },
    { id: 2, orderId: 'ORD20240520002', user: '李四', distributor: '李分销', amount: 99, commission: 9.9, rate: '10%', status: 'settled', time: '2024-05-20 11:20' },
    { id: 3, orderId: 'ORD20240521001', user: '王五', distributor: '张分销', amount: 299, commission: 29.9, rate: '10%', status: 'pending', time: '2024-05-21 14:15' },
    { id: 4, orderId: 'ORD20240521002', user: '赵六', distributor: '王分销', amount: 199, commission: 19.9, rate: '10%', status: 'pending', time: '2024-05-21 15:40' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '订单号', dataIndex: 'orderId', key: 'orderId' },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '分销员', dataIndex: 'distributor', key: 'distributor' },
    { title: '订单金额', dataIndex: 'amount', key: 'amount', render: (val) => `¥${val}` },
    { title: '佣金', dataIndex: 'commission', key: 'commission', render: (val) => `¥${val}` },
    { title: '佣金比例', dataIndex: 'rate', key: 'rate' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'settled' ? 'green' : 'orange'}>
          {status === 'settled' ? '已结算' : '待结算'}
        </Tag>
      )
    },
    { title: '时间', dataIndex: 'time', key: 'time' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">佣金明细</h1>
        <Space>
          <Button icon={<ExportOutlined />}>导出</Button>
        </Space>
      </div>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="累计佣金" value={125680} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="本月佣金" value={15680} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="待结算" value={5680} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card className="stat-card">
            <Statistic title="已结算" value={120000} prefix="¥" />
          </Card>
        </Col>
      </Row>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="订单号/用户/分销员" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Select placeholder="状态" style={{ width: 120 }}>
            <Select.Option value="all">全部</Select.Option>
            <Select.Option value="pending">待结算</Select.Option>
            <Select.Option value="settled">已结算</Select.Option>
          </Select>
          <DatePicker.RangePicker />
        </Space>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>
    </div>
  )
}

export default Commission
