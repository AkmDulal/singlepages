import { useState, useEffect } from 'react';
import { Select, Col, Row, Button, Checkbox, Form, Input, Table, Space, Modal, Badge } from 'antd';
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

  const handleChange = (value: any) => {
    const trimmedValues = value?.map((value: string) => value.replace(/^\s+/, ''));
    console.log(trimmedValues, "trimmedValuestrimmedValues trimmedValues");

    setSelectValue(trimmedValues);
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
      width: 600,
      render: (sectors: string[]) => (
        <>
          {sectors.map(sector => (
            <Badge key={sector} status="processing" text={sector} />
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
          <Space style={{display: 'inline-table'}}>
            <Button type="link" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Button>
            <Button type="link" onClick={cancel}>
              Cancel
            </Button>
          </Space>
        ) : (
          <Space style={{display: 'inline-table'}}>
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

      <Row justify="center" align="middle" style={{ minHeight: '100%' }}>
        <Col xs={24} sm={16} md={12} lg={10} xl={8}>

        <h2 style={{color: '#222'}}> Please enter your name and pick the Sectors you are currently involved in. </h2>
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
                <Option className="p-30" value="Construction materials">Construction materials</Option>
                <Option className="p-30" value="Electronics and Optics">Electronics and Optics</Option>
                <Option className="p-30" value="Food and Beverage">Food and Beverage</Option>

                <Option className="p-45" value="Bakery &amp; confectionery products">Bakery &amp; confectionery products</Option>
                <Option className="p-45" value="Beverages">Beverages</Option>
                <Option className="p-45" value="Fish &amp; fish products">Fish &amp; fish products </Option>
                <Option className="p-45" value="Meat &amp; meat products">Meat &amp; meat products</Option>
                <Option className="p-45" value="Milk &amp; dairy products">Milk &amp; dairy products </Option>
                <Option className="p-45" value="Other">Other</Option>
                <Option className="p-45" value="Sweets &amp; snack food">Sweets &amp; snack food</Option>

                <Option className="p-30" value="Furniture">Furniture</Option>
                <Option className="p-45" value="Bathroom/sauna">Bathroom/sauna </Option>
                <Option className="p-45" value="Bedroom">Bedroom</Option>
                <Option className="p-45" value="Children’s room">Children’s room </Option>
                <Option className="p-45" value="Kitchen">Kitchen </Option>
                <Option className="p-45" value="Living room ">Living room </Option>
                <Option className="p-45" value="Office">Office</Option>
                <Option className="p-45" value="Other (Furniture)">Other (Furniture)</Option>
                <Option className="p-45" value="Outdoor">Outdoor </Option>
                <Option className="p-45" value="Project furniture">Project furniture</Option>

                <Option className="p-30" value="Machinery">Machinery</Option>
                <Option className="p-45" value="Machinery components">Machinery components</Option>
                <Option className="p-45" value="Machinery equipment/tools">Machinery equipment/tools</Option>
                <Option className="p-45" value="Manufacture of machinery">Manufacture of machinery </Option>
                <Option className="p-45" value="Maritime">Maritime</Option>

                <Option className="p-60" value="Aluminium and steel workboats">Aluminium and steel workboats </Option>
                <Option className="p-60" value="Boat/Yacht building">Boat/Yacht building</Option>
                <Option className="p-60" value="Ship repair and conversion">Ship repair and conversion</Option>

                <Option className="p-45" value="Metal structures">Metal structures</Option>
                <Option className="p-45" value="Other">Other</Option>
                <Option className="p-45" value="Repair and maintenance service">Repair and maintenance service</Option>

                <Option className="p-30" value="Metalworking">Metalworking</Option>
                <Option className="p-45" value="Construction of metal structures">Construction of metal structures</Option>
                <Option className="p-45" value="Houses and buildings">Houses and buildings</Option>
                <Option className="p-45" value="Metal products">Metal products</Option>
                <Option className="p-45" value="Metal works">Metal works</Option>

                <Option className="p-60" value="CNC-machining">CNC-machining</Option>
                <Option className="p-60" value="Forgings, Fasteners">Forgings, Fasteners </Option>
                <Option className="p-60" value="Gas, Plasma, Laser cutting">Gas, Plasma, Laser cutting</Option>
                <Option className="p-60" value="MIG, TIG, Aluminum welding">MIG, TIG, Aluminum welding</Option>

                <Option className="p-30" value="Plastic and Rubber">Plastic and Rubber</Option>
                <Option className="p-45" value="Packaging">Packaging</Option>
                <Option className="p-45" value="Plastic goods">Plastic goods</Option>

                <Option className="p-45" value="Plastic processing technology">Plastic processing technology</Option>
                <Option className="p-60" value="Blowing">Blowing</Option>
                <Option className="p-60" value="Moulding">Moulding</Option>
                <Option className="p-60" value="Plastics welding and processing">Plastics welding and processing</Option>

                <Option className="p-45" value="Plastic profiles">Plastic profiles</Option>
                <Option className="p-30" value="Printing">Printing </Option>

                <Option className="p-45" value="Advertising">Advertising</Option>
                <Option className="p-45" value="Book/Periodicals printing">Book/Periodicals printing</Option>
                <Option className="p-45" value="Labelling and packaging printing">Labelling and packaging printing</Option>

                <Option className="p-30" value="Textile and Clothing">Textile and Clothing</Option>
                <Option className="p-45" value="Clothing">Clothing</Option>
                <Option className="p-45" value="Textile">Textile</Option>
                <Option className="p-30" value="Wood">Wood</Option>
                <Option className="p-45" value="Other (Wood)">Other (Wood)</Option>
                <Option className="p-45" value="Wooden building materials">Wooden building materials</Option>
                <Option className="p-45" value="Wooden houses">Wooden houses</Option>

                <Option className="p-30" value="Other">Other</Option>
                <Option className="p-45" value="Creative industries">Creative industries</Option>
                <Option className="p-45" value="Energy technology">Energy technology</Option>
                <Option className="p-45" value="Environment">Environment</Option>
                <Option className="p-30" value="Service">Service</Option>
                <Option className="p-45" value="Business services">Business services</Option>
                <Option className="p-45" value="Engineering">Engineering</Option>
                <Option className="p-45" value="Information Technology and Telecommunications">Information Technology and Telecommunications</Option>

                <Option className="p-60" value="Data processing, Web portals, E-marketing">Data processing, Web portals, E-marketing</Option>
                <Option className="p-60" value="Programming, Consultancy">Programming, Consultancy</Option>
                <Option className="p-60" value="Software, Hardware">Software, Hardware</Option>
                <Option className="p-60" value="Telecommunications">Telecommunications</Option>

                <Option className="p-45" value="Tourism">Tourism</Option>
                <Option className="p-45" value="Translation services">Translation services</Option>
                <Option className="p-45" value="Transport and Logistics">Transport and Logistics</Option>
                <Option className="p-60" value="Air">Air</Option>
                <Option className="p-60" value="Rail">Rail</Option>
                <Option className="p-60" value="Road">Road</Option>
                <Option className="p-60" value="Water">Water</Option>
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
            scroll={{ x: true }}
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
