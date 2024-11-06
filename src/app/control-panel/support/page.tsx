// SupportPage.js
'use client'
import { useState } from "react";
import { Table, Button, Space, Modal, Input, Tag } from "antd";
import PageContainerControlPanel from "@/components/PageContainerControlPanel/PageContainerControlPanel";

const { TextArea } = Input;

const SupportPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [response, setResponse] = useState("");

  // Sample data for the table
  const data = [
    {
      key: '1',
      customer: 'customer1@example.com',
      question: 'How do I reset my password?',
      status: 'Pending',
    },
    {
      key: '2',
      customer: 'customer2@example.com',
      question: 'Can I change my email address?',
      status: 'Resolved',
    },
    {
      key: '3',
      customer: 'customer3@example.com',
      question: 'What is the refund policy?',
      status: 'Pending',
    },
  ];

  // Columns for the table
  const columns = [
    {
      title: 'Customer Email',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Question',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: status => (
        <Tag color={status === 'Pending' ? 'orange' : 'green'}>{status}</Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleResponse(record)}
            disabled={record.status === 'Resolved'}
          >
            Respond
          </Button>
        </Space>
      ),
    },
  ];

  // Handle opening the response modal
  const handleResponse = (record) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
  };

  // Handle submitting the response
  const handleSendResponse = () => {
    // Logic to send response (e.g., API call) goes here
    console.log(`Sending response: ${response} to ${selectedTicket.customer}`);
    setIsModalVisible(false);
    setResponse("");
  };

  return (
    <PageContainerControlPanel>
      <h1>Support Page</h1>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />

      {/* Modal for responding to a question */}
      <Modal
        title="Respond to Customer"
        open={isModalVisible}
        onOk={handleSendResponse}
        onCancel={() => setIsModalVisible(false)}
      >
        <p><strong>Question:</strong> {selectedTicket?.question}</p>
        <TextArea
          rows={4}
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Type your response here..."
        />
      </Modal>
    </PageContainerControlPanel>
  );
};

export default SupportPage;
