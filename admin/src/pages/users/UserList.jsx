import React, { useState } from 'react'
import { 
  Table, Tag, Button, Input, Space, Card, 
  Modal, Descriptions, Avatar, Form, Select, 
  DatePicker, Switch, Row, Col, Radio, DatePicker as AntDatePicker
} from 'antd'
import { SearchOutlined, EyeOutlined, DeleteOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import './UserList.css'

const { RangePicker } = AntDatePicker;

function UserList() {
  const [form] = Form.useForm();
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const dataSource = [
    { 
      id: "0035432", 
      avatar: '/assets/images/founder.jpg', 
      name: '小刀', 
      phone: '17710000000', 
      gender: '男', 
      age: 28, 
      profession: '运营策划',
      totalPaid: 8888.00,
      orderCount: 15,
      lastPaidTime: '2020-03-01 15:00',
      status: true 
    },
    { 
      id: "0035433", 
      avatar: '/assets/images/founder.jpg', 
      name: '小刀', 
      phone: '17710000000', 
      gender: '女', 
      age: 36, 
      profession: '企业家',
      totalPaid: 8888.00,
      orderCount: 15,
      lastPaidTime: '2020-03-01 15:00',
      status: true 
    },
    // ... 模拟数据
  ]

  const columns = [
    { title: '用户ID', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar src={record.avatar} size="small" />
          <span>{text}</span>
        </Space>
      )
    },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 60 },
    { title: '年龄', dataIndex: 'age', key: 'age', width: 60 },
    { title: '职业', dataIndex: 'profession', key: 'profession' },
    { 
      title: '付费总额', 
      dataIndex: 'totalPaid', 
      key: 'totalPaid',
      render: (val) => val.toFixed(2)
    },
    { title: '订单数量', dataIndex: 'orderCount', key: 'orderCount', width: 100 },
    { title: '最近付费时间', dataIndex: 'lastPaidTime', key: 'lastPaidTime' },
    {
      title: '账户禁用',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Switch checked={status} size="small" />
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      )
    }
  ]

  const showDetail = (record) => {
    setCurrentUser(record)
    setDetailVisible(true)
  }

  const onSearch = (values) => {
    console.log('Search factors:', values);
  };

  return (
    <div className="user-list-container">
      {/* 复杂的筛选栏 */}
      <Card className="filter-card">
        <Form form={form} layout="inline" onFinish={onSearch}>
          <Form.Item name="source" label="默认筛选方">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="keyword">
            <Input placeholder="请输入编号、用户名称、手机号" prefix={<SearchOutlined />} style={{ width: 220 }} />
          </Form.Item>

          <Form.Item name="status" label="账户状态">
            <Select placeholder="项目1" style={{ width: 120 }}>
              <Select.Option value="active">正常</Select.Option>
              <Select.Option value="banned">禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="createdAt" label="注册时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>

          <Form.Item name="operator" label="操作人">
            <Select placeholder="请选择" style={{ width: 120 }}>
              <Select.Option value="admin1">管理员1</Select.Option>
            </Select>
          </Form.Item>

          <Button type="primary" icon={<FilterOutlined />} htmlType="submit" style={{ background: '#3BA38E' }}>
            筛选
          </Button>

          <div style={{ width: '100%', marginTop: 16 }}>
             <Space size="large">
               <Form.Item name="paidStatus">
                 <Radio.Group>
                    <Radio value="unpaid">未付费</Radio>
                    <Radio value="paid" checked>已付费</Radio>
                 </Radio.Group>
               </Form.Item>
               
               <Form.Item name="gender" label="性别">
                 <Select placeholder="Item 1" style={{ width: 100 }}>
                   <Select.Option value="male">男</Select.Option>
                   <Select.Option value="female">女</Select.Option>
                 </Select>
               </Form.Item>

               <Form.Item name="lastPaidAt" label="最近付费时间">
                  <DatePicker placeholder="请选择" style={{ width: 160 }} />
               </Form.Item>
             </Space>
          </div>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          pagination={{ total: 100, showSizeChanger: true }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <Modal
        title="用户详情"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={[<Button key="close" onClick={() => setDetailVisible(false)}>关闭</Button>]}
        width={600}
      >
        {currentUser && (
          <Descriptions column={2} bordered>
            <Descriptions.Item label="用户ID">{currentUser.id}</Descriptions.Item>
            <Descriptions.Item label="用户名">{currentUser.name}</Descriptions.Item>
            <Descriptions.Item label="手机号">{currentUser.phone}</Descriptions.Item>
            <Descriptions.Item label="性别">{currentUser.gender}</Descriptions.Item>
            <Descriptions.Item label="职业">{currentUser.profession}</Descriptions.Item>
            <Descriptions.Item label="付费总额">¥{currentUser.totalPaid}</Descriptions.Item>
            <Descriptions.Item label="订单数">{currentUser.orderCount}</Descriptions.Item>
            <Descriptions.Item label="最近付费">{currentUser.lastPaidTime}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}

export default UserList
