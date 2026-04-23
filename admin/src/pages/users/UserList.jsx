import React, { useState } from 'react'
import { 
  Table, Tag, Button, Input, Space, Card, 
  Modal, Descriptions, Avatar, Form, Select, 
  DatePicker, Switch, Row, Col, Radio, DatePicker as AntDatePicker
} from 'antd'
import { SearchOutlined, EyeOutlined, EditOutlined, FilterOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import request from '../../utils/request'
import './UserList.css'

const { RangePicker } = AntDatePicker;

function UserList() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const fetchUsers = async (params = {}) => {
    setLoading(true);
    try {
      const data = await request.get('/users', { params });
      
      // 数据映射
      const mappedData = data.map(user => {
        // 严格处理头像：只允许正常的 http/https 完整路径或以 / 开头的相对路径，且排除微信临时路径
        let avatarUrl = user.avatarUrl || '';
        const isAbsolute = avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');
        const isRelative = avatarUrl.startsWith('/');
        const isTemp = avatarUrl.startsWith('http://tmp/');
        
        if ((isAbsolute && !isTemp) || isRelative) {
          if (isRelative) {
            // 对相对路径补全域名
            avatarUrl = `http://localhost:3100${avatarUrl}`;
          }
        } else {
          // 兜底图
          avatarUrl = 'http://localhost:3100/logo.png'; 
        }

        return {
          id: user.id.toString().padStart(7, '0'),
          realId: user.id,
          avatar: avatarUrl,
          name: user.nickname || '未授权用户',
          phone: user.phone || '未绑定',
          gender: user.gender === 'male' || user.gender === '男' ? '男' : (user.gender === 'female' || user.gender === '女' ? '女' : '未填写'),
          city: user.city || '未填写',
          age: user.age || '未填写',
          profession: user.profession || '未填写',
          totalPaid: user.totalPaid || 0,
          orderCount: user._count?.orders || 0,
          lastPaidTime: '暂无记录', // 待进一步对接订单明细
          status: true // 默认状态
        };
      });
      
      setDataSource(mappedData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { title: '用户ID', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: '用户',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <Space style={{ whiteSpace: 'nowrap' }}>
          <Avatar src={record.avatar} size="small" />
          <span>{text}</span>
        </Space>
      )
    },
    { 
      title: '手机号', 
      dataIndex: 'phone', 
      key: 'phone',
      render: (text) => <span style={{ whiteSpace: 'nowrap' }}>{text}</span>
    },
    { title: '性别', dataIndex: 'gender', key: 'gender', width: 100 },
    { title: '城市', dataIndex: 'city', key: 'city', width: 100 },
    { title: '年龄', dataIndex: 'age', key: 'age', width: 100 },
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
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => showDetail(record)}>查看</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
        </Space>
      )
    }
  ]

  const showDetail = (record) => {
    setCurrentUser(record)
    setDetailVisible(true)
  }

  const onSearch = (values) => {
    const params = {};
    if (values.keyword) params.keyword = values.keyword;
    if (values.gender && values.gender !== 'all') params.gender = values.gender;
    if (values.status && values.status !== 'all') params.status = values.status;
    
    console.log('Final Search Params:', params);
    fetchUsers(params);
  };

  return (
    <div className="user-list-container">
      {/* 复杂的筛选栏 */}
      <Card className="filter-card">
        <Form form={form} layout="inline" onFinish={onSearch} style={{ alignItems: 'center' }}>
          <Form.Item name="source" label="默认筛选方">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="keyword">
            <Input placeholder="请输入编号、用户名称、手机号" prefix={<SearchOutlined />} style={{ width: 220 }} />
          </Form.Item>

          <Form.Item name="status" label="账户状态">
            <Select placeholder="请选择" defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
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

          <Form.Item>
            <Button type="primary" icon={<FilterOutlined />} htmlType="submit">
              筛选
            </Button>
          </Form.Item>

          <div style={{ width: '100%', marginTop: 16 }}>
             <Space size="large">
               <Form.Item name="paidStatus">
                 <Radio.Group>
                    <Radio value="unpaid">未付费</Radio>
                    <Radio value="paid" checked>已付费</Radio>
                 </Radio.Group>
               </Form.Item>
               
               <Form.Item name="gender" label="性别">
                 <Select placeholder="请选择" defaultValue="all" style={{ width: 100 }}>
                   <Select.Option value="all">全部</Select.Option>
                   <Select.Option value="男">男</Select.Option>
                   <Select.Option value="女">女</Select.Option>
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
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
          scroll={{ x: 1500 }}
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
            <Descriptions.Item label="头像" span={2}>
              <Avatar src={currentUser.avatar} size={64} />
            </Descriptions.Item>
            <Descriptions.Item label="用户ID">{currentUser.id}</Descriptions.Item>
            <Descriptions.Item label="用户名">{currentUser.name}</Descriptions.Item>
            <Descriptions.Item label="手机号">{currentUser.phone}</Descriptions.Item>
            <Descriptions.Item label="性别">{currentUser.gender}</Descriptions.Item>
            <Descriptions.Item label="年龄">{currentUser.age}</Descriptions.Item>
            <Descriptions.Item label="城市">{currentUser.city}</Descriptions.Item>
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
