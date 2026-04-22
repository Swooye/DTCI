import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, InputNumber, Switch, Upload, message, Select, Tag } from 'antd'
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

const { Option } = Select;

function ServiceList() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [services, setServices] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [fileList, setFileList] = useState([])
  const [hasManuallyModified, setHasManuallyModified] = useState(false)
  const [form] = Form.useForm()
  const content = Form.useWatch('content', form)

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

  const fetchServices = async () => {
    setLoading(true)
    try {
      const data = await request.get('/services')
      setServices(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [])

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue({
      ...record,
      image: undefined // Handled by fileList
    })
    
    if (record.image) {
      setFileList([{
        uid: '-1',
        name: 'image.png',
        status: 'done',
        url: record.image.startsWith('/') ? `http://localhost:3100${record.image}` : record.image,
        response: { url: record.image }
      }])
      setHasManuallyModified(true) // 已经有图的视为手动控制，不自动覆盖
    } else {
      setFileList([])
      setHasManuallyModified(false) // 没图的允许自动提取
    }
    
    setVisible(true)
  }

  // 智能同步逻辑：当正文中有图片且封面为空时，自动提取并回显
  useEffect(() => {
    if (visible && !hasManuallyModified && fileList.length === 0 && content) {
      // 增强型正则，捕获 src，兼容各种引号和属性顺序
      const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
      const match = imgRegex.exec(content);
      
      if (match && match[1]) {
        const src = match[1];
        // 如果是 base64 且太长，可能不适合做封面，但这里我们先支持
        const isBase64 = src.startsWith('data:');
        const formattedUrl = (src.startsWith('/') && !isBase64) ? `http://localhost:3100${src}` : src;
        
        setFileList([{
          uid: '__auto__',
          name: 'auto-extracted.png',
          status: 'done',
          url: formattedUrl,
          response: { url: src.startsWith('http') ? new URL(src).pathname : src }
        }]);
      }
    } else if (visible && !hasManuallyModified && fileList.length > 0 && fileList[0].uid === '__auto__' && !content) {
      // 如果内容被清空，且当前图片是自动提取的，则同步清空
      setFileList([]);
    }
  }, [content, visible, hasManuallyModified, fileList.length]);

  const handleDelete = async (id) => {
    Modal.confirm({
      title: '删除服务',
      content: '确定要删除这个服务吗？',
      onOk: async () => {
        await request.delete(`/services/${id}`)
        message.success('删除成功')
        fetchServices()
      }
    })
  }

  const handleOk = async () => {
    try {
      const values = await form.validateFields()
      
      // 最终判定策略：
      // 1. 优先使用 fileList 中的图片（手动上传或已预览同步的）
      // 2. 如果 fileList 为空，则从 content 中执行最终实时提取（解决异步竞争问题）
      let imageUrl = null;
      
      if (fileList.length > 0 && fileList[0].status === 'done') {
        imageUrl = fileList[0].response?.url || fileList[0].url.replace('http://localhost:3100', '');
      } else if (values.content) {
        // 实时同步提取逻辑
        const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/i;
        const match = imgRegex.exec(values.content);
        if (match && match[1]) {
          const src = match[1];
          // 如果是 full URL 则裁剪成相对路径
          imageUrl = src.startsWith('http') ? new URL(src).pathname : src;
        }
      }

      const payload = {
        ...values,
        image: imageUrl
      }

      if (editingId) {
        await request.patch(`/services/${editingId}`, payload)
        message.success('更新成功')
      } else {
        await request.post('/services', payload)
        message.success('创建成功')
      }
      
      setVisible(false)
      fetchServices()
    } catch (e) {
      console.error(e)
    }
  }

  const onUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
    // 标记为手动修改，停止自动提取逻辑的介入
    setHasManuallyModified(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { 
      title: '图片', 
      dataIndex: 'image', 
      key: 'image', 
      width: 100,
      render: (img) => {
        if (!img) return null
        const src = img.startsWith('/') ? `http://localhost:3100${img}` : img
        return <img src={src} style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} alt="service" />
      }
    },
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { 
      title: '分类', 
      dataIndex: 'category', 
      key: 'category',
      render: (cat) => <Tag color={cat === 'personal' ? 'blue' : 'purple'}>{cat === 'personal' ? '个人' : '企业'}</Tag>
    },
    { title: '现价', dataIndex: 'price', key: 'price', render: (val) => `¥${val}` },
    { title: '原价', dataIndex: 'originalPrice', key: 'originalPrice', render: (val) => `¥${val}` },
    { title: '销量', dataIndex: 'sales', key: 'sales' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status, record) => (
        <Switch 
          checked={status} 
          onChange={async (checked) => {
            await request.patch(`/services/${record.id}`, { status: checked })
            message.success('状态更新成功')
            fetchServices()
          }} 
        />
      )
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

  const quillRef = useRef(null);

  // 处理图片双击缩放的通用逻辑
  useEffect(() => {
    const attachDblClick = () => {
      const quill = quillRef.current?.getEditor();
      if (quill && quill.root) {
        quill.root.removeEventListener('dblclick', handleImageDblClick);
        quill.root.addEventListener('dblclick', handleImageDblClick);
      }
    };

    // 稍微延迟确保编辑器已完全挂载
    const timer = setTimeout(attachDblClick, 500);
    return () => {
      clearTimeout(timer);
      const quill = quillRef.current?.getEditor();
      if (quill && quill.root) {
        quill.root.removeEventListener('dblclick', handleImageDblClick);
      }
    };
  }, [visible]); // 每次弹窗打开时重新绑定

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
          // 修改 DOM 后同步回 antd form
          const quill = quillRef.current?.getEditor();
          if (quill) {
            form.setFieldsValue({ content: quill.root.innerHTML });
          }
        }
      });
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title">服务管理</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => { 
            setEditingId(null); 
            form.resetFields(); 
            setFileList([]);
            setHasManuallyModified(false); // 重置状态
            setVisible(true); 
          }}
        >
          添加服务
        </Button>
      </div>

      <Card>
        <Table columns={columns} dataSource={services} rowKey="id" loading={loading} />
      </Card>

      <Modal
        title={editingId ? "编辑服务" : "添加服务"}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={handleOk}
        width={800}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item label="服务名称" name="name" rules={[{ required: true, message: '请输入服务名称' }]}>
            <Input placeholder="请输入服务名称" />
          </Form.Item>
          
          <Space size="large" style={{ width: '100%' }}>
            <Form.Item label="服务分类" name="category" initialValue="personal" rules={[{ required: true }]}>
              <Select style={{ width: 150 }}>
                <Option value="personal">个人服务</Option>
                <Option value="corporate">企业服务</Option>
              </Select>
            </Form.Item>
            
            <Form.Item label="现价" name="price" rules={[{ required: true }]}>
              <InputNumber min={0} prefix="¥" placeholder="现价" style={{ width: 150 }} />
            </Form.Item>
            
            <Form.Item label="原价" name="originalPrice">
              <InputNumber min={0} prefix="¥" placeholder="原价" style={{ width: 150 }} />
            </Form.Item>
          </Space>

          <Form.Item label="封面图片" name="image">
            <Upload
              action="http://localhost:3100/uploads"
              name="file"
              listType="picture-card"
              fileList={fileList}
              onChange={onUploadChange}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="服务简述" name="description">
            <Input.TextArea rows={2} placeholder="请输入简短的服务介绍" />
          </Form.Item>

          <Form.Item label="服务详情 (富文本)" name="content">
            <ReactQuill 
              ref={quillRef}
              theme="snow"
              modules={quillModules}
              style={{ height: 250, marginBottom: 50 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ServiceList
