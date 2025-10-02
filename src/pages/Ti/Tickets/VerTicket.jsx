import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { apiGet } from '../../../functions/api';
import Swal from 'sweetalert2';

import style from './../../../pages/Administracion/RequisicionCompras/Modales/Ver';
import Style from './Modales/TicketsTi.module.css';

export default function VerTicket({ data }) {
    const authUser = useSelector(state => state.authUser);
    const [funcionalidades, setFuncionalidades] = useState([]);

    const nombre_empleado = (() => {
        if (data.empleado && typeof data.empleado === 'object') {
            return [data.empleado.nombre, data.empleado.apellido_paterno, data.empleado.apellido_materno]
                .filter(Boolean)
                .join(' ');
        }
        if (data.id_asignacion && typeof data.id_asignacion === 'string') {
            return data.id_asignacion;
        }
        return '';
    })();

    useEffect(() => {
        getFuncionalidades();
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getFuncionalidades = () => {
        apiGet(`ti/funcionalidad/${data.id}`, authUser.access_token)
            .then((response) => {
                Swal.close();
                setFuncionalidades(response.data.funcionalidades || []);
            })
            .catch(() => {
                Swal.close();
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Algo salió mal',
                });
            });
    };

    const setTipo = (tipo) => {
        switch (tipo) {
            case '1': return '🍠 Capacitación o ayuda técnica';
            case '2': return '⚙️ Problemas con la plataforma';
            case '3': return '🚀 Nuevo proyecto o desarrollo';
            case '4': return '🧑‍💻 Problemas con computadora';
            case '5': return '⚠️ Otro ...';
            default: return 'Tipo desconocido';
        }
    };

    const setEstatus = (estatus) => {
        switch (estatus) {
            case '0':
            case '1': return 'Solicitado';
            case '2': return 'En desarrollo';
            case '3': return 'Terminado';
            case '4': return 'Cancelado';
            case '5': return 'Rechazado';
            default: return 'Sin estatus';
        }
    };

    const renderPrioridad = (nivel) => {
        const valor = nivel?.toString().toLowerCase() || '';
        if (valor === 'alta') return <span className={Style.prioridadAlta}>🔴 Alta</span>;
        if (valor === 'media') return <span className={Style.prioridadMedia}>🟡 Media</span>;
        if (valor === 'baja') return <span className={Style.prioridadBaja}>🟢 Baja</span>;
        return <span>No definida</span>;
    };

    return (
        <div className='row ml-10 mt-2'>
            <div className='col-6'>
                <div className={style.container}>
                    <div>
                        <span>Fecha de solicitud:</span>
                        <p>{data.fecha}</p>
                    </div>

                    <div>
                        <span>Tipo de ticket:</span>
                        <p>{setTipo(data.tipo)}</p>
                    </div>

                    <div>
                        <span>Estatus:</span>
                        <p>{setEstatus(data.estatus)}</p>
                    </div>

                    <div>
                        <span>Prioridad:</span>
                        <p>{renderPrioridad(data.prioridad)}</p>
                    </div>

                    <div>
                        <span>Asignación</span>
                        <input value={nombre_empleado} disabled />
                    </div>
                </div>
            </div>

            <div className='mt-10'>
                <div>
                    <span>Descripción:</span>
                    <p>{data.descripcion}</p>
                </div>

                <div>
                    <span>Aprobación:</span>
                    <p>
                        {data.autorizacion
                            ? <span className={Style.autorizado}>Aprobado</span>
                            : <span className={Style.pendiente}>Pendiente</span>
                        }
                    </p>
                </div>

                <div>
                    <span>Fecha de entrega:</span>
                    <p>{data.fecha_entrega}</p>
                </div>

                <div>
                    <span>Funcionalidades:</span>
                    {funcionalidades.length > 0 ? (
                        funcionalidades.map((item, index) => (
                            <div key={index} className={Style.containerFuncionalidad}>
                                <span className={Style.textFuncionalidad}>
                                    {item.descripcion}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div>No hay funcionalidades</div>
                    )}
                </div>
            </div>
        </div>
    );
}
