import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/dashboard/Dashboard'
import UserList from './pages/users/UserList'
import DistributorList from './pages/users/DistributorList'
import AssessmentList from './pages/assessment/AssessmentList'
import UserAssessment from './pages/assessment/UserAssessment'
import AssessmentReport from './pages/assessment/AssessmentReport'
import Questionnaire from './pages/assessment/Questionnaire'
import QuestionBank from './pages/assessment/QuestionBank'
import FeedbackList from './pages/feedback/FeedbackList'
import Reply from './pages/feedback/Reply'
import Commission from './pages/finance/Commission'
import WithdrawList from './pages/finance/WithdrawList'
import BannerList from './pages/content/BannerList'
import CaseList from './pages/content/CaseList'
import ServiceList from './pages/content/ServiceList'
import SystemUser from './pages/settings/SystemUser'
import HomeSettings from './pages/settings/HomeSettings'
import AboutUs from './pages/settings/AboutUs'
import ServiceAgreement from './pages/settings/ServiceAgreement'
import PrivacyPolicy from './pages/settings/PrivacyPolicy'
import Login from './pages/Login'
import './styles/index.css'

const { Content } = Layout

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Layout className="app-layout">
            <Sidebar />
            <Layout>
              <Header />
              <Content className="main-content">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/users/user-list" element={<UserList />} />
                  <Route path="/users/distributor-list" element={<DistributorList />} />
                  <Route path="/assessment/assessment-list" element={<AssessmentList />} />
                  <Route path="/assessment/user-assessment" element={<UserAssessment />} />
                  <Route path="/assessment/assessment-report" element={<AssessmentReport />} />
                  <Route path="/assessment/questionnaire" element={<Questionnaire />} />
                  <Route path="/assessment/question-bank" element={<QuestionBank />} />
                  <Route path="/feedback/feedback-list" element={<FeedbackList />} />
                  <Route path="/feedback/reply" element={<Reply />} />
                  <Route path="/finance/commission" element={<Commission />} />
                  <Route path="/finance/withdraw-list" element={<WithdrawList />} />
                  <Route path="/content/banner-list" element={<BannerList />} />
                  <Route path="/content/case-list" element={<CaseList />} />
                  <Route path="/content/service-list" element={<ServiceList />} />
                  <Route path="/settings/system-user" element={<SystemUser />} />
                  <Route path="/settings/home-settings" element={<HomeSettings />} />
                  <Route path="/settings/about-us" element={<AboutUs />} />
                  <Route path="/settings/service-agreement" element={<ServiceAgreement />} />
                  <Route path="/settings/privacy-policy" element={<PrivacyPolicy />} />
                </Routes>
              </Content>
            </Layout>
          </Layout>
        } />
      </Routes>
    </Router>
  )
}

export default App
