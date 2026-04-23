import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Select, Tag, message, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'
import request from '../../utils/request'

function SystemUser() {
  const [visible, setVisible] = useState(false)
  const [roleVisible, setRoleVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [form] = Form.useForm()
  const [filterForm] = Form.useForm()

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const values = filterForm.getFieldsValue()
      const params = {
        search: values.search,
        role: values.role,
        status: values.status,
      }
      if (values.dateRange && values.dateRange.length === 2) {
        params.dateStart = values.dateRange[0].startOf('day').toISOString()
        params.dateEnd = values.dateRange[1].endOf('day').toISOString()
      }
      const data = await request.get('/admins', { params })
      setDataSource(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleSave = async (values) => {
    try {
      if (editingId) {
        await request.patch(`/admins/${editingId}`, values)
      } else {
        await request.post('/admins', values)
      }
      
      message.success(editingId ? '修改成功' : '添加成功')
      setVisible(false)
      fetchAdmins()
    } catch (error) {
      // request helper handles error message
    }
  }

  const handleBatchDelete = () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的用户')
      return
    }
    Modal.confirm({
      title: '删除确认',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个用户吗？`,
      onOk: async () => {
        try {
          await Promise.all(selectedRowKeys.map(id => request.delete(`/admins/${id}`)))
          message.success('操作成功')
          setSelectedRowKeys([])
          fetchAdmins()
        } catch (error) {
          // Error handled by request helper
        }
      }
    })
  }

  const roleData = [
    { id: 1, name: '超级管理员', description: '拥有所有权限', count: 1 },
    { id: 2, name: '内容编辑', description: '负责内容管理', count: 2 },
    { id: 3, name: '运营人员', description: '负责日常运营', count: 3 },
    { id: 4, name: '查看者', description: '仅可查看数据', count: 1 }
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'name', key: 'name' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const roleMap = {
          super_admin: { label: '超级管理员', color: 'red' },
          editor: { label: '内容编辑', color: 'blue' },
          operator: { label: '运营人员', color: 'green' },
          viewer: { label: '查看者', color: 'default' }
        }
        return <Tag color={roleMap[role]?.color || 'default'}>{roleMap[role]?.label || role}</Tag>
      }
    },
    { title: '邮箱', dataIndex: 'email', key: 'email' },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status ? 'green' : 'red'}>
          {status ? '启用' : '禁用'}
        </Tag>
      )
    },
    { 
      title: '最后登录', 
      dataIndex: 'lastLogin', 
      key: 'lastLogin',
      render: (text) => text ? new Date(text).toLocaleString() : '从未登录'
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button type="link" icon={<LockOutlined />} onClick={() => handleResetPassword(record)}>重置密码</Button>
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        </Space>
      )
    }
  ]

  const roleColumns = [
    { title: '角色ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '角色名称', dataIndex: 'name', key: 'name' },
    { title: '描述', dataIndex: 'description', key: 'description' },
    { title: '人数', dataIndex: 'count', key: 'count' },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space>
          <Button type="link">编辑</Button>
          <Button type="link" danger>删除</Button>
        </Space>
      )
    }
  ]

  const handleEdit = (record) => {
    setEditingId(record.id)
    form.setFieldsValue(record)
    setVisible(true)
  }

  const handleResetPassword = (record) => {
    Modal.confirm({
      title: '重置密码',
      content: `确定要重置 ${record.name} 的密码吗？`,
      onOk: async () => {
        try {
          await request.patch(`/admins/${record.id}`, { password: '123456' })
          message.success('密码已重置为: 123456')
        } catch (error) {
          // Error handled by request helper
        }
      }
    })
  }

  return (
    <div>
      <Card style={{ marginBottom: 24, borderRadius: 8 }}>
        <Form form={filterForm} layout="inline">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
              <Form.Item name="search" style={{ margin: 0 }}>
                <Input placeholder="输入用户名、姓名..." style={{ width: 200 }} allowClear />
              </Form.Item>
              <Form.Item label="角色" name="role" style={{ margin: 0 }}>
                <Select placeholder="请选择角色" style={{ width: 150 }} allowClear>
                  <Select.Option value="super_admin">超级管理员</Select.Option>
                  <Select.Option value="editor">内容编辑</Select.Option>
                  <Select.Option value="operator">运营人员</Select.Option>
                  <Select.Option value="viewer">查看者</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="状态" name="status" style={{ margin: 0 }}>
                <Select placeholder="状态" style={{ width: 100 }} allowClear>
                  <Select.Option value="true">启用</Select.Option>
                  <Select.Option value="false">禁用</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="创建时间" name="dateRange" style={{ margin: 0 }}>
                <DatePicker.RangePicker style={{ width: 250 }} />
              </Form.Item>
              <Form.Item style={{ margin: 0 }}>
                <Button type="primary" onClick={fetchAdmins}>
                  筛选
                </Button>
              </Form.Item>
            </div>
          </div>
        </Form>
      </Card>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1 className="page-title">系统用户</h1>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button danger icon={<DeleteOutlined />} onClick={handleBatchDelete}>
              批量删除 ({selectedRowKeys.length})
            </Button>
          )}
          <Button onClick={() => setRoleVisible(true)}>角色管理</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setVisible(true); }}>添加用户</Button>
        </Space>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={dataSource} 
          rowKey="id" 
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys)
          }}
        />
      </Card>

      <Modal
        title={editingId ? '编辑用户' : '添加用户'}
        open={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}>
            <Input placeholder="请输入用户名" />
          </Form.Item>
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Select.Option value="super_admin">超级管理员</Select.Option>
              <Select.Option value="editor">内容编辑</Select.Option>
              <Select.Option value="operator">运营人员</Select.Option>
              <Select.Option value="viewer">查看者</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          {!editingId && (
            <Form.Item label="初始密码" name="password" initialValue="123456">
              <Input.Password placeholder="默认 123456" />
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="角色管理"
        open={roleVisible}
        onCancel={() => setRoleVisible(false)}
        footer={[
          <Button key="add" type="primary" onClick={() => message.info('添加角色')}>添加角色</Button>,
          <Button key="close" onClick={() => setRoleVisible(false)}>关闭</Button>
        ]}
      >
        <Table columns={roleColumns} dataSource={roleData} rowKey="id" pagination={false} />
      </Modal>
    </div>
  )
}

export default SystemUser
