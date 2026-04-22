import React, { useState, useEffect, useRef } from 'react';
import {
  Table, Tag, Button, Input, Space, Card, Form, Select,
  message, Popconfirm, Upload, DatePicker, Row, Col, Divider
} from 'antd';
import {
  PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import request from '../../utils/request';

const { RangePicker } = DatePicker;

const DEFAULT_CATEGORIES = [
  {
    name: '性格特质',
    description: '',
    subCategories: [
      { name: '优势', description: '' },
      { name: '劣势', description: '' },
    ],
  },
  {
    name: '事业篇',
    description: '',
    subCategories: [
      { name: '职业优势', description: '' },
      { name: '事业类型', description: '' },
      { name: '事业潜在卡点', description: '' },
      { name: '天命人格', description: '' },
    ],
  },
  {
    name: '婚姻篇',
    description: '',
    subCategories: [
      { name: '完美伴侣', description: '' },
      { name: '自己喜欢的人基因类型', description: '' },
      { name: '喜欢自己的人基因类型', description: '' },
      { name: '婚恋潜在卡点', description: '' },
    ],
  },
  {
    name: '亲子篇',
    description: '',
    subCategories: [
      { name: '关系类型', description: '' },
      { name: '潜在卡点', description: '' },
    ],
  },
  {
    name: '个人成长建议',
    description: '',
    subCategories: [
      { name: '事业篇', description: '' },
      { name: '婚姻篇', description: '' },
      { name: '亲子篇', description: '' },
    ],
  },
];

const quillModules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ color: [] }, { background: [] }],
    ['link'],
    ['clean'],
  ],
};

export default function GeneTypeManagement() {
  const [viewMode, setViewMode] = useState('list');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionnaires, setQuestionnaires] = useState([]);
  const [editingItem, setEditingItem] = useState(null);

  const [filterForm] = Form.useForm();
  const [editForm] = Form.useForm();

  const loadQuestionnaires = async () => {
    try {
      const res = await request.get('/questionnaires');
      setQuestionnaires(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.error('Failed to load questionnaires', e);
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const values = filterForm.getFieldsValue();
      const params = {};
      if (values.search) params.search = values.search;
      if (values.status !== undefined && values.status !== '') params.status = values.status;
      if (values.operator) params.operator = values.operator;
      if (values.dateRange && values.dateRange.length === 2) {
        params.dateStart = values.dateRange[0].format('YYYY-MM-DD');
        params.dateEnd = values.dateRange[1].format('YYYY-MM-DD');
      }
      const res = await request.get('/gene-types', { params });
      setData(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      message.error('加载列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    loadQuestionnaires();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    editForm.resetFields();
    editForm.setFieldsValue({ categories: DEFAULT_CATEGORIES });
    setViewMode('edit');
  };

  const openEdit = (record) => {
    setEditingItem(record);
    editForm.resetFields();
    let categories = DEFAULT_CATEGORIES;
    try {
      const parsed = JSON.parse(record.categories || '[]');
      if (parsed.length > 0) categories = parsed;
    } catch (e) {}
    editForm.setFieldsValue({ ...record, categories });
    setViewMode('edit');
  };

  const handleBack = () => {
    setViewMode('list');
    loadData();
  };

  const handleSave = async () => {
    try {
      const values = await editForm.validateFields();

      // Handle image upload value
      let imageUrl = '';
      if (values.image) {
        if (typeof values.image === 'string') {
          imageUrl = values.image;
        } else if (Array.isArray(values.image)) {
          imageUrl = values.image[0]?.response?.url || values.image[0]?.url || '';
        } else if (values.image?.fileList) {
          imageUrl = values.image.fileList[0]?.response?.url || values.image.fileList[0]?.url || '';
        }
      }

      const payload = {
        questionnaireId: Number(values.questionnaireId),
        name: values.name,
        description: values.description || '',
        meaning: values.meaning || '',
        image: imageUrl,
        categories: JSON.stringify(values.categories || []),
        status: values.status !== undefined ? values.status : true,
        operator: '管理员',
      };

      if (editingItem) {
        await request.patch(`/gene-types/${editingItem.id}`, payload);
        message.success('更新成功');
      } else {
        await request.post('/gene-types', payload);
        message.success('创建成功');
      }
      handleBack();
    } catch (e) {
      console.error(e);
      message.error(editingItem ? '更新失败' : '创建失败，请检查必填项');
    }
  };

  const handleDelete = async (id) => {
    try {
      await request.delete(`/gene-types/${id}`);
      message.success('删除成功');
      loadData();
    } catch {
      message.error('删除失败');
    }
  };

  const handleStatusToggle = async (record) => {
    try {
      await request.patch(`/gene-types/${record.id}/status`, { status: !record.status });
      message.success('状态更新成功');
      loadData();
    } catch {
      message.error('状态更新失败');
    }
  };

  const columns = [
    { title: '编号', dataIndex: 'id', width: 80 },
    {
      title: '报告模板',
      dataIndex: ['questionnaire', 'name'],
      render: (v) => <span title={v}>{v ? (v.length > 5 ? v.slice(0, 5) + '...' : v) : '-'}</span>,
    },
    { title: '名头', dataIndex: 'name' },
    { title: '概述', dataIndex: 'description', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      render: (s) => s ? <Tag color="success">生效</Tag> : <Tag>失效</Tag>,
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      render: (v) => v ? new Date(v).toLocaleString('zh-CN', { hour12: false }) : '-',
    },
    {
      title: '操作',
      render: (_, record) => (
        <Space>
          <a onClick={() => openEdit(record)}>查看 编辑</a>
          <a onClick={() => handleStatusToggle(record)}>{record.status ? '下架' : '上架'}</a>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <a style={{ color: '#ff4d4f' }}>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // ========== EDITOR VIEW ==========
  if (viewMode === 'edit') {
    return (
      <div style={{ padding: '0 0 40px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" onClick={handleBack} icon={<ArrowLeftOutlined />}>返回</Button>
        </div>

        <Card bordered={false} style={{ borderRadius: 8 }}>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>请填写基因类型相关信息</div>

          <Form form={editForm} layout="horizontal" labelCol={{ span: 3 }} wrapperCol={{ span: 18 }}>
            <Form.Item name="questionnaireId" label="报告模板" rules={[{ required: true, message: '请选择报告模板' }]}>
              <Select placeholder="请选择报告模板" style={{ width: 300 }}>
                {questionnaires.map((q) => (
                  <Select.Option key={q.id} value={q.id}>{q.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="name" label="名头" rules={[{ required: true, message: '请输入名头' }]}>
              <Input placeholder="请输入名头" style={{ width: 300 }} />
            </Form.Item>

            <Form.Item name="description" label="概述">
              <Input placeholder="请输入一句话描述特点" style={{ width: 300 }} />
            </Form.Item>

            <Form.Item name="meaning" label="代表含义">
              <Input placeholder="请输入该类型所代表的含义" style={{ width: 300 }} />
            </Form.Item>

            <Form.Item
              name="image"
              label="形象图"
              valuePropName="fileList"
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload
                action="/api/upload"
                listType="picture-card"
                maxCount={1}
                accept="image/jpeg,image/png"
              >
                <div>
                  <UploadOutlined />
                  <div style={{ marginTop: 4, fontSize: 12 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 3 }}>
              <div style={{ color: '#aaa', fontSize: 12, marginTop: -16 }}>只能上传jpg/png文件，且不超过500kb</div>
            </Form.Item>

            <Divider orientation="left" style={{ marginTop: 32 }}>
              解析分类
            </Divider>

            <Form.List name="categories">
              {(catFields, catOps) => (
                <div>
                  {catFields.map((catField, catIndex) => (
                    <Card
                      key={catField.key}
                      style={{ marginBottom: 24, background: '#fafafa' }}
                      extra={
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => catOps.remove(catField.name)}
                        />
                      }
                    >
                      {/* 大类名称 */}
                      <Form.Item
                        {...catField}
                        name={[catField.name, 'name']}
                        label="大类"
                        rules={[{ required: true, message: '请填写大类名称' }]}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                      >
                        <Input placeholder="例如：性格特质" style={{ width: 220 }} />
                      </Form.Item>

                      {/* 大类富文本描述 */}
                      <Form.Item
                        {...catField}
                        name={[catField.name, 'description']}
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 22 }}
                        label=" "
                        colon={false}
                      >
                        <QuillWrapper />
                      </Form.Item>

                      {/* 子类 */}
                      <Form.List name={[catField.name, 'subCategories']}>
                        {(subFields, subOps) => (
                          <div style={{ paddingLeft: 40, borderLeft: '3px solid #e8e8e8', marginTop: 16 }}>
                            {subFields.map((subField) => (
                              <Card
                                key={subField.key}
                                size="small"
                                style={{ marginBottom: 16 }}
                                extra={
                                  <Button
                                    size="small"
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => subOps.remove(subField.name)}
                                  />
                                }
                              >
                                <Form.Item
                                  {...subField}
                                  name={[subField.name, 'name']}
                                  label="子类"
                                  rules={[{ required: true, message: '请填写子类名称' }]}
                                  labelCol={{ span: 2 }}
                                  wrapperCol={{ span: 22 }}
                                >
                                  <Input placeholder="例如：优势" style={{ width: 200 }} />
                                </Form.Item>
                                <Form.Item
                                  {...subField}
                                  name={[subField.name, 'description']}
                                  label=" "
                                  colon={false}
                                  labelCol={{ span: 2 }}
                                  wrapperCol={{ span: 22 }}
                                >
                                  <QuillWrapper />
                                </Form.Item>
                              </Card>
                            ))}
                            <Button
                              type="dashed"
                              onClick={() => subOps.add({ name: '', description: '' })}
                              icon={<PlusOutlined />}
                              block
                            >
                              新增子类
                            </Button>
                          </div>
                        )}
                      </Form.List>
                    </Card>
                  ))}

                  <Button
                    type="dashed"
                    onClick={() => catOps.add({ name: '', description: '', subCategories: [] })}
                    icon={<PlusOutlined />}
                    style={{ marginBottom: 24 }}
                  >
                    + 新增大类
                  </Button>
                </div>
              )}
            </Form.List>
          </Form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Space>
              <Button onClick={handleBack}>取消</Button>
              <Button type="primary" onClick={handleSave} style={{ width: 120 }}>保存</Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  // ========== LIST VIEW ==========
  return (
    <div>
      <Card bordered={false} style={{ marginBottom: 16 }}>
        <Form form={filterForm} layout="inline">
          <Row gutter={[16, 12]} style={{ width: '100%' }}>
            <Col span={24}>
              <Space wrap>
                <Form.Item name="search" style={{ margin: 0 }}>
                  <Input placeholder="请输入编号、名称或关键字" style={{ width: 220 }} allowClear />
                </Form.Item>
                <Form.Item name="status" label="状态" style={{ margin: 0 }}>
                  <Select placeholder="请选择状态" style={{ width: 120 }} allowClear>
                    <Select.Option value="1">生效</Select.Option>
                    <Select.Option value="0">失效</Select.Option>
                  </Select>
                </Form.Item>
                <Button type="primary" onClick={loadData}>筛选</Button>
                <Button onClick={() => { filterForm.resetFields(); loadData(); }}>重置</Button>
              </Space>
            </Col>
            <Col span={24}>
              <Space wrap>
                <Form.Item name="dateRange" label="更新时间" style={{ margin: 0 }}>
                  <RangePicker style={{ width: 260 }} />
                </Form.Item>
                <Form.Item name="operator" label="操作人" style={{ margin: 0 }}>
                  <Select placeholder="请选择" style={{ width: 150 }} allowClear>
                    <Select.Option value="管理员">管理员</Select.Option>
                    <Select.Option value="编辑">编辑</Select.Option>
                  </Select>
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card
        bordered={false}
        title="基因类型列表"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            新建基因类型
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

// Isolated wrapper to prevent ReactQuill controlled/uncontrolled conflicts in Form.List
function QuillWrapper({ value, onChange }) {
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onChange}
      modules={quillModules}
      style={{ background: '#fff', minHeight: 120 }}
    />
  );
}
