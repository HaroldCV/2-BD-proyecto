import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './component.css';

function MyComponent() {
  const [docsToRead, setDocsToRead] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirectToDataCargada, setRedirectToDataCargada] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitClicked(true);
    setLoading(true);

    try {
      // Simulación de carga
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Procesamiento de los datos
      const response = await fetch('http://localhost:5000/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ docs_to_read: docsToRead }),
      });

      if (response.ok) {
        setRedirectToDataCargada(true);
        // Mostrar la alerta de procesamiento terminado
        Swal.fire('Procesamiento terminado', 'Los datos se han cargado correctamente.', 'success');
      } else {
        throw new Error('Error al enviar los datos al servidor.');
      }
    } catch (error) {
      console.error(error);
      // Manejar el error en caso de que ocurra
      Swal.fire('Error', 'Ha ocurrido un error durante el procesamiento de los datos.', 'error');
    } finally {
      setLoading(false);
      setSubmitClicked(false);
    }
  };

  const handleChange = (event) => {
    setDocsToRead(event.target.value);
  };

  if (redirectToDataCargada) {
    return <Navigate to={`/data_cargada/${docsToRead}/${docsToRead}`} />;
  }

  return (
    <div className="center-container">
        <div className="form-container">
      {loading && (
        <div className="overlay">
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </div>
      )}
      <div className="header_gr_text">
        <form onSubmit={handleSubmit}>
          <h1 className="gradient__text">¿Cúantos datos desea cargar?</h1>
          <div className="form-floating"style={{ marginTop: '35px' }}>
            <input
              type="text"
              className="form-control"
              id="docs_to_read"
              name="docs_to_read"
              placeholder="Ingrese la cantidad de datos que quieres cargar"
              value={docsToRead}
              onChange={handleChange}
            />
             <button type="submit" className="boton_p1" disabled={loading || submitClicked}>
              {submitClicked && loading ? <span>Cargando...</span>: <span>Enviar</span>}
            </button>
          </div>
        </form>
      </div>
        </div>
    </div>
  );
}

export default MyComponent;
