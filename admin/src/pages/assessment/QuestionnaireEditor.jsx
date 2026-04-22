import React, { useState, useEffect } from 'react'
import { Layout, Menu, Form, Input, Button, Table, Divider, Select, Switch, Checkbox, Upload, message, Steps, Modal, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { PlusOutlined, SearchOutlined, LoadingOutlined } from '@ant-design/icons'
import request from '../../utils/request'

const { Header, Sider, Content } = Layout

function QuestionnaireEditor() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [uploading, setUploading] = useState(false)
  
  // Data States
  const [allQuestions, setAllQuestions] = useState([])
  const [selectedQuestions, setSelectedQuestions] = useState([])
  const [showQuestionPicker, setShowQuestionPicker] = useState(false)
  
  // Sub-Menu States for Step 2 and Step 3
  const [activeSettingsMenu, setActiveSettingsMenu] = useState('base')
  const [activePublishMenu, setActivePublishMenu] = useState('link')

  const [form] = Form.useForm()
  const wechatIcon = Form.useWatch('wechatIcon', form)
  
  useEffect(() => {
    fetchAllQuestions()
    if (id) {
      fetchQuestionnaireDetails(id)
    } else {
      // Default initial states for creating
      form.setFieldsValue({
        status: 'draft',
        showInstructions: true,
        buttonText: '我知道了，开始测评'
      })
    }
  }, [id])

  const fetchAllQuestions = async () => {
    try {
      const res = await request.get('/questions')
      setAllQuestions(res)
    } catch {}
  }

  const fetchQuestionnaireDetails = async (qId) => {
    setLoading(true)
    try {
      const record = await request.get(`/questionnaires/${qId}`)
      const questions = record.questions ? JSON.parse(record.questions) : []
      const settings = record.settings ? JSON.parse(record.settings) : {}
      const wechatConfig = record.wechatConfig ? JSON.parse(record.wechatConfig) : {}

      form.setFieldsValue({
        ...record,
        ...settings,
        wechatTitle: wechatConfig.title,
        wechatDesc: wechatConfig.desc,
        wechatIcon: wechatConfig.icon,
        // handle fallback
        showInstructions: settings.showInstructions !== undefined ? settings.showInstructions : true
      })
      
      const selected = questions.map(q => {
        const found = allQuestions.find(aq => aq.id === q.id) || { ...q }
        return found
      }).filter(Boolean)
      setSelectedQuestions(selected)
    } finally {
      setLoading(false)
    }
  }

  const getImageUrl = (url) => {
    if (!url || typeof url !== 'string') return ''
    if (url.startsWith('http')) return url
    return `http://localhost:3100${url}`
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const questionData = selectedQuestions
        .filter(q => q && q.id)
        .map((q, index) => ({ id: q.id, sequence: index + 1 }));

      const payload = {
        name: values.name,
        description: values.description || '',
        status: values.status || 'draft',
        questions: JSON.stringify(questionData),
        settings: JSON.stringify({
          showInstructions: values.showInstructions !== undefined ? values.showInstructions : true,
          instructions: values.instructions || '',
          buttonText: values.buttonText || '我知道了，开始测评',
          duration: values.duration || '',
          expiry: values.expiry ? String(values.expiry) : '',
          randomization: values.randomization || false,
          dimensions: values.dimensions || [],
          push: values.push || {},
          tips: values.tips || [],
          payment: values.payment || {}
        }),
        wechatConfig: JSON.stringify({
          title: values.wechatTitle || values.name,
          desc: values.wechatDesc || '',
          icon: values.wechatIcon || ''
        })
      }

      if (id) {
        await request.patch(`/questionnaires/${id}`, payload)
        message.success('更新成功')
      } else {
        await request.post('/questionnaires', payload)
        message.success('创建成功')
      }
      navigate('/assessment/questionnaire')
    } catch (error) {
      console.error(error)
    }
  }

  // Define Layout Components
  const renderStep1 = () => (
    <div style={{ maxWidth: 800, margin: '0 auto', background: '#fff', padding: 24, borderRadius: 8, marginTop: 24 }}>
      <Divider orientation="left" style={{ marginTop: 0 }}>基础信息</Divider>
      <Form.Item label="问卷名称" name="name" rules={[{ required: true }]}>
        <Input placeholder="例如：DTCI个人基因类型评估" />
      </Form.Item>
      <Form.Item label="问卷描述" name="description">
        <Input.TextArea rows={2} placeholder="例如：解锁探索你的DTCI天命人格（该信息将显示在小程序问卷卡片底部）" />
      </Form.Item>
      <Form.Item label="封面图" name="wechatIcon">
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="http://localhost:3100/uploads"
          onChange={(info) => {
            if (info.file.status === 'uploading') {
              setUploading(true)
              return
            }
            if (info.file.status === 'done') {
              setUploading(false)
              form.setFieldsValue({ wechatIcon: info.file.response.url })
            } else if (info.file.status === 'error') {
              setUploading(false)
              message.error('图片上传失败')
            }
          }}
        >
          {wechatIcon && typeof wechatIcon === 'string' ? (
            <img src={getImageUrl(wechatIcon)} alt="cover" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
          ) : (
            <div>
              {uploading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>上传封面</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item label="问卷状态" name="status" initialValue="draft">
        <Select style={{ width: 200 }}>
          <Select.Option value="draft">草稿</Select.Option>
          <Select.Option value="published">发布</Select.Option>
        </Select>
      </Form.Item>

      <Divider orientation="left">题目管理</Divider>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>已选择 {selectedQuestions.length} 道题目</span>
        <Button type="primary" ghost icon={<PlusOutlined />} onClick={() => setShowQuestionPicker(true)}>从题库添加</Button>
      </div>
      
      <Table
        columns={[
          { title: '序号', render: (_, __, index) => index + 1, width: 60 },
          { title: '题目', dataIndex: 'title' },
          { title: '类型', dataIndex: 'type' },
          { title: '基因类型', dataIndex: 'geneType' },
          {
            title: '操作',
            render: (_, record, index) => (
              <Button type="link" danger onClick={() => {
                const next = [...selectedQuestions]
                next.splice(index, 1)
                setSelectedQuestions(next)
              }}>移除</Button>
            )
          }
        ]}
        dataSource={selectedQuestions}
        rowKey="id"
        pagination={false}
        size="small"
      />
    </div>
  )

  const renderStep2 = () => {
    const renderSettingsContent = () => {
      switch(activeSettingsMenu) {
        case 'base':
          return (
            <div style={{ maxWidth: 600 }}>
              <Divider orientation="left" style={{ margin: '0 0 16px' }}>测评说明</Divider>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>测评须知分为题目结构和注意事项文案2个部分。用于提示测评者相关信息。</p>
              
              <Form.Item name="showInstructions" valuePropName="checked" initialValue={true}>
                <Checkbox>展示测评须知</Checkbox>
              </Form.Item>
              
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.showInstructions !== curr.showInstructions}>
                {({ getFieldValue }) =>
                  getFieldValue('showInstructions') ? (
                    <Form.Item name="instructions">
                      <Input.TextArea rows={4} placeholder="请输入引导话术" />
                    </Form.Item>
                  ) : null
                }
              </Form.Item>
              
              <Divider orientation="left" style={{ margin: '24px 0 16px' }}>开始答题按钮文案</Divider>
              <Form.Item name="buttonText" style={{ width: '300px' }}>
                <Input maxLength={10} placeholder="我知道了，开始测评" suffix={<span style={{color: '#ccc'}}>10</span>} />
              </Form.Item>
              
              <Divider orientation="left" style={{ margin: '24px 0 16px' }}>填写问卷预计所需时间</Divider>
              <Form.Item name="duration" style={{ width: '300px' }}>
                <Input placeholder="请输入内容" />
              </Form.Item>

              <Divider orientation="left" style={{ margin: '24px 0 16px' }}>问卷临时报告查看失效时间</Divider>
              <Form.Item name="expiry" style={{ width: '300px' }}>
                <Select placeholder="请选择临时测评失效时间" allowClear>
                   <Select.Option value="never">永不失效</Select.Option>
                   <Select.Option value="10m">10 分钟</Select.Option>
                   <Select.Option value="30m">30 分钟</Select.Option>
                   <Select.Option value="1h">1个小时</Select.Option>
                </Select>
              </Form.Item>

              <div style={{ marginTop: 32, background: '#fafafa', border: '1px solid #f0f0f0', padding: 24, borderRadius: 8 }}>
                <h3 style={{ margin: 0, fontWeight: 600, fontSize: 16 }}>随机出题</h3>
                <p style={{ color: '#666', fontSize: 13, margin: '8px 0 16px' }}>开启随机出题，系统会随机从已设置好答案与分类的题目中抽取部分题目发放。</p>
                <Form.Item name="randomization" valuePropName="checked" style={{ margin: 0 }}>
                    <Switch checkedChildren="已开启" unCheckedChildren="已关闭" />
                </Form.Item>
              </div>
            </div>
          )
        case 'dimensions':
          return (
            <div style={{ maxWidth: 800 }}>
              <Divider orientation="left" style={{ margin: '0 0 16px' }}>维度设置</Divider>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                设置维度后，可以实现多维度测评。比如就学生的语言、逻辑、空间想象力等多维度进行测评，并且结果以雷达图进行呈现。
              </p>
              <div style={{ display: 'flex', gap: 24, marginTop: 24 }}>
                <div style={{ flex: 1, border: '1px solid #f0f0f0', padding: 16, borderRadius: 8, background: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{ fontWeight: 500 }}>绑定题目</span>
                    <Button size="small" type="default" icon={<PlusOutlined />}>新增维度</Button>
                  </div>
                  {/* Placeholder for dimension items */}
                  <div style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, padding: '8px 12px', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Input defaultValue="D型基因" style={{ width: 100 }} size="small" />
                    <Input defaultValue="请输入描述" style={{ flex: 1 }} size="small" />
                    <span style={{ color: '#999', fontSize: 12 }}>(0)</span>
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #d9d9d9', borderRadius: 4, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Input placeholder="选项名称" style={{ width: 100 }} size="small" />
                    <Input placeholder="请输入选项内容" style={{ flex: 1 }} size="small" />
                    <span style={{ color: '#999', fontSize: 12 }}>(0)</span>
                  </div>
                </div>
                <div style={{ flex: 1, border: '1px solid #f0f0f0', padding: 16, borderRadius: 8, minHeight: 300 }}>
                  <div style={{ fontWeight: 500, marginBottom: 16 }}>题目</div>
                  <div style={{ color: '#999', textAlign: 'center', marginTop: 80 }}>请在左侧选择要编辑的维度</div>
                </div>
              </div>
            </div>
          )
        case 'push':
          return (
            <div style={{ maxWidth: 600 }}>
              <Divider orientation="left" style={{ margin: '0 0 16px' }}>提醒推送</Divider>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
                当有新数据时，你将收到系统自动推送的提醒。自己填写的数据不会触发提醒，请退出当前账号后再测试。
              </p>
              
              <Form.Item name={['push', 'wechat']} valuePropName="checked">
                <Checkbox>
                  新数据微信自动提醒
                  <div style={{ color: '#999', fontSize: 12, marginTop: 4 }}>如需为他人开启微信提醒，请参考此文档。</div>
                </Checkbox>
              </Form.Item>
              
              <Form.Item name={['push', 'email']} valuePropName="checked" style={{ marginTop: 16 }}>
                <Checkbox>
                  新数据邮件自动提醒
                </Checkbox>
              </Form.Item>
            </div>
          )
        case 'tips':
          return (
            <div style={{ maxWidth: 800 }}>
              <Divider orientation="left" style={{ margin: '0 0 16px' }}>问卷小贴士</Divider>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                当用户回答问卷时，可在问卷的底部随机展示提示信息，方便用户了解更多DTCI的相关知识点。
              </p>
              <Form.List name="tips">
                {(fields, { add, remove }) => (
                  <>
                    <div style={{ marginBottom: 16 }}>
                      <Button type="default" size="small" onClick={() => add()} icon={<PlusOutlined />}>新增小贴士</Button>
                    </div>
                    {fields.map((field) => (
                      <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                        <Form.Item
                          {...field}
                          noStyle
                        >
                          <Input placeholder="请输入小贴士" />
                        </Form.Item>
                        <Button type="text" danger onClick={() => remove(field.name)}>删除</Button>
                      </div>
                    ))}
                  </>
                )}
              </Form.List>
            </div>
          )
        default: return null;
      }
    }

    return (
      <Layout style={{ background: '#fff', borderRadius: 8, height: 'calc(100vh - 180px)', marginTop: 24 }}>
        <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectedKeys={[activeSettingsMenu]}
            onClick={(e) => setActiveSettingsMenu(e.key)}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              { type: 'group', label: '基础设置', children: [
                { key: 'base', label: '出题设置' },
                { key: 'dimensions', label: '维度设置' },
                { key: 'push', label: '推送提醒' },
              ]},
              { type: 'group', label: '高级设置', children: [
                { key: 'tips', label: '小贴士' },
              ]}
            ]}
          />
        </Sider>
        <Content style={{ padding: 40, overflowY: 'auto' }}>
          {renderSettingsContent()}
        </Content>
      </Layout>
    )
  }

  const renderStep3 = () => {
    const renderPublishContent = () => {
      switch(activePublishMenu) {
        case 'link':
          return (
            <div style={{ maxWidth: 800 }}>
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>测评链接</div>
                <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>将测评链接粘贴到微信公众号，或者直接发给填表者！</p>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <Input value={`https://dtci.app/assessment/${id || 'draft'}`} disabled style={{ width: 400, background: '#f5f5f5' }} />
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
                  <Button type="primary" style={{ background: '#00b96b', borderColor: '#00b96b' }}>复制链接</Button>
                  <Button type="default" style={{ borderColor: '#00b96b', color: '#00b96b' }}>直接打开</Button>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>分享到微信</div>
                <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>可以选择以下图标来替换分享微信朋友圈连接图标。</p>
                
                <div style={{ display: 'flex', gap: 40 }}>
                  <div style={{ flex: 1 }}>
                    <Form.Item label="微信分享标题" name="wechatTitle" style={{ marginBottom: 16 }}>
                      <Input placeholder="如果不设置，将默认使用问卷名称" />
                    </Form.Item>
                    <Form.Item label="微信分享描述" name="wechatDesc" style={{ marginBottom: 16 }}>
                      <Input.TextArea rows={3} placeholder="分享到朋友圈或群聊时的描述文字" />
                    </Form.Item>
                    <Form.Item label="自定义图标 URL" name="wechatIcon">
                      <Input placeholder="复制系统中的图片链接" />
                    </Form.Item>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#666', marginBottom: 8 }}>微信消息预览</div>
                    <div style={{ padding: 16, background: '#f0f2f5', borderRadius: 8, minHeight: 120 }}>
                      <div style={{ background: '#fff', padding: 16, borderRadius: 4, display: 'flex', gap: 12 }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, fontSize: 15, marginBottom: 4 }}>{form.getFieldValue('wechatTitle') || form.getFieldValue('name') || '标题'}</div>
                          <div style={{ color: '#999', fontSize: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {form.getFieldValue('wechatDesc') || '欢迎参加本次测评，本次测评采用限时答题的方式，准备好了吗？我们现在开始吧！'}
                          </div>
                        </div>
                        <div style={{ width: 50, height: 50, background: '#e6f7ff', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {wechatIcon ? <img src={getImageUrl(wechatIcon)} style={{width: 50, height: 50, objectFit: 'cover', borderRadius: 4}} alt="icon" /> : <span style={{ color: '#1890ff', fontSize: 24 }}>测评</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        case 'track':
          return (
            <div style={{ maxWidth: 800 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>设置扩展属性</div>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                扩展属性是指：在数据中除了测评原本题目对应的扩展值。扩展属性经常用于用于区分数据的来源，例如测评将会被发放到3个渠道，你可以设置3个带有对应的扩展属性值的测评链接进行发布。
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Input value={`https://dtci.app/assessment/${id || 'draft'}?x_field_1=`} disabled style={{ width: 400, background: '#f5f5f5' }} />
                <Input placeholder="扩展值" style={{ width: 120 }} />
                <Button type="primary" style={{ background: '#00b96b', borderColor: '#00b96b' }}>生成链接</Button>
              </div>
            </div>
          )
        case 'payment':
          return (
            <div style={{ maxWidth: 600 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>付费设置</div>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 24 }}>
                默认查看解析报告免费，开启付费查看，则用户需要支付后才能查看测评解析报告，否则仅能看到最终结果。
              </p>

              <Form.Item name={['payment', 'enabled']} valuePropName="checked" label="付费查看" style={{ marginBottom: 16 }}>
                <Switch checkedChildren="开启" unCheckedChildren="关闭" />
              </Form.Item>
              
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.payment?.enabled !== curr.payment?.enabled}>
                {({ getFieldValue }) =>
                  getFieldValue(['payment', 'enabled']) ? (
                    <div style={{ paddingLeft: 16, borderLeft: '2px solid #00b96b' }}>
                      <Form.Item name={['payment', 'originalPrice']} label="原价" rules={[{ required: true, message: '请输入原金额' }]} style={{ width: 300 }}>
                        <Input type="number" placeholder="请输入金额" prefix="¥" />
                      </Form.Item>
                      <Form.Item name={['payment', 'discountPrice']} label="优惠价" rules={[{ required: true, message: '请输入优惠金额' }]} style={{ width: 300 }}>
                        <Input type="number" placeholder="请输入金额" prefix="¥" />
                      </Form.Item>
                    </div>
                  ) : null
                }
              </Form.Item>
            </div>
          )
        case 'embed':
          return (
            <div style={{ maxWidth: 800 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>测评嵌入</div>
              <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>
                将以下代码嵌在您的网页中，即可在网页内嵌本次测评。
              </p>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <Input value={`<iframe src="https://dtci.app/assessment/${id || 'draft'}"></iframe>`} disabled style={{ width: 400, background: '#f5f5f5' }} />
                <Button type="primary" style={{ background: '#00b96b', borderColor: '#00b96b' }}>复制代码</Button>
              </div>
            </div>
          )
        default:
          return <div style={{ color: '#999', paddingTop: 60, textAlign: 'center' }}>敬请期待该渠道能力</div>
      }
    }

    return (
      <Layout style={{ background: '#fff', borderRadius: 8, height: 'calc(100vh - 180px)', marginTop: 24 }}>
        <Sider width={200} style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}>
          <Menu
            mode="inline"
            selectedKeys={[activePublishMenu]}
            onClick={(e) => setActivePublishMenu(e.key)}
            style={{ height: '100%', borderRight: 0 }}
            items={[
              { key: 'link', label: '测评链接' },
              { key: 'track', label: '跟踪来源' },
              { key: 'embed', label: '测评嵌入' },
              { key: 'payment', label: '付费设置' },
            ]}
          />
        </Sider>
        <Content style={{ padding: 40, overflowY: 'auto' }}>
          {renderPublishContent()}
        </Content>
      </Layout>
    )
  }

  return (
    <div style={{ padding: '0', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navigation Frame */}
      <div style={{ background: '#fff', padding: '16px 24px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'center', position: 'relative' }}>
        <Button 
          style={{ position: 'absolute', left: 24 }} 
          onClick={() => navigate('/assessment/questionnaire')}
        >返回列表示</Button>
        
        <div style={{ width: 600 }}>
          <Steps 
            current={currentStep} 
            onChange={(step) => setCurrentStep(step)}
            items={[
              { title: '编辑' },
              { title: '设置' },
              { title: '发布' }
            ]} 
          />
        </div>

        <Space style={{ position: 'absolute', right: 24 }}>
          {currentStep > 0 && <Button onClick={() => setCurrentStep(prev => prev - 1)}>上一步</Button>}
          {currentStep < 2 ? (
            <Button type="primary" onClick={() => setCurrentStep(prev => prev + 1)}>下一步</Button>
          ) : (
            <Button type="primary" style={{ background: '#00b96b', borderColor: '#00b96b' }} onClick={handleSave}>
              {id ? '保存更新' : '立即发布'}
            </Button>
          )}
        </Space>
      </div>

      {/* Main Body */}
      <div style={{ padding: '0 24px', flex: 1, background: '#f5f5f5', overflow: 'hidden' }}>
        <Form form={form} layout="vertical" preserve={true} style={{ height: '100%' }}>
          <div style={{ display: currentStep === 0 ? 'block' : 'none', height: '100%', overflowY: 'auto', paddingBottom: 40 }}>
            {renderStep1()}
          </div>
          <div style={{ display: currentStep === 1 ? 'block' : 'none', height: '100%' }}>
            {renderStep2()}
          </div>
          <div style={{ display: currentStep === 2 ? 'block' : 'none', height: '100%' }}>
            {renderStep3()}
          </div>
        </Form>
      </div>

      {/* Question Picker Modal */}
      <Modal
        title="从题库选择题目"
        open={showQuestionPicker}
        onCancel={() => setShowQuestionPicker(false)}
        onOk={() => setShowQuestionPicker(false)}
        width={800}
      >
        <Input placeholder="搜索题目..." prefix={<SearchOutlined />} style={{ marginBottom: 16 }} />
        <Table
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedQuestions.map(q => q.id),
            onChange: (keys, selectedRows) => setSelectedQuestions(selectedRows),
          }}
          columns={[
            { title: '题目', dataIndex: 'title', ellipsis: true },
            { title: '类型', dataIndex: 'type', width: 100 },
            { title: '基因类型', dataIndex: 'geneType', width: 100 }
          ]}
          dataSource={allQuestions}
          rowKey="id"
          size="small"
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  )
}

export default QuestionnaireEditor
