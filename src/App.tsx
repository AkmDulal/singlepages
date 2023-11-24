import { useState, useEffect } from 'react';
import { Select, Col, Row, Button, Checkbox, Form, Input, Table, Space, Modal } from 'antd';
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
    { title: 'Sectors', dataIndex: 'sectors', key: 'sectors' },
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
                placeholder="Select a Sectors"
                onChange={(e) => handleChange(e)}
                style={{ height: '40px' }}
              >
                <Option value="1">Manufacturing</Option>
                <Option value="19">&nbsp;&nbsp;&nbsp;&nbsp;Construction materials</Option>
                <Option value="18">&nbsp;&nbsp;&nbsp;&nbsp;Electronics and Optics</Option>
                <Option value="6">&nbsp;&nbsp;&nbsp;&nbsp;Food and Beverage</Option>
                <Option value="342">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bakery &amp; confectionery products</Option>
                <Option value="43">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Beverages</Option>
                <Option value="42">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Fish &amp; fish products </Option>
                <Option value="40">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Meat &amp; meat products</Option>
                <Option value="39">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Milk &amp; dairy products </Option>
                <Option value="437">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other</Option>
                <Option value="378">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sweets &amp; snack food</Option>
                <Option value="13">&nbsp;&nbsp;&nbsp;&nbsp;Furniture</Option>
                <Option value="389">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bathroom/sauna </Option>
                <Option value="385">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Bedroom</Option>
                <Option value="390">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Children’s room </Option>
                <Option value="98">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Kitchen </Option>
                <Option value="101">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Living room </Option>
                <Option value="392">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Office</Option>
                <Option value="394">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other (Furniture)</Option>
                <Option value="341">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Outdoor </Option>
                <Option value="99">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Project furniture</Option>
                <Option value="12">&nbsp;&nbsp;&nbsp;&nbsp;Machinery</Option>
                <Option value="94">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machinery components</Option>
                <Option value="91">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Machinery equipment/tools</Option>
                <Option value="224">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Manufacture of machinery </Option>
                <Option value="97">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Maritime</Option>
                <Option value="271">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Aluminium and steel workboats </Option>
                <Option value="269">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Boat/Yacht building</Option>
                <Option value="230">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ship repair and conversion</Option>
                <Option value="93">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal structures</Option>
                <Option value="508">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other</Option>
                <Option value="227">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Repair and maintenance service</Option>
                <Option value="11">&nbsp;&nbsp;&nbsp;&nbsp;Metalworking</Option>
                <Option value="67">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Construction of metal structures</Option>
                <Option value="263">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Houses and buildings</Option>
                <Option value="267">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal products</Option>
                <Option value="542">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Metal works</Option>
                <Option value="75">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CNC-machining</Option>
                <Option value="62">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Forgings, Fasteners </Option>
                <Option value="69">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gas, Plasma, Laser cutting</Option>
                <Option value="66">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MIG, TIG, Aluminum welding</Option>
                <Option value="9">&nbsp;&nbsp;&nbsp;&nbsp;Plastic and Rubber</Option>
                <Option value="54">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Packaging</Option>
                <Option value="556">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic goods</Option>
                <Option value="559">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic processing technology</Option>
                <Option value="55">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Blowing</Option>
                <Option value="57">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Moulding</Option>
                <Option value="53">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastics welding and processing</Option>
                <Option value="560">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plastic profiles</Option>
                <Option value="5">&nbsp;&nbsp;&nbsp;&nbsp;Printing </Option>
                <Option value="148">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Advertising</Option>
                <Option value="150">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Book/Periodicals printing</Option>
                <Option value="145">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Labelling and packaging printing</Option>
                <Option value="7">&nbsp;&nbsp;&nbsp;&nbsp;Textile and Clothing</Option>
                <Option value="44">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Clothing</Option>
                <Option value="45">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Textile</Option>
                <Option value="8">&nbsp;&nbsp;&nbsp;&nbsp;Wood</Option>
                <Option value="337">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other (Wood)</Option>
                <Option value="51">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wooden building materials</Option>
                <Option value="47">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Wooden houses</Option>
                <Option value="3">Other</Option>
                <Option value="37">&nbsp;&nbsp;&nbsp;&nbsp;Creative industries</Option>
                <Option value="29">&nbsp;&nbsp;&nbsp;&nbsp;Energy technology</Option>
                <Option value="33">&nbsp;&nbsp;&nbsp;&nbsp;Environment</Option>
                <Option value="2">Service</Option>
                <Option value="25">&nbsp;&nbsp;&nbsp;&nbsp;Business services</Option>
                <Option value="35">&nbsp;&nbsp;&nbsp;&nbsp;Engineering</Option>
                <Option value="28">&nbsp;&nbsp;&nbsp;&nbsp;Information Technology and Telecommunications</Option>
                <Option value="581">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Data processing, Web portals, E-marketing</Option>
                <Option value="576">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Programming, Consultancy</Option>
                <Option value="121">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Software, Hardware</Option>
                <Option value="122">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Telecommunications</Option>
                <Option value="22">&nbsp;&nbsp;&nbsp;&nbsp;Tourism</Option>
                <Option value="141">&nbsp;&nbsp;&nbsp;&nbsp;Translation services</Option>
                <Option value="21">&nbsp;&nbsp;&nbsp;&nbsp;Transport and Logistics</Option>
                <Option value="111">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Air</Option>
                <Option value="114">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Rail</Option>
                <Option value="112">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Road</Option>
                <Option value="113">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Water</Option>
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
            visible={modalVisible}
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
