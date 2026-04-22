import React, { useEffect, useState, useMemo, useRef } from 'react'
import { Card, Form, Button, message, Spin, Modal, Input } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import request from '../../utils/request'

function AboutUs() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const quillModules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'align': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean']
    ],
  }), [])

  const fetchAboutUs = async () => {
    setLoading(true)
    try {
      const data = await request.get('/settings/about_us')
      if (data) {
        // 确保兼容旧数据格式
        const formData = typeof data === 'string' ? { description: data } : data;
        form.setFieldsValue(formData)
      }
    } catch (e) {
      console.error('Failed to fetch about us:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAboutUs()
  }, [])

  const quillRef = useRef(null);

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
            form.setFieldsValue({ description: quill.root.innerHTML });
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
  }, [loading]);

  const onFinish = async (values) => {
    setSaving(true)
    try {
      await request.patch('/settings/about_us', { value: values })
      message.success('保存成功')
    } catch (e) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title">关于我们 (全屏编辑)</h1>
        <Button type="primary" onClick={() => form.submit()} loading={saving}>保存</Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="页面详细内容 (包括介绍、联系方式、二维码等)" name="description" rules={[{ required: true, message: '请编写页面内容' }]}>
              <ReactQuill 
                ref={quillRef}
                theme="snow"
                modules={quillModules}
                style={{ height: 600, marginBottom: 50 }}
                placeholder="在此编写关于我们的所有信息，可以插入图片作为联系二维码..."
              />
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      <div style={{ marginTop: 20, color: '#999', fontSize: 13 }}>
        提示：小程序端将直接渲染此处编辑的所有内容。请点击“保存”以更新线上数据。
      </div>
    </div>
  )
}

export default AboutUs
