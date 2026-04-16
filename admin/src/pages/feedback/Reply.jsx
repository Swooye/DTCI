import React from 'react'
import { Card, Descriptions, Image, Input, Button, Space, Divider, Avatar } from 'antd'
import { UserOutlined, SendOutlined } from '@ant-design/icons'

const { TextArea } = Input

function Reply() {
  const feedbackData = {
    id: 1,
    user: '张三',
    avatar: '',
    type: '功能建议',
    content: '希望增加预约提醒功能，每次预约成功后会收到提醒通知，这样就不会错过预约时间了。',
    images: ['https://via.placeholder.com/100', 'https://via.placeholder.com/100'],
    time: '2024-05-20 10:30:25'
  }

  const replies = [
    { id: 1, type: 'user', content: '希望增加预约提醒功能', time: '2024-05-20 10:30:25', name: '张三' },
    { id: 2, type: 'admin', content: '感谢您的建议，我们已记录，会在后续版本中考虑添加此功能。', time: '2024-05-20 14:20:10', name: '客服小D' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">回复反馈</h1>
      </div>

      <Card title="反馈详情" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="反馈ID">{feedbackData.id}</Descriptions.Item>
          <Descriptions.Item label="类型">{feedbackData.type}</Descriptions.Item>
          <Descriptions.Item label="用户">{feedbackData.user}</Descriptions.Item>
          <Descriptions.Item label="时间">{feedbackData.time}</Descriptions.Item>
          <Descriptions.Item label="内容" span={2}>{feedbackData.content}</Descriptions.Item>
          {feedbackData.images.length > 0 && (
            <Descriptions.Item label="截图" span={2}>
              <Image.PreviewGroup>
                {feedbackData.images.map((src, index) => (
                  <Image key={index} src={src} width={80} height={80} style={{ marginRight: 8 }} />
                ))}
              </Image.PreviewGroup>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="对话记录">
        <div className="conversation">
          {replies.map((reply) => (
            <div key={reply.id} className={`message ${reply.type}`}>
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: reply.type === 'admin' ? '#1890ff' : '#52c41a' }} />
              <div className="message-content">
                <div className="message-header">
                  <span className="message-name">{reply.name}</span>
                  <span className="message-time">{reply.time}</span>
                </div>
                <div className="message-body">{reply.content}</div>
              </div>
            </div>
          ))}
        </div>

        <Divider />

        <div className="reply-form">
          <TextArea rows={4} placeholder="请输入回复内容..." />
          <Space style={{ marginTop: 16 }}>
            <Button type="primary" icon={<SendOutlined />}>发送</Button>
            <Button>快捷回复</Button>
          </Space>
        </div>
      </Card>

      <style>{`
        .conversation {
          max-height: 400px;
          overflow-y: auto;
        }
        .message {
          display: flex;
          margin-bottom: 24px;
        }
        .message.admin {
          flex-direction: row-reverse;
        }
        .message-content {
          max-width: 70%;
          margin-left: 12px;
        }
        .message.admin .message-content {
          margin-left: 0;
          margin-right: 12px;
          text-align: right;
        }
        .message-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .message.admin .message-header {
          flex-direction: row-reverse;
        }
        .message-name {
          font-weight: 500;
          color: #333;
        }
        .message-time {
          font-size: 12px;
          color: #999;
        }
        .message-body {
          background-color: #f5f5f5;
          padding: 12px;
          border-radius: 8px;
          line-height: 1.6;
        }
        .message.admin .message-body {
          background-color: #e6f7ff;
        }
      `}</style>
    </div>
  )
}

export default Reply
