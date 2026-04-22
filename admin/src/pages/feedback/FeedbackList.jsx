import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, Descriptions, Tabs } from 'antd'
import { SearchOutlined, MessageOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import request from '../../utils/request'
import dayjs from 'dayjs'

function FeedbackList() {
  const navigate = useNavigate()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  React.useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await request.get('/feedbacks')
      setData(res)
    } catch (err) {
      console.error('Failed to fetch feedbacks:', err)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { 
      title: '用户', 
      key: 'user',
      render: (_, record) => (
        <div>
          <div>{record.user?.nickname || '-'}</div>
          <div style={{ fontSize: '12px', color: '#999' }}>ID: {record.userId}</div>
        </div>
      )
    },
    { title: '类型', dataIndex: 'type', key: 'type', render: (type) => {
      const colorMap = { 'suggestion': 'blue', 'bug': 'red', 'experience': 'orange', 'content': 'purple', 'other': 'default' }
      const labelMap = { 'suggestion': '功能建议', 'bug': 'Bug反馈', 'experience': '体验问题', 'content': '内容问题', 'other': '其他' }
      return <Tag color={colorMap[type] || 'default'}>{labelMap[type] || type}</Tag>
    }},
    { title: '反馈内容', dataIndex: 'content', key: 'content', ellipsis: true },
    { title: '图片', dataIndex: 'images', key: 'images', render: (imagesJson) => {
      try {
        const imgs = JSON.parse(imagesJson || '[]')
        return imgs.length > 0 ? `${imgs.length}张` : '-'
      } catch (e) {
        return '-'
      }
    }},
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
        return <Tag color={statusMap[status]?.color || 'default'}>{statusMap[status]?.label || status}</Tag>
      }
    },
    { title: '时间', dataIndex: 'createdAt', key: 'createdAt', render: (t) => dayjs(t).format('YYYY-MM-DD HH:mm') },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button
          type="link"
          icon={<MessageOutlined />}
          onClick={() => navigate(`/feedback/reply?id=${record.id}`)}
        >
          回复
        </Button>
      )
    }
  ]

  const items = [
    { key: 'all', label: '全部', children: <Table columns={columns} dataSource={data} rowKey="id" loading={loading} /> },
    { key: 'pending', label: '待处理', children: <Table columns={columns} dataSource={data.filter(i => i.status === 'pending')} rowKey="id" loading={loading} /> },
    { key: 'replied', label: '已回复', children: <Table columns={columns} dataSource={data.filter(i => i.status === 'replied')} rowKey="id" loading={loading} /> },
    { key: 'resolved', label: '已解决', children: <Table columns={columns} dataSource={data.filter(i => i.status === 'resolved')} rowKey="id" loading={loading} /> }
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
