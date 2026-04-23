import React, { useState } from 'react'
import { 
  Table, Tag, Button, Input, Space, Card, Modal, 
  Descriptions, Avatar, Tabs, Form, Select, DatePicker, message 
} from 'antd'
import { 
  SearchOutlined, EyeOutlined, CheckOutlined, CloseOutlined, 
  FilterOutlined, ExportOutlined 
} from '@ant-design/icons'
import dayjs from 'dayjs'
import request from '../../utils/request'
import './DistributorList.css'

const { RangePicker } = DatePicker;

function DistributorList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [loading, setLoading] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentDistributor, setCurrentDistributor] = useState(null)
  const [filterForm] = Form.useForm()
  const [dataSource, setDataSource] = useState([])
  const [total, setTotal] = useState(0)

  const fetchDistributors = async (params = {}) => {
    setLoading(true)
    try {
      const res = await request.get('/distributors', { params })
      const { items, total } = res
      
      const mappedData = items.map(item => ({
        ...item,
        key: item.id,
        nickname: item.user?.nickname || '未授权',
        avatar: item.user?.avatarUrl || '',
        name: item.realName || '未填写',
        phone: item.phone || '未绑定',
        referrer: '系统', // 待功能扩展
        referrerOpenid: item.user?.openid || 'N/A',
        commission: item.totalCommission || 0,
        commissionStatus: item.totalCommission === 0 ? 'none' : (item.pendingAmount > 0 ? 'unsettled' : 'settled'),
        auditor: '系统',
        updatedAt: dayjs(item.updatedAt).format('YYYY.MM.DD HH:mm'),
        statusDisplay: item.status // approved, pending, rejected
      }))
      
      setDataSource(mappedData)
      setTotal(total)
    } catch (error) {
      console.error('Failed to fetch distributors:', error)
      message.error('获取分销员列表失败')
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchDistributors()
  }, [])

  const columns = [
    {
      title: '昵称头像',
      dataIndex: 'nickname',
      key: 'nickname',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.id}`} size="small" />
          <span>{text}</span>
        </Space>
      )
    },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { 
      title: '等级', 
      dataIndex: 'level', 
      key: 'level',
      render: (level) => {
        const nameMap = { 'Bronze': '铜', 'Silver': '银', 'Gold': '金', 'bronze': '铜', 'silver': '银', 'gold': '金' };
        const displayName = nameMap[level] || level || '铜';
        const colorMap = { '铜': 'orange', '银': 'blue', '金': 'gold' };
        return <Tag color={colorMap[displayName] || 'default'}>{displayName}</Tag>;
      }
    },
    { title: '推荐人', dataIndex: 'referrer', key: 'referrer' },
    { title: '推荐人openid', dataIndex: 'referrerOpenid', key: 'referrerOpenid' },
    { 
      title: '佣金', 
      dataIndex: 'commission', 
      key: 'commission', 
      render: (val) => `¥${val.toFixed(2)}` 
    },
    { 
      title: '佣金状态', 
      dataIndex: 'commissionStatus', 
      key: 'commissionStatus',
      render: (status) => {
        if (status === 'none') return <Tag color="default">无佣金</Tag>;
        return (
          <Tag color={status === 'settled' ? 'blue' : 'orange'}>
            {status === 'settled' ? '已结算' : '未结算'}
          </Tag>
        );
      }
    },
    { title: '审核人', dataIndex: 'auditor', key: 'auditor' },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt' },
    {
      title: '审核',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showDetail(record)}>查看</Button>
      )
    }
  ]

  const showDetail = (record) => {
    setCurrentDistributor(record)
    setDetailVisible(true)
  }

  const handleBatchStatus = (newStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择分销员')
      return
    }
    const statusText = newStatus === 'active' ? '启用' : '禁用'
    Modal.confirm({
      title: `批量${statusText}`,
      content: `确定要${statusText}选中的 ${selectedRowKeys.length} 个分销员吗？`,
      onOk: () => {
        setDataSource(prev => prev.map(item => 
          selectedRowKeys.includes(item.id) ? { ...item, status: newStatus } : item
        ))
        message.success(`已批量${statusText}`)
        setSelectedRowKeys([])
      }
    })
  }

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys
  }

  return (
    <div className="distributor-list-container">
      {/* 筛选栏 */}
      <Card className="filter-card" style={{ marginBottom: 16 }}>
        <Form form={filterForm} layout="inline" onFinish={fetchDistributors} style={{ rowGap: 16 }}>
          <Form.Item name="source" label="默认筛选方">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="keyword">
            <Input 
              placeholder="请输入编号、用户名称、手机号" 
              prefix={<SearchOutlined />} 
              style={{ width: 240 }} 
            />
          </Form.Item>

          <Form.Item name="referrer" label="推荐人">
            <Input placeholder="请输入推荐名称或openid" style={{ width: 200 }} />
          </Form.Item>

          <Form.Item name="commissionStatus" label="佣金状态">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
              <Select.Option value="settled">已结算</Select.Option>
              <Select.Option value="unsettled">未结算</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<FilterOutlined />} htmlType="submit">筛选</Button>
          </Form.Item>

          <div style={{ width: '100%' }}>
            <Space size="large">
              <Form.Item name="regTime" label="注册时间">
                <RangePicker style={{ width: 260 }} />
              </Form.Item>
              <Form.Item name="updateTime" label="更新时间">
                <RangePicker style={{ width: 260 }} />
              </Form.Item>
            </Space>
          </div>
        </Form>
      </Card>

      <Card 
        title="分销员列表"
        extra={
          <Space>
            {selectedRowKeys.length > 0 && (
              <>
                <Button 
                  icon={<CheckOutlined />} 
                  onClick={() => handleBatchStatus('active')}
                >
                  批量启用
                </Button>
                <Button 
                  danger 
                  icon={<CloseOutlined />} 
                  onClick={() => handleBatchStatus('inactive')}
                >
                  批量禁用
                </Button>
              </>
            )}
            <Button icon={<ExportOutlined />}>导出</Button>
          </Space>
        }
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          loading={loading}
          pagination={{ 
            total: total,
            showSizeChanger: true, 
            showTotal: (total) => `共 ${total} 条` 
          }}
          onChange={(pagination) => {
            fetchDistributors({
              page: pagination.current,
              limit: pagination.pageSize
            })
          }}
        />
      </Card>

      <Modal
        title="分销员详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
      >
        {currentDistributor && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="分销员ID">{currentDistributor.id}</Descriptions.Item>
            <Descriptions.Item label="姓名">{currentDistributor.name}</Descriptions.Item>
            <Descriptions.Item label="昵称">{currentDistributor.nickname}</Descriptions.Item>
            <Descriptions.Item label="手机号">{currentDistributor.phone}</Descriptions.Item>
            <Descriptions.Item label="等级">
              {(() => {
                const nameMap = { 'Bronze': '铜', 'Silver': '银', 'Gold': '金', 'bronze': '铜', 'silver': '银', 'gold': '金' };
                return nameMap[currentDistributor.level] || currentDistributor.level || '铜';
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="累计佣金">¥{currentDistributor.commission?.toFixed(2) || '0.00'}</Descriptions.Item>
            <Descriptions.Item label="推荐人">{currentDistributor.referrer}</Descriptions.Item>
            <Descriptions.Item label="推荐人openid">{currentDistributor.referrerOpenid}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={currentDistributor.statusDisplay === 'approved' ? 'green' : 'orange'}>
                {currentDistributor.statusDisplay === 'approved' ? '已审核' : '待审核'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="注册时间">{currentDistributor.updatedAt}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default DistributorList

