import React, { useState, useEffect } from 'react'
import { Tag, Button, Space, Card, Modal, message, Popconfirm, Row, Col, Breadcrumb, Dropdown } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, MoreOutlined, CloudUploadOutlined, CloudDownloadOutlined } from '@ant-design/icons'
import request from '../../utils/request'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'

function Questionnaire() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState(null)
  
  const navigate = useNavigate()

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return ''
    if (url.startsWith('http')) return url
    return `http://localhost:3100${url}`
  }

  const fetchQuestionnaires = async () => {
    setLoading(true)
    try {
      const res = await request.get('/questionnaires')
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestionnaires()
  }, [])

  const handleCreate = () => {
    navigate('/assessment/questionnaire/create')
  }

  const handleEdit = (record) => {
    navigate(`/assessment/questionnaire/edit/${record.id}`)
  }

  const handleToggleStatus = async (record) => {
    const newStatus = record.status === 'published' ? 'draft' : 'published'
    await request.patch(`/questionnaires/${record.id}`, { status: newStatus })
    message.success(newStatus === 'published' ? '上架成功' : '下架成功')
    fetchQuestionnaires()
  }

  const handleDelete = async (id) => {
    await request.delete(`/questionnaires/${id}`)
    message.success('删除成功')
    fetchQuestionnaires()
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    setTimeout(() => { if (e.target) e.target.style.opacity = '0.5' }, 0)
  }

  const handleDragEnter = (e, index) => {
    if (draggedIndex === null || draggedIndex === index) return
    const newData = [...data]
    const item = newData.splice(draggedIndex, 1)[0]
    newData.splice(index, 0, item)
    setDraggedIndex(index)
    setData(newData)
  }

  const handleDragEnd = async (e) => {
    if (e.target) e.target.style.opacity = '1'
    setDraggedIndex(null)
    
    const payload = data.map((d, i) => ({ id: d.id, sortOrder: i }))
    try {
      await request.patch('/questionnaires/reorder', { updates: payload })
      message.success('排序已保存')
    } catch (err) {
      message.error('排序保存失败')
      fetchQuestionnaires()
    }
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '问卷名称', dataIndex: 'name', key: 'name' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'green' : 'orange'}>
          {status === 'published' ? '已发布' : '草稿'}
        </Tag>
      )
    },
    { 
      title: '题目数', 
      key: 'questionCount',
      render: (_, record) => {
        try {
          const qs = JSON.parse(record.questions || '[]')
          return qs.length
        } catch { return 0 }
      }
    },
    { 
      title: '创建时间', 
      dataIndex: 'createdAt', 
      key: 'createdAt',
      render: (date) => dayjs(date).format('YYYY-MM-DD HH:mm')
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  const stepsItems = [
    { title: '基本信息' },
    { title: '选择题目' },
    { title: '测评设置' },
    { title: '发布管理' }
  ]

  return (
    <div style={{ padding: '0 24px 24px' }}>
      <div style={{ padding: '16px 0' }}>
        <Breadcrumb items={[
          { title: '测评管理' },
          { title: '问卷管理' }
        ]} />
      </div>

      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 600, margin: 0 }}>问卷列表 <span style={{fontSize: 14, color: '#aaa', fontWeight: 400, marginLeft: 10}}>* 拖拽卡片调整小程序展示顺序</span></h1>
      </div>

      <Row gutter={[24, 24]}>
        {data.map((item, index) => {
          const wechatConfig = item.wechatConfig ? JSON.parse(item.wechatConfig) : {}
          const menuItems = [
            { key: 'edit', label: '编辑', icon: <EditOutlined />, onClick: () => handleEdit(item) },
            { 
              key: 'status', 
              label: item.status === 'published' ? '下架' : '上架', 
              icon: item.status === 'published' ? <CloudDownloadOutlined /> : <CloudUploadOutlined />,
              onClick: () => handleToggleStatus(item)
            },
            { key: 'delete', label: '删除', danger: true, icon: <DeleteOutlined />, onClick: () => {
              Modal.confirm({
                title: '确定删除吗？',
                onOk: () => handleDelete(item.id)
              })
            }},
          ]

          return (
            <Col 
              key={item.id} 
              xs={24} sm={12} md={8} lg={6}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
            >
              <Card
                className="questionnaire-card"
                hoverable
                style={{ cursor: 'move', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                cover={
                  <div style={{ height: 180, overflow: 'hidden', position: 'relative', background: '#f0f2f5' }}>
                    <img
                      alt={item.name}
                      src={getImageUrl(wechatConfig.icon) || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{ position: 'absolute', top: 12, right: 12 }}>
                      <Dropdown menu={{ items: menuItems }} placement="bottomRight">
                        <Button 
                          shape="circle" 
                          icon={<MoreOutlined style={{ fontSize: 18 }} />} 
                          style={{ border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} 
                        />
                      </Dropdown>
                    </div>
                  </div>
                }
                bodyStyle={{ padding: '16px', textAlign: 'center' }}
              >
                <Card.Meta 
                  title={<span style={{ fontSize: '16px', fontWeight: 500 }}>{item.name}</span>}
                  description={
                    <Tag color={item.status === 'published' ? 'green' : 'orange'} style={{ marginTop: 8 }}>
                      {item.status === 'published' ? '已上架' : '草稿'}
                    </Tag>
                  }
                />
              </Card>
            </Col>
          )
        })}

        <Col xs={24} sm={12} md={8} lg={6}>
          <div 
            onClick={handleCreate}
            style={{ 
              height: '100%', 
              minHeight: 260,
              border: '2px dashed #d9d9d9', 
              borderRadius: '12px', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center',
              cursor: 'pointer',
              background: '#fafafa',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => { e.currentTarget.style.borderColor = '#1890ff'; e.currentTarget.style.background = '#f0f5ff' }}
            onMouseOut={(e) => { e.currentTarget.style.borderColor = '#d9d9d9'; e.currentTarget.style.background = '#fafafa' }}
          >
            <PlusOutlined style={{ fontSize: 48, color: '#bfbfbf', marginBottom: 16 }} />
            <span style={{ fontSize: 16, color: '#8c8c8c' }}>定制测评问卷</span>
          </div>
        </Col>
      </Row>

    </div>
  )
}

export default Questionnaire
