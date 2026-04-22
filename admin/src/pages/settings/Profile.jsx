import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Space, message, Breadcrumb, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import request from '../../utils/request';
import './Profile.css';

const { Title, Text } = Typography;

function Profile() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [adminId, setAdminId] = useState(null);
  const [role, setRole] = useState('');

  useEffect(() => {
    const adminJson = localStorage.getItem('admin_user');
    if (adminJson) {
      const admin = JSON.parse(adminJson);
      setAdminId(admin.id);
      fetchProfile(admin.id);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const fetchProfile = async (id) => {
    try {
      // 获取最新个人资料
      const currentAdmin = await request.get(`/admins/${id}`);
      if (currentAdmin) {
        setRole(currentAdmin.role);
        form.setFieldsValue({
          name: currentAdmin.name,
          phone: currentAdmin.phone,
          role: currentAdmin.role
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { name, phone, currentPassword, newPassword, confirmPassword } = values;

      // 1. 更新基本资料
      await request.patch(`/admins/${adminId}`, { name, phone });

      // 2. 如果填写了密码，则更新密码
      if (currentPassword && newPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('两次输入的新密码不一致');
        }
        await request.post(`/admins/${adminId}/change-password`, {
          currentPassword,
          newPassword
        });
      }

      message.success('资料更新成功');
      // 更新本地存储的缓存
      const adminJson = localStorage.getItem('admin_user');
      if (adminJson) {
        const admin = JSON.parse(adminJson);
        localStorage.setItem('admin_user', JSON.stringify({ ...admin, name, phone }));
      // 触发自定义事件，通知 Header 更新
      window.dispatchEvent(new CustomEvent('admin_profile_updated', { detail: { name, phone } }));
      }
      
      // 清空密码字段
      form.setFieldsValue({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      console.error('Update failed:', err);
      // 错误已由拦截器处理显示，此处只需停止加载
    } finally {
      setLoading(false);
    }
  };

  const getRoleLabel = (role) => {
    const roleMap = {
      super_admin: '超级管理员',
      editor: '内容编辑',
      operator: '运营专员',
      viewer: '查看者'
    };
    return roleMap[role] || role;
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <Breadcrumb items={[
          { title: '设置' },
          { title: '个人资料' }
        ]} />
        <Button onClick={() => navigate(-1)}>返回</Button>
      </div>

      <Card className="profile-card">
        <div className="card-info-tip">
          <Text type="secondary">请填写用户相关信息</Text>
        </div>

        <Form
          form={form}
          layout="horizontal"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 12 }}
          onFinish={onFinish}
          className="profile-form"
        >
          <Form.Item
            label="用户名称"
            name="name"
            rules={[{ required: true, message: '请输入用户名称' }]}
          >
            <Input placeholder="请输入用户名称" />
          </Form.Item>

          <Form.Item label="手机号" required>
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item
                name="phone"
                noStyle
                rules={[{ pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }]}
              >
                <Input placeholder="请输入手机号" />
              </Form.Item>
              <Button type="default">变更手机号</Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.phone !== curr.phone}>
            {({ getFieldValue }) => (
              <Form.Item label=" " colon={false}>
                <Input style={{ width: '200px' }} placeholder="请输入验证码" />
              </Form.Item>
            )}
          </Form.Item>

          <Form.Item label="用户角色">
            <Text strong>{getRoleLabel(role)}</Text>
          </Form.Item>

          <div className="form-divider" />

          <Form.Item
            label="当前密码"
            name="currentPassword"
            rules={[{ required: false }]}
          >
            <Input.Password placeholder="******" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
          >
            <Input.Password placeholder="******" />
          </Form.Item>

          <Form.Item
            label="再次新密码"
            name="confirmPassword"
          >
            <Input.Password placeholder="******" />
          </Form.Item>

          <Form.Item label=" " colon={false} style={{ marginTop: 40 }}>
            <Space size="large">
              <Button type="primary" htmlType="submit" loading={loading} className="btn-save">
                保存
              </Button>
              <Button onClick={() => navigate(-1)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default Profile;
