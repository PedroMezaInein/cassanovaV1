import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api'
import { Modal, Table, Button } from 'react-bootstrap';
import { apiDelete, apiPutForm,apiOptions,apiGet } from '../../../functions/api'


import Style from './NuevaRequisicion.module.css'
import './../../../styles/_nuevaRequisicion.scss'

export default function Historial(props) {

const { data, handleClose, reload, opciones, estatusCompras } = props
const user = useSelector((state) => state.authUser);
const [selectedItem1, setSelectedItem1] = useState(null);
const [datosTabla1, setDatosTabla1] = useState([]);
const [reloadTable, setReloadTable] = useState()

 
  const handleSeleccionTabla1 = (item) => {
    setSelectedItem1(item);
  };

  useEffect(() => {
    // Llama a tu función para obtener datos de la API y actualiza el estado de las tablas
    apiGet(`requisicion/compras/historialPresu/${data.id}`, user.access_token)
        .then((res) => {
            // Ensure that res.data is an array before setting it to datosTabla1
            if (Array.isArray(res.data.data)) {
                setDatosTabla1(res.data.data);
            } else {
                console.error('API response is not an array:', res.data);
            }
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, []); // El segundo argumento asegura que este efecto se ejecute solo una vez al montar el componente


  
  return (
    <>
      <div className="container">
        <div style={{ marginLeft: '2.5rem' }}>
          <div className="tabla1">
            <h5></h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Estatus</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {datosTabla1.map((item) => (
                  <tr key={item.id} onClick={() => handleSeleccionTabla1(item)}>
                    <td>{item.estatus ? item.estatus.estatus : ''}</td>
                    <td>{item.usuario ? item.usuario.name : 'Sin usuario'}</td>
                   

                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
     
        </div>
      </div>
    </>
  );
}