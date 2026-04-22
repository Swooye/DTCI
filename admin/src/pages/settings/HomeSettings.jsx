import React, { useState, useEffect } from 'react'
import { Form, Input, Button, Upload, message, Typography, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import request from '../../utils/request'

const { Title } = Typography

function HomeSettings() {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  // 自定义上传逻辑，复用后端的uploads接口
  const createCustomRequest = (field) => async ({ file, onSuccess, onError }) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      const res = await request.post('/uploads', formData)
      const url = res.url
      form.setFieldsValue({ [field]: [{ uid: file.uid, name: file.name, status: 'done', url }] })
      onSuccess(res)
    } catch (error) {
      console.error('Upload Error:', error)
      onError(error)
      // message.error intercepts in request.js already, but we can keep it or rely on interceptor
      message.error(`${file.name} 上传失败`)
    }
  }

  // 加载已有配置
  const loadSettings = async () => {
    try {
      setFetching(true)
      const res = await request.get('/settings/home_settings')
      if (res) {
        // Backend's getSetting parses the JSON string and returns the object directly
        const val = res.value ? JSON.parse(res.value) : (typeof res === 'string' ? JSON.parse(res) : res)
        form.setFieldsValue({
          mission: val.mission || '',
          vision: val.vision || '',
          values: val.values || '',
          founderVideoUrl: val.founderVideoUrl || '',
          founderVideoFile: val.founderVideoFile ? [{ uid: '-1', name: 'video', status: 'done', url: val.founderVideoFile }] : [],
          serviceCompareImage: val.serviceCompareImage ? [{ uid: '-2', name: 'image', status: 'done', url: val.serviceCompareImage }] : []
        })
      }
    } catch (e) {
      // 找不到配置时不做处理，也就是保持空表单
      console.error('Failed to load settings:', e)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const resolveUrl = (fileList) => {
    if (!fileList || !fileList.length) return '';
    const file = fileList[0];
    const url = file.url || file.response?.url || '';
    if (url && !url.startsWith('http')) {
      return `http://localhost:3100${url}`;
    }
    return url;
  }

  const onFinish = async (values) => {
    setLoading(true)
    try {
      const payload = {
        mission: values.mission,
        vision: values.vision,
        values: values.values,
        founderVideoFile: resolveUrl(values.founderVideoFile),
        founderVideoUrl: values.founderVideoUrl,
        serviceCompareImage: resolveUrl(values.serviceCompareImage),
      }
      
      // 合并视频URL给小程序方便读取
      const combinedVideo = payload.founderVideoFile || payload.founderVideoUrl

      await request.patch('/settings/home_settings', { 
        value: JSON.stringify({...payload, founderVideo: combinedVideo}) 
      })
      message.success('保存成功')
    } catch (error) {
      message.error('保存失败')
    } finally {
      setLoading(false)
    }
  }

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['clean']
    ]
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  if (fetching) return null; // 简单的加载态防止未获取到数据时闪烁

  return (
    <div style={{ backgroundColor: '#fff', padding: 24, borderRadius: 8, minHeight: 'calc(100vh - 120px)' }}>
      <div style={{ marginBottom: 40 }}>
        <Title level={5} style={{ margin: 0, fontWeight: 'normal' }}>请填写首页相关信息</Title>
      </div>

      <Form form={form} layout="horizontal" onFinish={onFinish} labelCol={{ span: 3 }} wrapperCol={{ span: 18 }} labelAlign="left">
        <Form.Item label={<span style={{ fontWeight: 500 }}>公司愿景</span>} name="vision">
          <Input.TextArea rows={3} placeholder="例如：助力2亿人更好地认识自己..." />
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 500 }}>公司使命</span>} name="mission">
          <Input.TextArea rows={3} placeholder="例如：通过DTCI赋能个人、家庭和组织..." />
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 500 }}>公司理念</span>} name="values" style={{ marginBottom: 40 }}>
          <Input.TextArea rows={3} placeholder="例如：活好自己、照亮家人、照亮更多人" />
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 500 }}>创始人故事<span style={{color: 'red'}}>*</span></span>} required style={{ marginBottom: '0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8 }}>
            <Form.Item name="founderVideoFile" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
              <Upload
                listType="picture-card"
                maxCount={1}
                accept="video/*"
                customRequest={createCustomRequest('founderVideoFile')}
                showUploadList={{ showPreviewIcon: false }}
                style={{ width: 104, height: 104 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
                  <PlusOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div style={{ fontSize: 12 }}>上传视频</div>
                </div>
              </Upload>
            </Form.Item>
            <span style={{ color: '#666', margin: '0 8px' }}>或</span>
            <Form.Item name="founderVideoUrl" noStyle>
              <Input placeholder="请输入视频链接地址" style={{ width: 300 }} />
            </Form.Item>
          </div>
          <div style={{ color: '#999', fontSize: 12, marginBottom: 32 }}>
            支持上传mp4/avi文件等，且不超过500mb
          </div>
        </Form.Item>

        <Form.Item label={<span style={{ fontWeight: 500 }}>服务对比<span style={{color: 'red'}}>*</span></span>} required style={{ marginBottom: '0' }}>
          <div style={{ marginBottom: 8 }}>
            <Form.Item name="serviceCompareImage" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: '请上传对比图' }]} noStyle>
              <Upload
                listType="picture-card"
                maxCount={1}
                accept="image/*"
                customRequest={createCustomRequest('serviceCompareImage')}
                style={{ width: 104, height: 104 }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#999' }}>
                  <PlusOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                  <div style={{ fontSize: 12 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
          </div>
          <div style={{ color: '#999', fontSize: 12, marginBottom: 40 }}>
            只能上传jpg/png/webp文件，且不超过500kb
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3, span: 18 }}>
          <Space size="middle">
            <Button type="primary" htmlType="submit" loading={loading} style={{ backgroundColor: '#2E9E81', borderColor: '#2E9E81', padding: '0 32px' }}>立即添加</Button>
            <Button onClick={() => form.resetFields()} style={{ padding: '0 32px' }}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  )
}

export default HomeSettings
