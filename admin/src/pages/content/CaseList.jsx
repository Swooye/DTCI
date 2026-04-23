import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Select, Tag, Switch, Upload, message, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import ReactQuill, { Quill } from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import request from '../../utils/request'

// 注册图片样式支持，允许保留 width 属性同步到小程序
const ImageFormat = Quill.import('formats/image');
class ResizableImage extends ImageFormat {
  static formats(domNode) {
    const formats = super.formats(domNode);
    if (domNode.hasAttribute('width')) formats.width = domNode.getAttribute('width');
    if (domNode.hasAttribute('style')) formats.style = domNode.getAttribute('style');
    return formats;
  }
  format(name, value) {
    if (name === 'width' || name === 'style') {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register(ResizableImage, true);

function CaseList() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState([])
  const [users, setUsers] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()
  const [filterForm] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])

  const tags = ['事业', '亲子', '婚恋', '自我成长']



  const quillRef = useRef(null);

  // 处理图片双击缩放的通用逻辑
  const handleImageDblClick = (e) => {
    if (e.target.tagName === 'IMG') {
      const img = e.target;
      const currentWidth = img.getAttribute('width') || img.style.width || '100%';
      Modal.confirm({
        title: '调整图片尺寸',
        content: (
          <div style={{ marginTop: 10 }}>
            <p>建议输入百分比（如 50%）或像素值（如 200px）</p>
            <Input 
              defaultValue={currentWidth} 
              onChange={(ev) => img._newWidth = ev.target.value}
              placeholder="例如: 50% 或 200px"
            />
          </div>
        ),
        onOk: () => {
          const val = img._newWidth || currentWidth;
          img.setAttribute('width', val);
          img.style.width = val;
          const quill = quillRef.current?.getEditor();
          if (quill) {
            form.setFieldsValue({ content: quill.root.innerHTML });
          }
        }
      });
    }
  };

  useEffect(() => {
    const attachListener = () => {
      const quill = quillRef.current?.getEditor();
      if (quill && quill.root) {
        quill.root.removeEventListener('dblclick', handleImageDblClick);
        quill.root.addEventListener('dblclick', handleImageDblClick);
      }
    };
    const timer = setTimeout(attachListener, 500);
    return () => {
      clearTimeout(timer);
      const quill = quillRef.current?.getEditor();
      if (quill && quill.root) {
        quill.root.removeEventListener('dblclick', handleImageDblClick);
      }
    };
  }, [visible]);

  const quillModules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: function() {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');
          input.click();
          input.onchange = async () => {
            const file = input.files[0];
            const formData = new FormData();
            formData.append('file', file);
            try {
              const res = await request.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              const range = this.quill.getSelection();
              // 插入完整 URL 确保编辑器内能预览
              // 如果 res.url 已经是完整路径则直接使用，否则补全
              const fullUrl = res.url.startsWith('http') ? res.url : `http://localhost:3100${res.url}`;
              this.quill.insertEmbed(range.index, 'image', fullUrl);
            } catch (err) {
              message.error('图片上传失败');
            }
          };
        }
      }
    },
  }), [])

  const fetchCases = async () => {
    setLoading(true)
    try {
      const values = filterForm.getFieldsValue()
      const params = {
        search: values.search,
        tag: values.tag,
        isRecommended: values.isRecommended,
      }
      if (values.dateRange && values.dateRange.length === 2) {
        params.dateStart = values.dateRange[0].startOf('day').toISOString()
        params.dateEnd = values.dateRange[1].endOf('day').toISOString()
      }
      
      const data = await request.get('/cases', { params })
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

  const handleEdit = async (record) => {
    setLoading(true)
    try {
      // 获取最新数据，防止被 stale 数据覆盖点赞/收藏数
      const freshRecord = await request.get(`/cases/${record.id}`)
      setEditingId(freshRecord.id)
      form.setFieldsValue({
        ...freshRecord,
        authorId: freshRecord.author.id,
        images: undefined
      })
      
      try {
        const imagesArray = JSON.parse(freshRecord.images || '[]')
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
    } catch (error) {
      message.error('获取最新数据失败')
    } finally {
      setLoading(false)
    }
  }

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) return

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个案例吗？此操作无法恢复。`,
      okText: '确认',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map(id => request.delete(`/cases/${id}`)))
          message.success('批量删除成功')
          setSelectedRowKeys([])
          fetchCases()
        } catch (error) {
          message.error('删除失败，请稍后重试')
        }
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
      render: (imgData) => {
        try {
          // Robust handling for both string JSON and already-parsed data
          let imgs = []
          if (typeof imgData === 'string') {
            imgs = JSON.parse(imgData || '[]')
          } else if (Array.isArray(imgData)) {
            imgs = imgData
          }
          
          if (imgs.length > 0) {
            const src = imgs[0].startsWith('/') ? `http://localhost:3100${imgs[0]}` : imgs[0]
            return (
              <img 
                src={src} 
                style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4, backgroundColor: '#f5f5f5' }} 
                alt="case" 
                onError={(e) => { e.target.src = 'https://placehold.co/50?text=Error' }}
              />
            )
          }
        } catch (e) { 
          console.error('Image parse error:', e)
        }
        return <div style={{ width: 50, height: 50, backgroundColor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#999' }}>无图片</div>
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
      render: (_, record) => `${(record.virtualLikes || 0) + (record.realLikes || 0)} / ${(record.virtualStars || 0) + (record.realStars || 0)}`
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
      )
    }
  ]

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Form form={filterForm} layout="inline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <Form.Item name="search" style={{ margin: 0 }}>
                <Input placeholder="输入编号、名称或关键字..." style={{ width: 220 }} allowClear />
              </Form.Item>
              <Form.Item label="分类" name="tag" style={{ margin: 0 }}>
                <Select placeholder="请选择分类" style={{ width: 150 }} allowClear>
                  {tags.map(t => <Select.Option key={t} value={t}>{t}</Select.Option>)}
                </Select>
              </Form.Item>
              <Form.Item label="推荐" name="isRecommended" style={{ margin: 0 }}>
                <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                  <Select.Option value="true">生效</Select.Option>
                  <Select.Option value="false">失效</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="时间" name="dateRange" style={{ margin: 0 }}>
                <DatePicker.RangePicker style={{ width: 250 }} />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Button type="primary" onClick={fetchCases}>
                  筛选
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title">案例管理</h1>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
            >
              批量删除 ({selectedRowKeys.length})
            </Button>
          )}
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
        </Space>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={cases} 
          rowKey="id" 
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          }}
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
              ref={quillRef}
              theme="snow"
              modules={quillModules}
              placeholder="请输入详细案例内容..."
              style={{ height: 300, marginBottom: 50 }}
            />
          </Form.Item>
          
          <Space size="large">
            <Form.Item label="虚拟获赞数" name="virtualLikes" initialValue={0}>
              <Input type="number" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="真实获赞数 (只读)">
               <Input value={form.getFieldValue('realLikes') || 0} disabled style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="虚拟收藏数" name="virtualStars" initialValue={0}>
              <Input type="number" style={{ width: 120 }} />
            </Form.Item>
            <Form.Item label="真实收藏数 (只读)">
               <Input value={form.getFieldValue('realStars') || 0} disabled style={{ width: 120 }} />
            </Form.Item>
          </Space>
        </Form>
      </Modal>
    </div>
  )
}

export default CaseList
