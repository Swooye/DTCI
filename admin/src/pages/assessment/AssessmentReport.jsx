import React from 'react'
import { Card, Descriptions, Table, Tag, Button, Space, Row, Col, Progress } from 'antd'
import { DownloadOutlined, PrinterOutlined } from '@ant-design/icons'

function AssessmentReport() {
  const reportData = {
    user: '张三',
    assessment: '基因类型测评',
    date: '2024-05-20',
    score: 85,
    geneType: 'INTJ - 策略型人格',
    summary: '您的人格类型倾向于内向、直觉、思考和判断。您具有较强的逻辑思维能力和战略眼光，善于独立分析和解决问题。'
  }

  const dimensionData = [
    { dimension: '逻辑思维', score: 90, maxScore: 100 },
    { dimension: '创新能力', score: 75, maxScore: 100 },
    { dimension: '执行力', score: 82, maxScore: 100 },
    { dimension: '沟通能力', score: 68, maxScore: 100 },
    { dimension: '情绪管理', score: 78, maxScore: 100 }
  ]

  const columns = [
    { title: '维度', dataIndex: 'dimension', key: 'dimension' },
    { title: '得分', dataIndex: 'score', key: 'score', render: (score) => `${score}分` },
    { title: '满分', dataIndex: 'maxScore', key: 'maxScore' },
    {
      title: '等级',
      dataIndex: 'score',
      key: 'level',
      render: (score) => {
        if (score >= 90) return <Tag color="gold">优秀</Tag>
        if (score >= 75) return <Tag color="green">良好</Tag>
        if (score >= 60) return <Tag color="orange">一般</Tag>
        return <Tag color="red">较差</Tag>
      }
    }
  ]

  const adviceData = [
    { type: '建议', content: '继续保持逻辑思维优势，加强团队协作' },
    { type: '建议', content: '可适当提高沟通能力培训' },
    { type: '建议', content: '建议参与更多创新项目' }
  ]

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">测评报告</h1>
        <Space>
          <Button icon={<PrinterOutlined />}>打印</Button>
          <Button type="primary" icon={<DownloadOutlined />}>导出PDF</Button>
        </Space>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="基本信息" style={{ marginBottom: 16 }}>
            <Descriptions column={2}>
              <Descriptions.Item label="用户">{reportData.user}</Descriptions.Item>
              <Descriptions.Item label="测评名称">{reportData.assessment}</Descriptions.Item>
              <Descriptions.Item label="测评日期">{reportData.date}</Descriptions.Item>
              <Descriptions.Item label="总分">{reportData.score}分</Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="基因类型分析" style={{ marginBottom: 16 }}>
            <div className="gene-type-section">
              <Tag color="blue" style={{ fontSize: 18, padding: '8px 16px' }}>{reportData.geneType}</Tag>
              <p style={{ marginTop: 16, lineHeight: 1.8 }}>{reportData.summary}</p>
            </div>
          </Card>

          <Card title="各维度得分">
            <Table columns={columns} dataSource={dimensionData} rowKey="dimension" pagination={false} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="综合评分" style={{ marginBottom: 16 }}>
            <Progress
              type="circle"
              percent={reportData.score}
              format={(percent) => `${percent}分`}
              strokeColor="#1890ff"
            />
          </Card>

          <Card title="建议与指导">
            {adviceData.map((item, index) => (
              <div key={index} style={{ marginBottom: 16, padding: 12, background: '#f5f5f5', borderRadius: 4 }}>
                <Tag color="green">{item.type}</Tag>
                <p style={{ margin: '8px 0 0 0', color: '#666' }}>{item.content}</p>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default AssessmentReport
