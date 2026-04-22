import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Card, Form, Input, Button, message, Spin, Modal } from 'antd'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import request from '../../utils/request'

function PrivacyPolicy() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const quillRef = useRef(null)

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

  const fetchPrivacyPolicy = async () => {
    setLoading(true)
    try {
      const data = await request.get('/settings/privacy_policy')
      if (data) {
        form.setFieldsValue(data)
      }
    } catch (e) {
      console.error('Failed to fetch privacy policy:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrivacyPolicy()
  }, [])

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
  }, [loading]);

  const onFinish = async (values) => {
    setSaving(true)
    try {
      await request.patch('/settings/privacy_policy', { value: values })
      message.success('保存成功')
    } catch (e) {
      message.error('保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">隐私政策</h1>
        <Button type="primary" onClick={() => form.submit()}>保存</Button>
      </div>

      <Card>
        <Spin spinning={loading}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item label="政策标题" name="title" rules={[{ required: true, message: '请输入标题' }]}>
              <Input placeholder="请输入政策标题" />
            </Form.Item>
            <Form.Item label="政策内容" name="content" rules={[{ required: true, message: '请输入政策内容' }]}>
              <ReactQuill 
                ref={quillRef}
                theme="snow"
                modules={quillModules}
                style={{ height: 600, marginBottom: 50 }}
                placeholder="请输入详细的隐私政策内容..."
              />
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  )
}

export default PrivacyPolicy
