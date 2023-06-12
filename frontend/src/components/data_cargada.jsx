import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Input, Button, Table, Row, Col } from 'antd';
import "./data_cargada.css"
import Swal from 'sweetalert2';
function DataCargada() {
  const { docsToRead, c } = useParams();
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState('');
  const navigate = useNavigate();
  const [resultado, setResultado] = useState([]);
  const [postgresResultado, setPostgresResultado] = useState([]);
  const [pythonTime, setPythonTime] = useState(0);
  const [postgresTime, setPostgresTime] = useState(0);

  const handleSubmit = async (values) => {
    try {
      const response = await fetch(`http://localhost:5000/${docsToRead}/${c}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, topk: topK }),
      });
  
      if (response.ok) {
        const { resultado, postgres_resultado, python_time, postgres_time } = await response.json();
        setResultado(resultado);
        setPostgresResultado(postgres_resultado);
        setPythonTime(python_time);
        setPostgresTime(postgres_time);
  
        Swal.fire({
          icon: 'success',
          title: 'Consulta exitosa',
          text: 'Los datos se enviaron correctamente.',
        });
      } else {
        throw new Error('Error al enviar los datos al servidor.');
      }
    } catch (error) {
      console.error(error);
  
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar los datos al servidor.',
      });
    }
  };

  const handleReset = () => {
    setQuery('');
    setTopK('');
  };

  const handleGoBack = () => {
    navigate(-1); // Navegar hacia atrás en el historial
  };

  const handleChangeQuery = (event) => {
    setQuery(event.target.value);
  };

  const handleChangeTopK = (event) => {
    setTopK(event.target.value);
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 50,
      align: 'center',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      align: 'center',
      ellipsis: true,
    },
    {
      title: 'Score',
      dataIndex: 'score',
      key: 'score',
      width: 50,
      align: 'center',
      render: (score) => score.toFixed(2),
    },
  ];
  return (
    <div className="p-5 text-center" style={{ marginTop: '58px' }}>
      <Form onFinish={handleSubmit}>
        <h1 className="gradient__text">Data Cargada</h1>
        <Form.Item className="mb-3" label={<span className="label-text">Consulta</span>}>
          <Input
            type="text"
            placeholder="Ingrese la consulta"
            value={query}
            onChange={handleChangeQuery}
            className="custom-input"
          />
        </Form.Item>
        <Form.Item className="mb-3" label={<span className="label-text">Valor de topk</span>}>
          <Input
            type="text"
            placeholder="Ingrese el valor de topk"
            value={topK}
            onChange={handleChangeTopK}
            className="custom-input"
          />
        </Form.Item>
        <div className="flex justify-center">
          <Button type="primary" htmlType="submit" className="mr-2">
            Enviar
          </Button>
          <Button type="default" onClick={handleReset} className="mr-2">
            Reset
          </Button>
          <Button onClick={handleGoBack}>Volver</Button>
        </div>
      </Form>
      <Row>
        <Col span={12}>
          <div className="bg-gray-200 border border-gray-400 rounded p-4 mt-4">
            <h2 className="gradient__text">Top K Python</h2>
            <p className="text-custom-color">Time: {pythonTime} ms</p>

            <Table
              dataSource={resultado}
              locale={{ emptyText: 'No hay datos disponibles' }}
              pagination={false}
              bordered
              rowClassName={() => 'table-row'}
              rowStyle={{ height: '50px' }}
              columns={columns}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className="bg-gray-200 border border-gray-400 rounded p-4 mt-4">
            <h2 className="gradient__text">Top K PostgreSQL</h2>
            <p className="text-custom-color">Time: {postgresTime} ms</p>
            <Table
              dataSource={postgresResultado}
              locale={{ emptyText: 'No hay datos disponibles' }}
              pagination={false}
              bordered
              rowClassName={() => 'table-row'}
              rowStyle={{ height: '50px' }}
              columns={columns}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default DataCargada;
