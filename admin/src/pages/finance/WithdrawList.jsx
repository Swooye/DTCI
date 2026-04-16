import React, { useState } from 'react'
import { Table, Tag, Button, Input, Space, Card, Modal, message } from 'antd'
import { SearchOutlined, CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons'

function WithdrawList() {
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState(null)

  const dataSource = [
    { id: 1, distributor: '张分销', phone: '138****8888', amount: 5000, bank: '中国工商银行', account: '6222********1234', status: 'pending', applyTime: '2024-05-20 10:30', completeTime: '-' },
    { id: 2, distributor: '李分销', phone: '139****6666', amount: 3000, bank: '中国建设银行', account: '6227********5678', status: 'approved', applyTime: '2024-05-19 14:20', completeTime: '2024-05-19 16:30' },
    { id: 3, distributor: '王分销', phone: '137****5555', amount: 2000, bank: '中国农业银行', account: '6228********9012', status: 'rejected', applyTime: '2024-05-18 09:15', completeTime: '2024-05-18 11:00' },
    { id: 4, distributor: '赵分销', phone: '136****4444', amount: 8000, bank: '招商银行', account: '6226********3456', status: 'pending', applyTime: '2024-05-21 11:40', completeTime: '-' }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '分销员', dataIndex: 'distributor', key: 'distributor' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '提现金额', dataIndex: 'amount', key: 'amount', render: (val) => `¥${val}` },
    { title: '银行', dataIndex: 'bank', key: 'bank' },
    { title: '账号', dataIndex: 'account', key: 'account' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { label: '待审核', color: 'orange' },
          approved: { label: '已通过', color: 'green' },
          rejected: { label: '已拒绝', color: 'red' }
        }
        return <Tag color={statusMap[status].color}>{statusMap[status].label}</Tag>
      }
    },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime' },
    { title: '处理时间', dataIndex: 'completeTime', key: 'completeTime' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<EyeOutlined />} onClick={() => showDetail(record)}>详情</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckOutlined />} onClick={() => handleApprove(record)}>通过</Button>
              <Button type="link" danger icon={<CloseOutlined />} onClick={() => handleReject(record)}>拒绝</Button>
            </>
          )}
        </Space>
      )
    }
  ]

  const showDetail = (record) => {
    setCurrentRecord(record)
    setDetailVisible(true)
  }

  const handleApprove = (record) => {
    Modal.confirm({
      title: '确认通过',
      content: `确认给 ${record.distributor} 提现 ¥${record.amount}？`,
      onOk: () => {
        message.success('已通过')
      }
    })
  }

  const handleReject = (record) => {
    Modal.confirm({
      title: '确认拒绝',
      content: `确认拒绝 ${record.distributor} 的提现申请？`,
      onOk: () => {
        message.success('已拒绝')
      }
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">提现列表</h1>
      </div>

      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="分销员/手机号" prefix={<SearchOutlined />} style={{ width: 200 }} />
        </Space>
        <Table columns={columns} dataSource={dataSource} rowKey="id" />
      </Card>

      <Modal
        title="提现详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>
        ]}
      >
        {currentRecord && (
          <div>
            <p><strong>分销员：</strong>{currentRecord.distributor}</p>
            <p><strong>手机号：</strong>{currentRecord.phone}</p>
            <p><strong>提现金额：</strong>¥{currentRecord.amount}</p>
            <p><strong>银行：</strong>{currentRecord.bank}</p>
            <p><strong>账号：</strong>{currentRecord.account}</p>
            <p><strong>申请时间：</strong>{currentRecord.applyTime}</p>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default WithdrawList
