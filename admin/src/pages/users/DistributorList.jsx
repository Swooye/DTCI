import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, Descriptions, Avatar, Tabs, Rate } from 'antd'
import { SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import './DistributorList.css'

function DistributorList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentDistributor, setCurrentDistributor] = useState(null)

  const dataSource = [
    { id: 1, avatar: '', name: '张分销', phone: '138****8888', level: '金牌', teamSize: 150, commission: 12580, status: 'active', rating: 4.5 },
    { id: 2, avatar: '', name: '李分销', phone: '139****6666', level: '银牌', teamSize: 80, commission: 6800, status: 'active', rating: 4.2 },
    { id: 3, avatar: '', name: '王分销', phone: '137****5555', level: '铜牌', teamSize: 45, commission: 3200, status: 'active', rating: 4.8 },
    { id: 4, avatar: '', name: '赵分销', phone: '136****4444', level: '金牌', teamSize: 200, commission: 18000, status: 'inactive', rating: 3.9 }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    {
      title: '分销员',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar 
            src={record.avatar || 'https://www.dtci.com.cn/logo.png'} 
            style={{ backgroundColor: '#722ed1' }}
          >
            {!record.avatar && text[0]}
          </Avatar>
          <span>{text}</span>
        </Space>
      )
    },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      render: (level) => {
        const color = level === '金牌' ? 'gold' : level === '银牌' ? 'silver' : '#cd7f32'
        return <Tag color={color}>{level}</Tag>
      }
    },
    { title: '团队人数', dataIndex: 'teamSize', key: 'teamSize' },
    { title: '累计佣金', dataIndex: 'commission', key: 'commission', render: (val) => `¥${val.toLocaleString()}` },
    { title: '评分', dataIndex: 'rating', key: 'rating', render: (val) => <Rate disabled defaultValue={val} allowHalf style={{ fontSize: 12 }} /> },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '正常' : '已禁用'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showDetail(record)}>
            详情
          </Button>
          {record.status === 'active' ? (
            <Button type="link" danger icon={<CloseOutlined />}>
              禁用
            </Button>
          ) : (
            <Button type="link" icon={<CheckOutlined />}>
              启用
            </Button>
          )}
        </Space>
      )
    }
  ]

  const showDetail = (record) => {
    setCurrentDistributor(record)
    setDetailVisible(true)
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  }

  const teamColumns = [
    { title: '用户', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '注册时间', dataIndex: 'createdAt', key: 'createdAt' }
  ]

  const orderColumns = [
    { title: '订单号', dataIndex: 'orderId', key: 'orderId' },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '金额', dataIndex: 'amount', key: 'amount' },
    { title: '佣金', dataIndex: 'commission', key: 'commission' },
    { title: '时间', dataIndex: 'time', key: 'time' }
  ]

  const items = [
    { key: 'info', label: '基本信息', children: currentDistributor && (
      <Descriptions column={1} bordered>
        <Descriptions.Item label="分销员ID">{currentDistributor.id}</Descriptions.Item>
        <Descriptions.Item label="分销员名称">{currentDistributor.name}</Descriptions.Item>
        <Descriptions.Item label="手机号">{currentDistributor.phone}</Descriptions.Item>
        <Descriptions.Item label="等级">{currentDistributor.level}</Descriptions.Item>
        <Descriptions.Item label="团队人数">{currentDistributor.teamSize}</Descriptions.Item>
        <Descriptions.Item label="累计佣金">¥{currentDistributor.commission.toLocaleString()}</Descriptions.Item>
        <Descriptions.Item label="评分">{currentDistributor.rating}分</Descriptions.Item>
      </Descriptions>
    )},
    { key: 'team', label: '团队成员', children: <Table columns={teamColumns} dataSource={[]} rowKey="id" pagination={false} /> },
    { key: 'order', label: '订单记录', children: <Table columns={orderColumns} dataSource={[]} rowKey="id" pagination={false} /> }
  ]


  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">分销员列表</h1>
        <Space>
          <Input placeholder="搜索分销员" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Button type="primary">导出</Button>
        </Space>
      </div>

      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
        />
      </Card>

      <Modal
        title="分销员详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
      >
        <Tabs items={items} />
      </Modal>
    </div>
  )
}

export default DistributorList
