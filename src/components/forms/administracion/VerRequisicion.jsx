import React, {useState, useEffect} from 'react'
import { apiGet } from './../../../functions/api'
// import style from './Ver.module.css'
// import style from './../../../pages/Administracion/RequisicionCompras/Modales/Ver'
import style from './../../../pages/Administracion/RequisicionCompras/Modales/Ver.module.css'

export default function VerRequisicion ({ data }) {
    console.log(data)
    return (
        <>
            <div className={style.container}>

                <div>
                    <span>
                        Solicitante:
                    </span>
                    <p>{` ${data.solicita ? data.solicita : ''}`}</p>
                </div>
 
                <div>
                    <span>
                        Fecha de solicitud:
                    </span>
                    <p>{`${data.fecha}`}</p>
                </div>

                <div>
                    <span>
                        Departamento:
                    </span>
                    <p>{`${data.departamento}`}</p>
                </div>

                <div>
                    <span>
                        Tipo de Gasto:
                    </span>
                    <p>{`${data.data   && data.data.gasto  ? data.data.gasto.nombre : ''}`}</p>
                </div>

                <div>
                    <span>
                        Tipo de Subgasto:
                    </span>
                    <p>{`${data.data && data.data.subarea ? data.data.subarea.nombre : 'NO DEFINIDO'}`}</p>
                </div>

                
                <div>
                    <span>
                        Tipo de pago:
                    </span>
                    <p>{`${data.data && data.data.pago ? data.data.pago.tipo : ''}`}</p>
                </div>

                <div>
                    <span>
                        Monto solicitado:
                    </span>
                    <p>{`$ ${data.data ? data.data.cantidad : ''}`}</p>
                </div>
                <div>
                    <span>
                        Monto Pagado:
                    </span>
                    <p>{`$ ${data.data ? data.data.monto_pago : ''}`}</p>
                </div>

                <div>
                    <span>Estatus</span>
                    <p>
                        {
                            data.estatus
                        }
                    </p>
                    
                </div>

                <div ClassName={style.div9}> 
                    <span>
                        Descripción:
                    </span>
                    <p>{`${ data.data ? data.data.descripcion : ''}`}</p>
                </div>

                <div>
                    <span>
                        Aprobación:
                    </span>
                    <p>
                        {`Compras: ${data.auto1 && data.auto1.name ? data.auto1.name : 'Pendiente'}`}
                    </p>
                    <p>
                        {`Contabilidad: ${data.auto2 && data.auto2.name ? data.auto2.name : 'Pendiente'}`}
                    </p>
                </div>

            </div>

        </>
    )
}