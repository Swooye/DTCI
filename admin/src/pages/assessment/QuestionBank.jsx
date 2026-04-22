import React, { useState, useEffect } from 'react'
import { PlusOutlined, EditOutlined, DeleteOutlined, MinusCircleOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { Table, Tag, Button, Input, Space, Card, Modal, Form, Select, message, Popconfirm, Upload, DatePicker } from 'antd'
import request from '../../utils/request'

function QuestionBank() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()
  const [filterForm] = Form.useForm()
  const [uploading, setUploading] = useState(false)

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return ''
    if (url.startsWith('http')) return url
    return `http://localhost:3100${url}`
  }

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      const values = filterForm.getFieldsValue()
      const params = {
        search: values.search,
        type: values.type,
        geneType: values.geneType,
        status: values.status,
        operator: values.operator,
      }
      if (values.dateRange && values.dateRange.length === 2) {
        params.dateStart = values.dateRange[0].startOf('day').toISOString()
        params.dateEnd = values.dateRange[1].endOf('day').toISOString()
      }
      
      const res = await request.get('/questions', { params })
      setData(res)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      // Convert options to JSON string
      const payload = {
        ...values,
        options: JSON.stringify(values.options || [])
      }

      if (editingId) {
        await request.patch(`/questions/${editingId}`, payload)
        message.success('修改成功')
      } else {
        await request.post('/questions', payload)
        message.success('添加成功')
      }
      setVisible(false)
      form.resetFields()
      setEditingId(null)
      fetchQuestions()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDelete = async (id) => {
    await request.delete(`/questions/${id}`)
    message.success('删除成功')
    fetchQuestions()
  }

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue({
      ...record,
      options: record.options ? JSON.parse(record.options) : []
    })
    setVisible(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: '预览', 
      dataIndex: 'image', 
      key: 'image', 
      width: 80,
      render: (img) => img ? <img src={getImageUrl(img)} alt="q" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : null
    },
    { title: '题目内容', dataIndex: 'title', key: 'title', ellipsis: true },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => {
        const typeMap = {
          single: { label: '单选', color: 'blue' },
          multiple: { label: '多选', color: 'green' },
          judgment: { label: '判断', color: 'purple' },
          qa: { label: '简答', color: 'orange' }
        }
        return <Tag color={typeMap[type]?.color || 'default'}>{typeMap[type]?.label || type}</Tag>
      }
    },
    {
      title: '基因类型',
      dataIndex: 'geneType',
      key: 'geneType',
      width: 100,
      render: (gt) => <Tag>{gt}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <Tag color={status ? 'green' : 'red'}>{status ? '生效中' : '已失效'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_, record) => (
        <Space size={0}>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Form form={filterForm} layout="inline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Select defaultValue="default" style={{ width: 120, background: '#e6f7ff', borderRadius: 4 }} bordered={false}>
                <Select.Option value="default">默认筛选方</Select.Option>
              </Select>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <Form.Item name="search" style={{ margin: 0 }}>
                <Input placeholder="请输入编号、名称或关键字..." style={{ width: 220 }} allowClear />
              </Form.Item>
              <Form.Item label="题目类型" name="type" style={{ margin: 0 }}>
                <Select placeholder="请选择题目类型" style={{ width: 150 }} allowClear>
                  <Select.Option value="single">单选题</Select.Option>
                  <Select.Option value="multiple">多选题</Select.Option>
                  <Select.Option value="judgment">判断题</Select.Option>
                  <Select.Option value="qa">问答题</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="基因类型" name="geneType" style={{ margin: 0 }}>
                <Select placeholder="请选择得分项" style={{ width: 150 }} allowClear>
                  <Select.Option value="D">D型基因</Select.Option>
                  <Select.Option value="T">T型基因</Select.Option>
                  <Select.Option value="C">C型基因</Select.Option>
                  <Select.Option value="I">I型基因</Select.Option>
                  <Select.Option value="i-O">i-O乐观基因</Select.Option>
                  <Select.Option value="L">L倾听基因</Select.Option>
                  <Select.Option value="U">无</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="状态" name="status" style={{ margin: 0 }}>
                <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                  <Select.Option value="true">生效</Select.Option>
                  <Select.Option value="false">失效</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Button type="primary" onClick={fetchQuestions}>
                  筛选
                </Button>
              </Form.Item>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
              <Form.Item label="更新时间" name="dateRange" style={{ margin: 0 }}>
                <DatePicker.RangePicker style={{ width: 250 }} />
              </Form.Item>
              <Form.Item label="操作人" name="operator" style={{ margin: 0 }}>
                <Select placeholder="请选择" style={{ width: 120 }} allowClear>
                  <Select.Option value="小刀">小刀</Select.Option>
                  <Select.Option value="管理员">管理员</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>

      <Card 
        style={{ borderRadius: 8 }}
        title={<span style={{ fontWeight: 'bold' }}>题目列表</span>}
        extra={
          <Button 
            type="primary" 
            onClick={() => {
              setEditingId(null)
              form.resetFields()
              setVisible(true)
            }}
          >
            添加题目
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="id" 
          loading={loading}
          pagination={{ showSizeChanger: true, showTotal: total => `共 ${total} 条` }}
        />
      </Card>

      <Modal
        title={editingId ? "编辑题目" : "添加题目"}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleSave}
        width={700}
        destroyOnClose
      >
        <Form form={form} layout="vertical" initialValues={{ status: true, type: 'single' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <Form.Item label="题目内容" name="title" rules={[{ required: true }]} style={{ gridColumn: 'span 2' }}>
              <Input.TextArea rows={2} placeholder="请输入题目内容" />
            </Form.Item>

            <Form.Item label="题目图片" name="image" style={{ gridColumn: 'span 2' }}>
              <Upload
                name="file"
                listType="picture-card"
                showUploadList={false}
                action="http://localhost:3100/uploads"
                onChange={(info) => {
                  if (info.file.status === 'uploading') {
                    setUploading(true)
                  } else if (info.file.status === 'done') {
                    setUploading(false)
                    form.setFieldsValue({ image: info.file.response.url })
                  } else if (info.file.status === 'error') {
                    setUploading(false)
                    message.error('图片上传失败')
                  }
                }}
              >
                {form.getFieldValue('image') ? (
                  <img src={getImageUrl(form.getFieldValue('image'))} alt="question" style={{ width: '100%', borderRadius: 4 }} />
                ) : (
                  <div>
                    {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>上传图片</div>
                  </div>
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item label="题目类型" name="type" rules={[{ required: true }]}>
              <Select placeholder="请选择">
                <Select.Option value="single">单选</Select.Option>
                <Select.Option value="multiple">多选</Select.Option>
                <Select.Option value="judgment">判断</Select.Option>
                <Select.Option value="qa">简答</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="基因类型" name="geneType" rules={[{ required: true }]}>
              <Select placeholder="请选择">
                <Select.Option value="D">D (Driver)</Select.Option>
                <Select.Option value="T">T (Thinker)</Select.Option>
                <Select.Option value="C">C (Connector)</Select.Option>
                <Select.Option value="I">I (Inspirer)</Select.Option>
                <Select.Option value="i-O">i-O (Optimist)</Select.Option>
                <Select.Option value="L">L (Listener)</Select.Option>
                <Select.Option value="U">U (Unknown/Universal)</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="状态" name="status" valuePropName="checked">
              <Select>
                <Select.Option value={true}>启用</Select.Option>
                <Select.Option value={false}>禁用</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="选项设置 (label, 内容, 分值)">
            <Form.List name="options">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                      <Form.Item
                        {...restField}
                        name={[name, 'label']}
                        rules={[{ required: true, message: 'Label' }]}
                      >
                        <Input placeholder="A" style={{ width: 60 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'text']}
                        rules={[{ required: true, message: '内容' }]}
                      >
                        <Input placeholder="选项描述" style={{ width: 350 }} />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'score']}
                        rules={[{ required: true, message: '分值' }]}
                      >
                        <Input placeholder="5" style={{ width: 60 }} type="number" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'image']}
                        style={{ marginBottom: 0 }}
                      >
                        <Upload
                          name="file"
                          showUploadList={false}
                          action="http://localhost:3100/uploads"
                          onChange={(info) => {
                            if (info.file.status === 'done') {
                              const newOptions = [...form.getFieldValue('options')]
                              newOptions[name].image = info.file.response.url
                              form.setFieldsValue({ options: newOptions })
                            }
                          }}
                        >
                          <Button 
                            type="text" 
                            icon={form.getFieldValue(['options', name, 'image']) ? <Tag color="blue">已图</Tag> : <UploadOutlined />} 
                            size="small"
                          />
                        </Upload>
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      添加选项
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default QuestionBank
