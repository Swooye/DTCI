import React from 'react'
import { Card, Form, Input, Button, Upload, Switch, Space, message, Row, Col } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

function HomeSettings() {
  const [form] = Form.useForm()

  const onFinish = () => {
    message.success('保存成功')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">首页设置</h1>
        <Button type="primary" onClick={() => form.submit()}>保存设置</Button>
      </div>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="基本设置" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="小程序名称" name="appName" initialValue="DTCI">
                <Input placeholder="请输入小程序名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="小程序简介" name="appDesc" initialValue="基因健康管理平台">
                <Input placeholder="请输入小程序简介" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Logo" name="logo">
            <Upload listType="picture-card" maxCount={1} beforeUpload={() => false}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传Logo</div>
              </div>
            </Upload>
          </Form.Item>
        </Card>

        <Card title="首页配置" style={{ marginBottom: 16 }}>
          <Form.Item label="首页轮播图数量" name="bannerCount" initialValue={3}>
            <Input type="number" min={1} max={5} />
          </Form.Item>
          <Form.Item label="热门服务数量" name="hotServiceCount" initialValue={6}>
            <Input type="number" min={1} max={20} />
          </Form.Item>
          <Form.Item label="显示公告" name="showAnnouncement" initialValue={true} valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="公告内容" name="announcement">
            <Input.TextArea rows={3} placeholder="请输入公告内容" />
          </Form.Item>
        </Card>

        <Card title="联系方式">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="客服电话" name="servicePhone" initialValue="400-888-8888">
                <Input placeholder="请输入客服电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="客服邮箱" name="serviceEmail" initialValue="contact@dtci.com">
                <Input placeholder="请输入客服邮箱" />
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </div>
  )
}

export default HomeSettings
