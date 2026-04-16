import React from 'react'
import { Row, Col, Card, Statistic, Progress, Table } from 'antd'
import ReactECharts from 'echarts-for-react'
import {
  UserOutlined,
  DollarOutlined,
  TeamOutlined,
  FileDoneOutlined,
  RiseOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import './Dashboard.css'

function Dashboard() {
  // 营收统计图表配置
  const getLineOption = () => ({
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['05-01', '05-05', '05-10', '05-15', '05-20', '05-25', '05-30'],
      axisLine: { lineStyle: { color: '#eee' } },
      axisLabel: { color: '#999' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    series: [
      {
        name: '营收(元)',
        type: 'line',
        smooth: true,
        data: [12000, 18000, 15000, 22000, 28000, 25000, 32000],
        itemStyle: { color: '#3BA38E' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [{ offset: 0, color: 'rgba(59, 163, 142, 0.3)' }, { offset: 1, color: 'rgba(59, 163, 142, 0)' }]
          }
        }
      }
    ]
  });

  return (
    <div className="dashboard-container">
      {/* 顶部仪表盘卡片 */}
      <Row gutter={[16, 16]}>
        {/* 用户概览 */}
        <Col xs={24} xl={10}>
          <Card className="overview-card user-overview">
            <div className="card-header">用户概览</div>
            <Row gutter={16} align="middle">
              <Col span={16}>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Statistic title="累计注册用户" value={6666} prefix={<UserOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="参与测评用户数" value={2666} prefix={<TeamOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="完成测评用户数" value={2666} prefix={<FileDoneOutlined />} />
                  </Col>
                  <Col span={12}>
                    <Statistic title="付费用户" value={660} prefix={<DollarOutlined />} />
                  </Col>
                </Row>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={80} 
                  strokeColor="#fff" 
                  trailColor="rgba(255,255,255,0.2)"
                  format={p => (
                    <div style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: 1 }}>{p}%</div>
                      <div style={{ fontSize: '12px', marginTop: '4px' }}>转化率</div>
                    </div>
                  )}
                  width={100}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 营收概括 */}
        <Col xs={24} sm={12} xl={4}>
          <Card className="overview-card revenue-overview">
            <div className="card-header">营收概括</div>
            <Statistic title="累计收入" value={76600} prefix="¥" />
            <Statistic title="今日收入" value={766} prefix="¥" className="sub-stat" />
          </Card>
        </Col>

        {/* 分销员概况 */}
        <Col xs={24} sm={12} xl={5}>
          <Card className="overview-card distributor-overview">
            <div className="card-header">分销员概况</div>
            <Row gutter={[0, 16]}>
              <Col span={12}>
                <Statistic title="分销员" value={789} />
              </Col>
              <Col span={12}>
                <Statistic title="分销营收" value={789} prefix="¥" />
              </Col>
              <Col span={12}>
                <Statistic title="支付佣金" value={789} prefix="¥" />
              </Col>
              <Col span={12}>
                <Statistic title="待结佣金" value={789} prefix="¥" />
              </Col>
            </Row>
          </Card>
        </Col>

        {/* 测评概况 */}
        <Col xs={24} sm={12} xl={5}>
          <Card className="overview-card assessment-overview">
            <div className="card-header">测评概况</div>
            <Row align="middle">
              <Col span={12}>
                <Statistic title="订单数" value={3668} prefix={<FileDoneOutlined />} />
              </Col>
              <Col span={12} style={{ textAlign: 'center' }}>
                <Progress 
                  type="circle" 
                  percent={30} 
                  strokeColor="#fff" 
                  trailColor="rgba(255,255,255,0.2)"
                  format={p => <div style={{color: '#fff'}}><div style={{fontSize: '20px', fontWeight: 'bold'}}>{p}%</div><div style={{fontSize: '10px'}}>完成率</div></div>}
                  width={80}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 营收统计图表 */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="营收统计" className="chart-card">
            <div className="chart-info">
              <Statistic title="本月营收总额" value={6666} prefix="¥" />
              <div className="trend-label">同比增长: <span className="up">+20%</span></div>
            </div>
            <ReactECharts option={getLineOption()} style={{ height: 350 }} />
          </Card>
        </Col>
      </Row>

      <view style={{height: 48}}></view>
    </div>
  )
}

export default Dashboard
