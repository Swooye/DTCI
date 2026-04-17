import React, { useState, useEffect } from 'react'
import { Table, Button, Space, Card, Modal, Form, Input, Select, Tag, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons'

function SystemUser() {
  const [visible, setVisible] = useState(false)
  const [roleVisible, setRoleVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [form] = Form.useForm()

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:3100/admins')
      const data = await response.json()
      setDataSource(data)
    } catch (error) {
      message.error('加载列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  const handleSave = async (values) => {
    try {
      const url = editingId 
        ? `http://127.0.0.1:3100/admins/${editingId}`
        : 'http://127.0.0.1:3100/admins'
      
      const response = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      if (!response.ok) throw new Error('提交失败')
      
      message.success(editingId ? '修改成功' : '添加成功')
      setVisible(false)
      fetchAdmins()
    } catch (error) {
      message.error(error.message)
    }
  }

  const handleDelete = (id) => {
    Modal.confirm({
      title: '删除确认',
      content: '确定要删除该系统用户吗？',
      onOk: async () => {
        try {
          const response = await fetch(`http://127.0.0.1:3100/admins/${id}`, { method: 'DELETE' })
          if (!response.ok) {
            const err = await response.json()
            throw new Error(err.message || '删除失败')
          }
          message.success('删除成功')
          fetchAdmins()
        } catch (error) {
          message.error(error.message)
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
          <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>删除</Button>
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
          const response = await fetch(`http://127.0.0.1:3100/admins/${record.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: '123456' })
          })
          if (!response.ok) throw new Error('重置失败')
          message.success('密码已重置为: 123456')
        } catch (error) {
          message.error(error.message)
        }
      }
    })
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">系统用户</h1>
        <Space>
          <Button onClick={() => setRoleVisible(true)}>角色管理</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditingId(null); form.resetFields(); setVisible(true); }}>添加用户</Button>
        </Space>
      </div>

      <Card>
        <Table columns={columns} dataSource={dataSource} rowKey="id" loading={loading} />
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
