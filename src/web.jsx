import React, { useState } from 'react';
import axios from 'axios';
import { Container, Form, Button, Alert } from 'react-bootstrap';

function Web() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file.');
      return;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setUploadStatus('File size exceeds the limit of 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('wordFile', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/convert', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadStatus('File successfully converted to PDF.');
      console.log(response);
    } catch (error) {
      console.error(error);
      setUploadStatus('File upload failed. Please try again.');
    }
  };

  return (
    <Container>
      <h1>Word to PDF Converter</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Select a Word file (.docx)</Form.Label>
          <Form.Control type="file" accept=".docx" onChange={handleFileChange} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Convert to PDF
        </Button>
        {uploadStatus && <Alert variant={uploadStatus.includes('success') ? 'success' : 'danger'}>{uploadStatus}</Alert>}
      </Form>
    </Container>
  );
}

export default Web;
