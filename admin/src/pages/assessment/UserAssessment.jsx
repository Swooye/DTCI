import React, { useState } from 'react'
import { 
  Table, Tag, Button, Input, Space, Card, Form, 
  Select, DatePicker, Avatar, Modal, message 
} from 'antd'
import { 
  SearchOutlined, EyeOutlined, FilterOutlined, 
  FileTextOutlined, DeleteOutlined, ExportOutlined 
} from '@ant-design/icons'
import './UserAssessment.css'

const { RangePicker } = DatePicker;

function UserAssessment() {
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  // Mock data state for batch operations
  const [dataSource, setDataSource] = useState([
    { 
      id: "0035432", 
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user1',
      userName: '小刀',
      assessmentName: 'DTCI 135型人格测评 评 男生版',
      d_gene: 10.00,
      t_gene: 10.00,
      c_gene: 10.00,
      b_gene: 10.00,
      i_gene: 10.00,
      io_gene: 10.00,
      type_gene: 10.00,
      layer_gene: 10.00,
      amount: 88.00,
      status: 'paid',
      time: '2024-05-20 10:30'
    },
    { 
      id: "0035433", 
      userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user2',
      userName: '小刀',
      assessmentName: 'DTCI 135型人格测评 评 女生版',
      d_gene: 10.00,
      t_gene: 10.00,
      c_gene: 10.00,
      b_gene: 10.00,
      i_gene: 10.00,
      io_gene: 10.00,
      type_gene: 10.00,
      layer_gene: 10.00,
      amount: 88.00,
      status: 'pending',
      time: '2024-05-20 11:45'
    }
  ]);

  const columns = [
    { title: '订单编号', dataIndex: 'id', key: 'id', width: 100 },
    {
      title: '用户',
      dataIndex: 'userName',
      key: 'userName',
      width: 150,
      render: (text, record) => (
        <Space>
          <Avatar src={record.userAvatar} size="small" />
          <span>{text}</span>
        </Space>
      )
    },
    { title: '测评问卷名称', dataIndex: 'assessmentName', key: 'assessmentName', width: 280 },
    { title: 'D型基因', dataIndex: 'd_gene', key: 'd_gene', width: 110, render: v => v.toFixed(2) },
    { title: 'T型基因', dataIndex: 't_gene', key: 't_gene', width: 110, render: v => v.toFixed(2) },
    { title: 'C型基因', dataIndex: 'c_gene', key: 'c_gene', width: 110, render: v => v.toFixed(2) },
    { title: 'B型基因', dataIndex: 'b_gene', key: 'b_gene', width: 110, render: v => v.toFixed(2) },
    { title: 'I型基因', dataIndex: 'i_gene', key: 'i_gene', width: 110, render: v => v.toFixed(2) },
    { title: 'I+O基因', dataIndex: 'io_gene', key: 'io_gene', width: 120, render: v => v.toFixed(2) },
    { title: '型基因', dataIndex: 'type_gene', key: 'type_gene', width: 110, render: v => v.toFixed(2) },
    { title: '层基因', dataIndex: 'layer_gene', key: 'layer_gene', width: 110, render: v => v.toFixed(2) },
    { title: '订单金额', dataIndex: 'amount', key: 'amount', render: v => `¥${v.toFixed(2)}` },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (s) => <Tag color={s === 'paid' ? 'green' : 'orange'}>{s === 'paid' ? '已支付' : '待支付'}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      render: () => (
        <Space>
          <Button type="link" size="small" icon={<EyeOutlined />}>查看</Button>
        </Space>
      )
    }
  ]

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的测评订单');
      return;
    }
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 条测评订单吗？此操作不可撤销。`,
      okText: '确定删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setDataSource(prev => prev.filter(item => !selectedRowKeys.includes(item.id)));
        message.success('批量删除成功');
        setSelectedRowKeys([]);
      }
    });
  };

  const handleBatchExport = () => {
    if (selectedRowKeys.length === 0) {
      message.info('正在导出全部测评订单...');
    } else {
      message.success(`正在导出选中的 ${selectedRowKeys.length} 条测评订单...`);
    }
  };

  return (
    <div className="user-assessment-container">
      <Card className="filter-card">
        <Form form={form} layout="inline" style={{ alignItems: 'center' }}>
          <Form.Item name="source" label="默认筛选方">
            <Select defaultValue="all" style={{ width: 120 }}>
              <Select.Option value="all">全部</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="keyword">
            <Input placeholder="输入编号/用户/手机" prefix={<SearchOutlined />} style={{ width: 200 }} />
          </Form.Item>

          <Form.Item name="paper" label="问卷名称">
            <Select placeholder="请选择" style={{ width: 180 }}>
              <Select.Option value="1">DTCI 135型人格测评</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="订单状态">
            <Select placeholder="请选择" style={{ width: 120 }}>
              <Select.Option value="paid">已支付</Select.Option>
              <Select.Option value="pending">待支付</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="time" label="提交时间">
            <RangePicker style={{ width: 240 }} />
          </Form.Item>

          <Form.Item name="operator" label="操作人">
            <Select placeholder="请选择" style={{ width: 120 }}>
              <Select.Option value="admin1">管理员1</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" icon={<FilterOutlined />}>
              筛选
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Card 
        style={{ marginTop: 16 }}
        title="测评订单列表"
        extra={
          <Space>
            {selectedRowKeys.length > 0 && (
              <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
                批量删除 ({selectedRowKeys.length})
              </Button>
            )}
            <Button icon={<ExportOutlined />} onClick={handleBatchExport}>
              {selectedRowKeys.length > 0 ? `导出选中 (${selectedRowKeys.length})` : '导出全部'}
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id"
          scroll={{ x: 1800 }}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys
          }}
          pagination={{ showSizeChanger: true, showTotal: (total) => `共 ${total} 条` }}
        />
      </Card>
    </div>
  )
}

export default UserAssessment

