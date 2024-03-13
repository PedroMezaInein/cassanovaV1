import React, {useState, useEffect} from "react"
import { useSelector } from "react-redux";
import Swal from 'sweetalert2'

import { apiPostForm } from '../../../functions/api'
import { Modal, Table, Button } from 'react-bootstrap';
import { apiDelete, apiPutForm,apiOptions } from '../../../functions/api'


import Style from './NuevaRequisicion.module.css'
import './../../../styles/_nuevaRequisicion.scss'

export default function FiltrarRequisiciones(props) {

const { data, handleClose, reload, opciones, estatusCompras } = props
const user = useSelector((state) => state.authUser);
const [selectedItem1, setSelectedItem1] = useState(null);
const [selectedItem2, setSelectedItem2] = useState(null);
const [datosTabla1, setDatosTabla1] = useState([]);
const [datosTabla2, setDatosTabla2] = useState([]);
const [reloadTable, setReloadTable] = useState()

 
  const handleSeleccionTabla1 = (item) => {
    setSelectedItem1(item);
  };

  const handleSeleccionTabla2 = (item) => {
    setSelectedItem2(item);
  };

  useEffect(() => {
    // Llama a tu función para obtener datos de la API y actualiza el estado de las tablas
    apiOptions(`requisicion/autoriza/presupuesto`, user.access_token)
        .then((data) => {

            const datosConTotalMeses = data.data.autoriza.map((result) => {
                let totalMeses = 0;
      
                if (result.enero) totalMeses += result.enero;
                if (result.febrero) totalMeses += result.febrero;
                if (result.marzo) totalMeses += result.marzo;
                if (result.abril) totalMeses += result.abril;
                if (result.mayo) totalMeses += result.mayo;
                if (result.junio) totalMeses += result.junio;
                if (result.julio) totalMeses += result.julio;
                if (result.agosto) totalMeses += result.agosto;
                if (result.septiembre) totalMeses += result.septiembre;
                if (result.octubre) totalMeses += result.octubre;
                if (result.noviembre) totalMeses += result.noviembre;
                if (result.diciembre) totalMeses += result.diciembre;
      
                return {
                  ...result,
                  totalMeses: totalMeses,
                };
              });
        // console.log(data.data)
        setDatosTabla1(datosConTotalMeses);
        setDatosTabla2(data.data.montos);
      })
      .catch((error) => {
        console.error('Error al obtener datos de la API:', error);
      });
  }, []); // El segundo argumento asegura que este efecto se ejecute solo una vez al montar el componente


  const handleAutorizar = (id) => {
    Swal.fire({
        title: '¿Estás seguro?',
        text: '¡No podrás revertir esto!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, autorizar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Aquí debes realizar la llamada a la API para autorizar
          apiPutForm(`requisicion/${id}/autorizarpresu`, { aprobado: 1 }, user.access_token)
              .then((response) => {
                  Swal.close()
                //   Swal.fire(
                //       '¡Autorizado!',
                //       'El presupuesto ha sido Autorizado.',
                //       'success'
                //   )
                  setTimeout(() => {
                      Swal.fire({
                          title: '¡Autorizado',
                          text: 'El presupuesto fue aprobado exitosamente.',
                          icon: 'success',
                          confirmButtonColor: '#3085d6',
                          confirmButtonText: 'Ok'
                      });
                  }, 2000);
                  handleClose('autoriza')

                  if (reloadTable) {
                      reloadTable.reload()
                  }
              
            })
            .catch((error) => {
              console.error('Error al autorizar el presupuesto:', error);
              Swal.fire('Error', 'No se pudo autorizar el presupuesto. Inténtalo de nuevo.', 'error');
            });
        }
      });
    };

  const handleMontos = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Sí, autorizar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí debes realizar la llamada a la API para autorizar
        apiPutForm(`requisicion/${id}/autorizar`, { aprobado: 1 }, user.access_token)
            .then((response) => {
                Swal.close()
                Swal.fire(
                    '¡Autorizado!',
                    'El presupuesto ha sido Autorizado.',
                    'success'
                )
                setTimeout(() => {
                    Swal.fire({
                        title: 'Presupuesto aprobado',
                        text: 'El presupuesto fue aprobado exitosamente.',
                        icon: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: 'Ok'
                    });
                }, 2000);
                handleClose('autoriza')

                if (reloadTable) {
                    reloadTable.reload()
                }
            
          })
          .catch((error) => {
            console.error('Error al autorizar el presupuesto:', error);
            Swal.fire('Error', 'No se pudo autorizar el presupuesto. Inténtalo de nuevo.', 'error');
          });
      }
    });
  };

  

  return (
    <>
      <div className="container">
        <div style={{ marginLeft: '2.5rem' }}>
          <div className="tabla1">
            <h5>Autorizacion de Presupuesto</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Presupuesto</th>
                  <th>DEPARTAMENTO</th>
                  <th>PARTIDA</th>
                  <th>SUBPARTIDA</th>
                  <th>MONTO SOLICITADO (*)</th>
                  <th>AUTORIZAR</th>
                </tr>
              </thead>
              <tbody>
                {datosTabla1.map((item) => (
                  <tr key={item.id} onClick={() => handleSeleccionTabla1(item)}>
                    <td>{item.presupuesto.nombre}</td>
                    <td>{item.areas.nombre}</td>
                    <td>{item.partidas.nombre}</td>
                    <td>{item.subpartidas.nombre}</td>
                    <td>{item.totalMeses}</td>
                    <td>
                    <Button variant="success" onClick={() => handleAutorizar(item.id)}>
                        Autorizar
                    </Button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <div className="tabla2">
            <h5>Autorizacion de montos</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                    <th>No. orden</th>
                    <th>DEPARTAMENTO</th>
                    <th>PARTIDA</th>
                    <th>SUBPARTIDA</th>
                    <th>MONTO SOLICITADO (*)</th>
                    <th>AUTORIZAR</th>
                </tr>
              </thead>
              <tbody>
                {datosTabla2.map((item) => (
                  <tr key={item.id} onClick={() => handleSeleccionTabla2(item)}>
                     <td>{item.orden_compra}</td>
                     <td>{item.departamento.nombre}</td>
                     <td>{item.gasto.nombre}</td>
                     <td>{item.subarea.nombre}</td>
                     <td>{item.monto_pago}</td>
                     <td><Button variant="success" onClick={() => handleMontos(item.id)}>Autorizar</Button></td>
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