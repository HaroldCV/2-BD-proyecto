import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function DataCargada() {
  const { docsToRead, c } = useParams();
  const [query, setQuery] = useState('');
  const [topK, setTopK] = useState('');
  const navigate = useNavigate();
  const [resultado, setResultado] = useState([]);
  const [postgresResultado, setPostgresResultado] = useState([]);
  const [pythonTime, setPythonTime] = useState(0);
  const [postgresTime, setPostgresTime] = useState(0);

  const handleSubmit = async (event) => {
    event.preventDefault();

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
      } else {
        throw new Error('Error al enviar los datos al servidor.');
      }
    } catch (error) {
      console.error(error);
      // Manejar el error en caso de que ocurra
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

  return (
    <div className="p-5 text-center" style={{ marginTop: '58px' }}>
      <form onSubmit={handleSubmit}>
        <h1 className="mb-3">Data Cargada</h1>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="query"
            name="query"
            placeholder="Ingrese la consulta"
            value={query}
            onChange={handleChangeQuery}
          />
          <label htmlFor="query">Consulta</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="text"
            className="form-control"
            id="topk"
            name="topk"
            placeholder="Ingrese el valor de topk"
            value={topK}
            onChange={handleChangeTopK}
          />
          <label htmlFor="topk">Valor de topk</label>
        </div>
        <div>
          <input type="submit" className="btn btn-primary me-2" value="Enviar" />
          <button type="button" className="btn btn-secondary me-2" onClick={handleReset}>Reset</button>
          <button type="button" className="btn btn-secondary" onClick={handleGoBack}>Volver</button>
        </div>
      </form>
      <div className="container">
        <div className="row">
          <div className="col">
            <h2>Top K Python</h2>
            <p> Time: {pythonTime} ms</p>
            {resultado.map((value) => (
              <p key={value.id}>
                ID: {value.id} <br />
                Title: {value.title} <br />
                Score: {value.score}
              </p>
            ))}
          </div>
          <div className="col">
            <h2>Top K PostgreSQL</h2>
            <p> Time: {postgresTime} ms</p>
            {postgresResultado.map((value) => (
              <p key={value.id}>
                ID: {value.id} <br />
                Title: {value.title} <br />
                Score: {value.score}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default DataCargada;
