import React, { useState, useEffect, useMemo } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Select, Tag, Switch, Upload, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import request from '../../utils/request'

function CaseList() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState([])
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()

  const tags = ['事业', '亲子', '婚恋', '自我成长']

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const data = await request.get('/cases')
      setCases(data)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    const data = await request.get('/users')
    setUsers(data)
  }

  useEffect(() => {
    fetchCases()
    fetchUsers()
  }, [])

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue({
      ...record,
      authorId: record.author.id,
      images: undefined // Upload uses fileList state
    })
    
    // Convert JSON string to fileList format for Antd Upload
    try {
      const imagesArray = JSON.parse(record.images || '[]')
      setFileList(imagesArray.map((url, index) => ({
        uid: index,
        name: `image-${index}`,
        status: 'done',
        url: url.startsWith('/') ? `http://localhost:3100${url}` : url,
        response: { url }
      })))
    } catch (e) {
      setFileList([])
    }
    
    setVisible(true)
  }

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '删除案例',
      content: '确定要删除这个案例吗？',
      onOk: async () => {
        await request.delete(`/cases/${id}`)
        message.success('删除成功')
        fetchCases()
      }
    })
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      
      // Extract URLs from fileList
      const imageUrls = fileList
        .filter(file => file.status === 'done' || file.url)
        .map(file => file.response?.url || file.url.replace('http://localhost:3100', ''))

      const payload = {
        ...values,
        images: JSON.stringify(imageUrls)
      }

      if (editingId) {
        await request.patch(`/cases/${editingId}`, payload)
        message.success('更新成功')
      } else {
        await request.post('/cases', payload)
        message.success('创建成功')
      }
      
      setVisible(false)
      fetchCases()
    } catch (e) {
      console.error(e)
    }
  }

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: '图片', 
      dataIndex: 'images', 
      key: 'images', 
      width: 100,
      render: (imgJson) => {
        try {
          const imgs = JSON.parse(imgJson)
          if (imgs.length > 0) {
            const src = imgs[0].startsWith('/') ? `http://localhost:3100${imgs[0]}` : imgs[0]
            return <img src={src} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} alt="case" />
          }
        } catch (e) { return null }
        return null
      }
    },
    { title: '标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { 
      title: '标签', 
      dataIndex: 'tag', 
      key: 'tag',
      render: (tag) => <Tag color="orange">{tag}</Tag>
    },
    { 
      title: '推荐', 
      dataIndex: 'isRecommended', 
      key: 'isRecommended',
      render: (rec) => rec ? <Tag color="green">推</Tag> : <Tag color="default">否</Tag>
    },
    { 
      title: '作者', 
      dataIndex: 'author', 
      key: 'author',
      render: (author) => author?.nickname || '未知'
    },
    { 
      title: '获赞/收藏', 
      key: 'stats',
      render: (_, record) => `${record.likes}/${record.stars}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title">案例管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => { 
            setEditingId(null); 
            form.resetFields(); 
            setFileList([]);
            setVisible(true); 
          }}
        >
          添加案例
        </Button>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={cases} 
          rowKey="id" 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingId ? "编辑案例" : "添加案例"}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
        width={900}
        destroyOnHidden
      >
        <Form form={form} layout="vertical">
          <Form.Item label="标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="请输入标题" />
          </Form.Item>
          
          <Space size="large" style={{ width: '100%' }}>
            <Form.Item label="标签分类" name="tag" rules={[{ required: true }]}>
              <Select placeholder="请选择分类" style={{ width: 200 }}>
                {tags.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
              </Select>
            </Form.Item>
            
            <Form.Item label="关联作者" name="authorId" rules={[{ required: true }]}>
              <Select 
                showSearch 
                placeholder="请搜索并选择用户" 
                style={{ width: 300 }}
                optionFilterProp="children"
              >
                {users.map(u => (
                  <Select.Option key={u.id} value={u.id}>
                    {u.nickname} ({u.openid.substring(0, 8)}...)
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="推荐" name="isRecommended" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>

          <Form.Item label="案例图片 (第一张为列表缩略图)" name="images">
            <Upload
              action="http://localhost:3100/uploads"
              name="file"
              listType="picture-card"
              fileList={fileList}
              onChange={onUploadChange}
              multiple
            >
              {fileList.length >= 8 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item 
            label="案例内容" 
            name="content" 
            rules={[{ required: true, message: '请输入案例内容' }]}
          >
            <ReactQuill 
              theme="snow"
              modules={quillModules}
              placeholder="请输入详细案例内容..."
              style={{ height: 300, marginBottom: 50 }}
            />
          </Form.Item>
          
          <Space size="large">
            <Form.Item label="虚拟获赞数" name="likes" initialValue={0}>
              <Input type="number" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="虚拟收藏数" name="stars" initialValue={0}>
              <Input type="number" style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}

export default CaseList
