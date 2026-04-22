import React from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  HeartOutlined,
  MessageOutlined,
  DollarOutlined,
  PictureOutlined,
  FolderOutlined,
  SettingOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import './Sidebar.css'

const { Sider } = Layout

const menuItems = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '首页',
    path: '/dashboard'
  },
  {
    key: 'assessment',
    icon: <HeartOutlined />,
    label: '测评管理',
    children: [
      { key: 'user-assessment', label: '测评订单', path: '/assessment/user-assessment' }
    ]
  },
  {
    key: 'questionnaire_mgmt',
    icon: <FolderOutlined />,
    label: '问卷管理',
    children: [
      { key: 'questionnaire', label: '问卷管理', path: '/assessment/questionnaire' },
      { key: 'question-bank', label: '题库管理', path: '/assessment/question-bank' },
      { key: 'gene-type', label: '基因类型', path: '/assessment/gene-type' }
    ]
  },
  {
    key: 'users',
    icon: <UserOutlined />,
    label: '用户管理',
    children: [
      { key: 'user-list', label: '用户列表', path: '/users/user-list' },
      { key: 'distributor-list', label: '分销员列表', path: '/users/distributor-list' }
    ]
  },
  {
    key: 'case_mgmt',
    icon: <PictureOutlined />,
    label: '案例管理',
    path: '/content/case-list'
  },
  {
    key: 'service_mgmt',
    icon: <MessageOutlined />,
    label: '服务管理',
    path: '/content/service-list'
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: '系统设置',
    children: [
      { key: 'system-user', label: '系统用户', path: '/settings/system-user' },
      { key: 'home-settings', label: '首页设置', path: '/settings/home-settings' },
      { key: 'about-us', label: '关于我们', path: '/settings/about-us' },
      { key: 'service-agreement', label: '服务协议', path: '/settings/service-agreement' },
      { key: 'privacy-policy', label: '隐私政策', path: '/settings/privacy-policy' }
    ]
  }
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = ({ key }) => {
    const item = findMenuItem(menuItems, key)
    if (item && item.path) {
      navigate(item.path)
    }
  }

  const findMenuItem = (items, key) => {
    for (const item of items) {
      if (item.key === key) return item
      if (item.children) {
        const found = findMenuItem(item.children, key)
        if (found) return found
      }
    }
    return null
  }

  const selectedKey = getSelectedKey(location.pathname)
  const openKeys = getOpenKeys(location.pathname)

  return (
    <Sider className="sidebar" width={200}>
      <div className="logo">
        <AppstoreOutlined />
        <span>DTCI管理后台</span>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        defaultOpenKeys={openKeys}
        items={menuItems}
        onClick={handleClick}
        className="sidebar-menu"
      />
    </Sider>
  )
}

function getSelectedKey(path) {
  const parts = path.split('/')
  return parts[parts.length - 1]
}

function getOpenKeys(path) {
  const parts = path.split('/')
  if (parts.length > 2) {
    return [parts[1]]
  }
  return []
}

export default Sidebar
