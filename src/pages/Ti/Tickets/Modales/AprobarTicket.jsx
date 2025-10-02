import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import Style from './TicketsTi.module.css';
import { apiGet, apiPostForm } from './../../../../functions/api';

export default function AprobarTicket({ data, reload, handleClose }) {
  const userAuth = useSelector((state) => state.authUser.access_token);

  const [form, setForm] = useState({
    funcionalidades: [],
  });

  useEffect(() => {
    getFuncionalidades();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getFuncionalidades = () => {
    apiGet(`ti/funcionalidad/${data.id}`, userAuth)
      .then((response) => {
        const aux = response.data.funcionalidades.map((item) => item.descripcion);
        setForm((prev) => ({
          ...prev,
          funcionalidades: aux,
        }));
      })
      .catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Ocurrió un error al obtener las funcionalidades',
        });
      });
  };

  const aprobarTicket = () => {
    Swal.fire({
      title: '¿Estás seguro de aprobar las funcionalidades?',
      icon: 'warning',
      text: 'Una vez aprobado no se podrá modificar',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.showLoading();
        apiPostForm(`ti/autorizar/${data.id}`, {
          funcionalidades: form.funcionalidades,
        }, userAuth)
          .then(() => {
            Swal.close();
            Swal.fire('¡Se aprobó con éxito!', '', 'success');
            if (reload) reload();
            if (handleClose) handleClose();
          })
          .catch(() => {
            Swal.close();
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Ocurrió un error al aprobar las funcionalidades.',
            });
          });
      }
    });
  };

  return (
    <>
      <div className={Style.containerList}>
        {form.funcionalidades.length > 0 ? (
          form.funcionalidades.map((item, index) => (
            <span key={index} className={Style.autorizado}>
              {`${index + 1}.- ${item}`}
            </span>
          ))
        ) : (
          <span>Sin funcionalidades</span>
        )}
      </div>

      <div className="nuevo_ticket_boton">
        {form.funcionalidades.length > 0 && (
          <button className="sendButton" onClick={aprobarTicket}>
            Aprobar
          </button>
        )}
      </div>
    </>
  );
}
