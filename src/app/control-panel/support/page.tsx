'use client'
import React, { useState } from "react";
import { Table, Button, Space, Modal, Input } from "antd";

import {PageContainerControlPanel} from "@/shared/ui";
import {PageHeader} from "@/shared/ui/PageHeader";

const { TextArea } = Input;

const SupportPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [response, setResponse] = useState("");

  // Sample data for the table
  const data = [
    {
      key: '1',
      customerEmail: 'customer1@example.com',
      customer: "Петров Иван Михайлович",
      question: 'How do I reset my password?',
    },
    {
      key: '2',
      customerEmail: 'customer2@example.com',
      customer: "Петров Иван Михайлович",
      question: 'Can I change my email address?',
    },
    {
      key: '3',
      customerEmail: 'customer3@example.com',
      customer: "Петров Иван Михайлович",
      question: 'What is the refund policy?',
    },
  ];

  const columns = [
    {
      title: 'Email отправителя',
      dataIndex: 'customerEmail',
      key: 'customerEmail',
    },
    {
      title: 'ФИО',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Вопрос',
      dataIndex: 'question',
      key: 'question',
    },
    {
      title: 'Действия',
      key: 'action',
      render: (_:any, record:any) => (
        <Space size="middle">
          <Button
            type="primary"
            onClick={() => handleResponse(record)}
          >
            Ответить
          </Button>
        </Space>
      ),
    },
  ];

  // Handle opening the response modal
  const handleResponse = (record: any) => {
    setSelectedTicket(record);
    setIsModalVisible(true);
  };

  // Handle submitting the response
  const handleSendResponse = () => {
    // Logic to send response (e.g., API call) goes here
    //console.log(`Sending response: ${response} to ${selectedTicket.customer}`);
    setIsModalVisible(false);
    setResponse("");
  };

  return (
    <PageContainerControlPanel>
      <PageHeader
        title="Поддержка"
        showBottomDivider
      />
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Ответ пользователю"
        open={isModalVisible}
        onOk={handleSendResponse}
        onCancel={() => setIsModalVisible(false)}
      >
        <p className="mb-3"><strong>Вопрос:</strong> {selectedTicket?.question}</p>
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
