import React from 'react'
import { Card, Form, Input, Button, message } from 'antd'

const { TextArea } = Input

function ServiceAgreement() {
  const [form] = Form.useForm()

  const onFinish = () => {
    message.success('保存成功')
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">服务协议</h1>
        <Button type="primary" onClick={() => form.submit()}>保存</Button>
      </div>

      <Card>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item label="协议标题" name="title" initialValue="了庸文化用户协议">
            <Input placeholder="请输入协议标题" />
          </Form.Item>
          <Form.Item label="协议内容" name="content" initialValue={`一、服务条款的确认和接受
欢迎使用DTCI了庸文化服务。本服务协议是用户与DTCI了庸文化之间关于使用本服务所订立的协议。

二、服务内容
1. DTCI了庸文化通过本服务向用户提供基因检测、健康咨询等健康管理服务。
2. 服务的具体内容包括但不限于：基因样本采集、基因检测分析、检测报告生成、健康建议等。

三、用户注册
1. 用户承诺在使用本服务时遵守中华人民共和国相关法律法规。
2. 用户应提供真实、准确、完整的注册信息。

四、基因检测服务
1. 用户同意并授权DTCI了庸文化采集、处理其基因样本用于检测服务。
2. 检测结果仅供参考，不作为医疗诊断依据。

五、隐私保护
DTCI了庸文化承诺尊重并保护用户的个人隐私。

六、知识产权
本服务中包含的所有内容均受知识产权法律法规保护。

七、免责声明
1. 因不可抗力导致的服务中断，DTCI了庸文化不承担责任。
2. 检测结果仅作为健康参考，不构成医疗建议或诊断。

八、争议解决
本协议的解释、执行及争议解决均适用中华人民共和国法律。`}>
            <TextArea rows={20} placeholder="请输入协议内容" />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default ServiceAgreement
