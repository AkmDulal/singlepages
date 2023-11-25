import { useState, useEffect } from 'react';
import { Select, Col, Row, Button, Checkbox, Form, Input, Table, Space, Modal, Badge  } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Option } = Select;
interface DataType {
  key: React.Key;
  name: string;
  sectors: string;
  agreement: boolean;
}

function App() {
  const [form] = Form.useForm();
  const [selectValue, setSelectValue] = useState<string>('');
  const [tableData, setTableData] = useState<DataType[]>([]);
  const [editingKey, setEditingKey] = useState<React.Key | ''>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<DataType | null>(null);
  const [showSubmitButton, setShowSubmitButton] = useState(true);

  useEffect(() => {
    const storedData = localStorage.getItem('tableData');
    if (storedData) {
      setTableData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    console.log(tableData, "tableData tableData");

    localStorage.setItem('tableData', JSON.stringify(tableData));
  }, [tableData]);

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: DataType) => {
    form.setFieldsValue({ ...record });
    setEditingKey(record.key);
    setShowSubmitButton(false);
  };

  const cancel = () => {
    setEditingKey('');
    setShowSubmitButton(true);
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as DataType;
      const newData = [...tableData];
      const index = newData.findIndex((item) => key === item.key);
      setShowSubmitButton(true);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        setTableData(newData);
        setEditingKey('');
        form.resetFields()
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteRecord = (record: DataType) => {
    setModalVisible(true);
    setRecordToDelete(record);
  };

  const handleDelete = () => {
    if (recordToDelete) {
      const newData = tableData.filter((item) => item.key !== recordToDelete.key);
      setTableData(newData);
    }
    setModalVisible(false);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setRecordToDelete(null);
  };

  const handleChange = (value: string) => {
    setSelectValue(value);
  };

  const onFinish = (values: DataType) => {
    const newData = [...tableData];
    const key = Date.now();
    setTableData([...newData, { ...values, key }]);
    form.resetFields();
  };

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    {
      title: 'Sectors',
      dataIndex: 'sectors',
      key: 'sectors',
      render: (sectors: string[]) => (
        <>
          {sectors.map(sector => (
            <Badge key={sector} status="processing"  text={sector} />
          ))}
        </>
      ),
    },
    {
      title: 'Agreement',
      dataIndex: 'agreement',
      key: 'agreement',
      render: (text: boolean) => (text ? 'Agreed' : 'Not Agreed'),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: any, record: DataType) => {
        const editable = isEditing(record);
        return editable ? (
          <Space>
            <Button type="link" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button type="link" onClick={cancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space>
            <Button
              type="link"
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              icon={<EditOutlined />}
            >
              Edit
            </Button>
            <Button
              type="link"
              icon={<DeleteOutlined />}
              danger
              onClick={() => deleteRecord(record)}
            >
              Delete
            </Button>
          </Space>
        );
      },
    },
  ];


  type FieldType = {
    name?: string;
    sectors?: string | number;
    agreement?: string;
  };

  return (
    <div>
      <h2>Select Category:</h2>

      <Row justify="center" align="middle" style={{ minHeight: '100%' }}>
        <Col span={8}>

          <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item<FieldType>
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your Name!' }]}
            >
              <Input style={{ height: '40px' }} />
            </Form.Item>

            <Form.Item<FieldType>
              label="Sectors"
              name="sectors"
              rules={[{ required: true, message: 'Please select your sectors!' }]}
            >
              <Select
                mode="multiple"
                placeholder="Select a Sectors"
                onChange={(e) => handleChange(e)}
                style={{ width: '100%' }}
              >
                <Option value="Manufacturing">Manufacturing</Option>
                <Option value="Construction materials">&nbsp;&nbsp;&nbsp;&nbsp;Construction materials</Option>
                <Option value="Electronics and Optics">&nbsp;&nbsp;&nbsp;&nbsp;Electronics and Optics</Option>
                <Option value="Food and Beverage">&nbsp;&nbsp;&nbsp;&nbsp;Food and Beverage</Option>
                <Option value="Bakery &amp; confectionery products">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bakery &amp; confectionery products</Option>
                <Option value="Beverages">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beverages</Option>
                <Option value="Fish &amp; fish products">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fish &amp; fish products </Option>
                <Option value="Meat &amp; meat products">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Meat &amp; meat products</Option>
                <Option value="Milk &amp; dairy products">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Milk &amp; dairy products </Option>
                <Option value="Other">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other</Option>
                <Option value="Sweets &amp; snack food">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sweets &amp; snack food</Option>
                <Option value="Furniture">&nbsp;&nbsp;&nbsp;&nbsp;Furniture</Option>
                <Option value="Bathroom/sauna">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bathroom/sauna </Option>
                <Option value="Bedroom">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bedroom</Option>
                <Option value="Children’s room">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children’s room </Option>
                <Option value="Kitchen">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kitchen </Option>
                <Option value="Living room ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Living room </Option>
                <Option value="Office">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Office</Option>
                <Option value="Other (Furniture)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other (Furniture)</Option>
                <Option value="Outdoor">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Outdoor </Option>
                <Option value="Project furniture">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Project furniture</Option>
                <Option value="Machinery">&nbsp;&nbsp;&nbsp;&nbsp;Machinery</Option>
                <Option value="Machinery components">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machinery components</Option>
                <Option value="Machinery equipment/tools">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machinery equipment/tools</Option>
                <Option value="Manufacture of machinery">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manufacture of machinery </Option>
                <Option value="Maritime">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maritime</Option>
                <Option value="Aluminium and steel workboats">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Aluminium and steel workboats </Option>
                <Option value="Boat/Yacht building">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Boat/Yacht building</Option>
                <Option value="Ship repair and conversion">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ship repair and conversion</Option>
                <Option value="Metal structures">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal structures</Option>
                <Option value="Other">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other</Option>
                <Option value="Repair and maintenance service">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repair and maintenance service</Option>
                <Option value="Metalworking">&nbsp;&nbsp;&nbsp;&nbsp;Metalworking</Option>
                <Option value="Construction of metal structures">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Construction of metal structures</Option>
                <Option value="Houses and buildings">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Houses and buildings</Option>
                <Option value="Metal products">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal products</Option>
                <Option value="Metal works">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal works</Option>
                <Option value="CNC-machining">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CNC-machining</Option>
                <Option value="Forgings, Fasteners">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forgings, Fasteners </Option>
                <Option value="Gas, Plasma, Laser cutting">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gas, Plasma, Laser cutting</Option>
                <Option value="MIG, TIG, Aluminum welding">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIG, TIG, Aluminum welding</Option>
                <Option value="Plastic and Rubber">&nbsp;&nbsp;&nbsp;&nbsp;Plastic and Rubber</Option>
                <Option value="Packaging">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Packaging</Option>
                <Option value="Plastic goods">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic goods</Option>
                <Option value="Plastic processing technology">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic processing technology</Option>
                <Option value="Blowing">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blowing</Option>
                <Option value="Moulding">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moulding</Option>
                <Option value="Plastics welding and processing">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastics welding and processing</Option>
                <Option value="Plastic profiles">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic profiles</Option>
                <Option value="Printing">&nbsp;&nbsp;&nbsp;&nbsp;Printing </Option>
                <Option value="Advertising">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Advertising</Option>
                <Option value="Book/Periodicals printing">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Book/Periodicals printing</Option>
                <Option value="Labelling and packaging printing">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Labelling and packaging printing</Option>
                <Option value="Textile and Clothing">&nbsp;&nbsp;&nbsp;&nbsp;Textile and Clothing</Option>
                <Option value="Clothing">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clothing</Option>
                <Option value="Textile">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Textile</Option>
                <Option value="Wood">&nbsp;&nbsp;&nbsp;&nbsp;Wood</Option>
                <Option value="Other (Wood)">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other (Wood)</Option>
                <Option value="Wooden building materials">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wooden building materials</Option>
                <Option value="Wooden houses">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wooden houses</Option>
                <Option value="Other">Other</Option>
                <Option value="Creative industries">&nbsp;&nbsp;&nbsp;&nbsp;Creative industries</Option>
                <Option value="Energy technology">&nbsp;&nbsp;&nbsp;&nbsp;Energy technology</Option>
                <Option value="Environment">&nbsp;&nbsp;&nbsp;&nbsp;Environment</Option>
                <Option value="Service">Service</Option>
                <Option value="Business services">&nbsp;&nbsp;&nbsp;&nbsp;Business services</Option>
                <Option value="Engineering">&nbsp;&nbsp;&nbsp;&nbsp;Engineering</Option>
                <Option value="Information Technology and Telecommunications">&nbsp;&nbsp;&nbsp;&nbsp;Information Technology and Telecommunications</Option>
                <Option value="Data processing, Web portals, E-marketing">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Data processing, Web portals, E-marketing</Option>
                <Option value="Programming, Consultancy">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Programming, Consultancy</Option>
                <Option value="Software, Hardware">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Software, Hardware</Option>
                <Option value="Telecommunications">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telecommunications</Option>
                <Option value="Tourism">&nbsp;&nbsp;&nbsp;&nbsp;Tourism</Option>
                <Option value="Translation services">&nbsp;&nbsp;&nbsp;&nbsp;Translation services</Option>
                <Option value="Transport and Logistics">&nbsp;&nbsp;&nbsp;&nbsp;Transport and Logistics</Option>
                <Option value="Air">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Air</Option>
                <Option value="Rail">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rail</Option>
                <Option value="Road">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Road</Option>
                <Option value="Water">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Water</Option>
              </Select>
            </Form.Item>

            <Form.Item<FieldType>
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value ? Promise.resolve() : Promise.reject(new Error('Should accept agreement')),
                },
              ]}
            >
              <Checkbox>
                Agree to terms
              </Checkbox>
            </Form.Item>

            {showSubmitButton && (
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Submit
                </Button>
              </Form.Item>
            )}
          </Form>
          {/* {tableData?.length > 0 ? */}
          <Table
            columns={columns}
            dataSource={tableData.map((item) => ({
              ...item,
              sectors: item.sectors ? item.sectors : selectValue,
            }))}
            bordered
            pagination={false}
            rowKey={(record) => record.key as string}
          />
          {/* : ''} */}

          <Modal
            title="Confirm"
            open={modalVisible}
            onOk={handleDelete}
            onCancel={handleCancel}
          >
            <p>Are you sure you want to delete this record?</p>
          </Modal>
        </Col>
      </Row>
    </div>
  )
}

export default App
