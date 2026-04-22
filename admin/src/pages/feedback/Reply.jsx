import React, { useState, useEffect } from 'react'
import { Card, Descriptions, Image, Input, Button, Space, Divider, Avatar, message, Spin } from 'antd'
import { UserOutlined, SendOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import { useLocation, useNavigate } from 'react-router-dom'
import request from '../../utils/request'
import dayjs from 'dayjs'

const { TextArea } = Input

function Reply() {
  const navigate = useNavigate()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const feedbackId = query.get('id')

  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (feedbackId) {
      fetchFeedback()
    }
  }, [feedbackId])

  const fetchFeedback = async () => {
    setLoading(true)
    try {
      const res = await request.get(`/feedbacks/${feedbackId}`)
      setFeedback(res)
    } catch (err) {
      console.error('Failed to fetch feedback:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async () => {
    if (!replyText.trim()) {
      message.warning('请输入回复内容')
      return
    }

    setSubmitting(true)
    try {
      await request.post(`/feedbacks/${feedbackId}/reply`, {
        replyContent: replyText
      })
      message.success('回复成功')
      setReplyText('')
      fetchFeedback() // Refresh to show the reply in conversation
    } catch (err) {
      console.error('Failed to reply:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ padding: 50, textAlign: 'center' }}><Spin size="large" /></div>
  if (!feedback) return <div>未找到该反馈</div>

  const labelMap = { 'suggestion': '功能建议', 'bug': 'Bug反馈', 'experience': '体验问题', 'content': '内容问题', 'other': '其他' }

  return (
    <div>
      <div className="page-header">
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} />
          <h1 className="page-title">回复反馈</h1>
        </Space>
      </div>

      <Card title="反馈详情" style={{ marginBottom: 16 }}>
        <Descriptions column={2}>
          <Descriptions.Item label="反馈ID">{feedback.id}</Descriptions.Item>
          <Descriptions.Item label="类型">{labelMap[feedback.type] || feedback.type}</Descriptions.Item>
          <Descriptions.Item label="用户">{feedback.user?.nickName}</Descriptions.Item>
          <Descriptions.Item label="时间">{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</Descriptions.Item>
          <Descriptions.Item label="内容" span={2}>{feedback.content}</Descriptions.Item>
          {feedback.images && JSON.parse(feedback.images).length > 0 && (
            <Descriptions.Item label="截图" span={2}>
              <Image.PreviewGroup>
                {JSON.parse(feedback.images).map((src, index) => {
                  const fullSrc = src.startsWith('/') ? `http://localhost:3100${src}` : src
                  return <Image key={index} src={fullSrc} width={80} height={80} style={{ marginRight: 8, borderRadius: 4, cursor: 'pointer' }} />
                })}
              </Image.PreviewGroup>
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="回复记录">
        <div className="conversation">
          <div className="message user">
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
            <div className="message-content">
              <div className="message-header">
                <span className="message-name">{feedback.user?.nickName}</span>
                <span className="message-time">{dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm')}</span>
              </div>
              <div className="message-body">{feedback.content}</div>
            </div>
          </div>

          {feedback.replyContent && (
            <div className="message admin">
              <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#1890ff' }} />
              <div className="message-content">
                <div className="message-header">
                  <span className="message-name">系统管理员</span>
                  <span className="message-time">{dayjs(feedback.replyTime).format('YYYY-MM-DD HH:mm')}</span>
                </div>
                <div className="message-body">{feedback.replyContent}</div>
              </div>
            </div>
          )}
        </div>

        <Divider />

        <div className="reply-form">
          <TextArea 
            rows={4} 
            placeholder="请输入回复内容..." 
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <Space style={{ marginTop: 16 }}>
            <Button 
              type="primary" 
              icon={<SendOutlined />} 
              onClick={handleReply}
              loading={submitting}
            >
              发送回复
            </Button>
          </Space>
        </div>
      </Card>

      <style>{`
        .conversation {
          max-height: 400px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .message {
          display: flex;
          margin-bottom: 24px;
        }
        .message.admin {
          flex-direction: row-reverse;
          align-self: flex-end;
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
          text-align: left;
        }
        .message.admin .message-body {
          background-color: #e6f7ff;
        }
      `}</style>
    </div>
  )
}

export default Reply
