import React from 'react'
import { Card, Form, Input, Button, message } from 'antd'

const { TextArea } = Input

function AboutUs() {
  const [form] = Form.useForm()

  const onFinish = () => {
    message.success('保存成功')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">关于我们</h1>
        <Button type="primary" onClick={() => form.submit()}>保存</Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="公司名称" name="companyName" initialValue="北京了庸文化科技有限公司">
            <Input placeholder="请输入公司名称" />
          </Form.Item>
          <Form.Item label="公司简介" name="description" initialValue="DTCI（了庸文化）是一家专注于基因健康领域的创新型科技公司。">
            <TextArea rows={6} placeholder="请输入公司简介" />
          </Form.Item>
          <Form.Item label="联系方式" name="contact" initialValue="400-888-8888">
            <Input placeholder="请输入联系方式" />
          </Form.Item>
          <Form.Item label="邮箱" name="email" initialValue="contact@dtci.com">
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item label="地址" name="address" initialValue="北京市朝阳区XXX大厦">
            <Input placeholder="请输入公司地址" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default AboutUs
