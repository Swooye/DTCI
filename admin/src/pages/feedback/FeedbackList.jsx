import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, Descriptions, Tabs } from 'antd'
import { SearchOutlined, MessageOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

function FeedbackList() {
  const navigate = useNavigate()

  const dataSource = [
    { id: 1, user: '张三', type: '功能建议', content: '希望增加预约提醒功能', images: 2, status: 'pending', time: '2024-05-20 10:30' },
    { id: 2, user: '李四', type: 'Bug反馈', content: '首页加载速度较慢', images: 1, status: 'pending', time: '2024-05-20 11:20' },
    { id: 3, user: '王五', type: '体验问题', content: '页面布局可以优化', images: 0, status: 'replied', time: '2024-05-19 14:15' },
    { id: 4, user: '赵六', type: '内容问题', content: '某些测评结果描述不够清晰', images: 0, status: 'resolved', time: '2024-05-18 09:40' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户', dataIndex: 'user', key: 'user' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => {
      const colorMap = { '功能建议': 'blue', 'Bug反馈': 'red', '体验问题': 'orange', '内容问题': 'purple' }
      return <Tag color={colorMap[type]}>{type}</Tag>
    }},
    { title: '反馈内容', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '图片', dataIndex: 'images', key: 'images', render: (n) => n > 0 ? `${n}张` : '-' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { label: '待处理', color: 'orange' },
          replied: { label: '已回复', color: 'blue' },
          resolved: { label: '已解决', color: 'green' }
        }
        return <Tag color={statusMap[status].color}>{statusMap[status].label}</Tag>
      }
    },
    { title: '时间', dataIndex: 'time', key: 'time' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<MessageOutlined />}
          onClick={() => navigate('/feedback/reply')}
        >
          回复
        </Button>
      )
    }
  ]

  const items = [
    { key: 'all', label: '全部', children: <Table columns={columns} dataSource={dataSource} rowKey="id" /> },
    { key: 'pending', label: '待处理', children: <Table columns={columns} dataSource={dataSource.filter(i => i.status === 'pending')} rowKey="id" /> },
    { key: 'replied', label: '已回复', children: <Table columns={columns} dataSource={dataSource.filter(i => i.status === 'replied')} rowKey="id" /> },
    { key: 'resolved', label: '已解决', children: <Table columns={columns} dataSource={dataSource.filter(i => i.status === 'resolved')} rowKey="id" /> }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">反馈列表</h1>
        <Space>
          <Input placeholder="搜索反馈" prefix={<SearchOutlined />} style={{ width: 200 }} />
          <Button>导出</Button>
        </Space>
      </div>

      <Card>
        <Tabs items={items} />
      </Card>
    </div>
  )
}

export default FeedbackList
