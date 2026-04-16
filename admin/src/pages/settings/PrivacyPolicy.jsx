import React from 'react'
import { Card, Form, Input, Button, message } from 'antd'

const { TextArea } = Input

function PrivacyPolicy() {
  const [form] = Form.useForm()

  const onFinish = () => {
    message.success('保存成功')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">隐私政策</h1>
        <Button type="primary" onClick={() => form.submit()}>保存</Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="政策标题" name="title" initialValue="了庸文化隐私政策">
            <Input placeholder="请输入政策标题" />
          </Form.Item>
          <Form.Item label="政策内容" name="content" initialValue={`引言
DTCI了庸文化（以下简称"我们"）非常重视用户的隐私和个人信息安全。本隐私政策旨在向您说明我们如何收集、使用、存储和保护您的个人信息。

一、信息收集
1. 个人基本信息：姓名、性别、年龄、联系方式等。
2. 基因数据：为提供基因检测服务，我们需要采集您的基因样本。
3. 健康信息：病史、家族遗传史、生活习惯等。
4. 设备信息：设备型号、操作系统、IP地址等。

二、信息使用
1. 提供服务：使用收集的信息为您提供基因检测、健康咨询等服务。
2. 报告生成：将基因检测结果整理成报告。
3. 服务优化：分析用户行为数据，持续优化我们的服务。
4. 安全保障：用于安全监控、风险防范和投诉处理。

三、信息共享
未经您同意，我们不会与任何第三方共享您的个人信息，但以下情况除外：与为您提供服务所必需的合作伙伴共享；根据法律法规、司法机关或行政机关的要求。

四、信息存储
您的信息将存储在中华人民共和国境内。基因原始数据将在检测完成后保存5年，检测报告将永久保存。

五、信息安全
我们采用业界领先的安全技术和程序来保护您的信息安全：数据传输加密、数据存储加密、严格的访问控制、定期安全审计。

六、您的权利
您对您的个人信息享有知情权、访问权、更正权、删除权、撤回同意权和数据可携带权。

七、未成年人保护
我们非常重视对未成年人信息的保护。

八、隐私政策更新
我们可能会不时更新本隐私政策。

九、联系我们
联系电话：400-888-8888
电子邮箱：privacy@dtci.com`}>
            <TextArea rows={20} placeholder="请输入政策内容" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default PrivacyPolicy
