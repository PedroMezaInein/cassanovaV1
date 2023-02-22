import React, {useState, useEffect} from 'react'
import { apiGet } from './../../../functions/api'
// import style from './Ver.module.css'
import style from './../../../pages/Administracion/RequisicionCompras/Modales/Ver'

export default function VerRequisicion ({ data }) {
    console.log(data)
    return (
        <>
            <div className={style.container}>

                <div>
                    <span>
                        Orde de compra:
                    </span>
                    <p>{` ${data.orden_compra}`}</p>
                </div>

                <div>
                    <span>
                        Solicitante:
                    </span>
                    <p>{` ${data.solicitante}`}</p>
                </div>

                <div>
                    <span>
                        Departamento:
                    </span>
                    <p>{`${data.departamento}`}</p>
                </div>

                <div>
                    <span>
                        Tipo de Egreso:
                    </span>
                    <p>{`${data.tipoEgreso}`}</p>
                </div>

                <div>
                    <span>
                        Fecha de solicitud:
                    </span>
                    <p>{`${data.fecha}`}</p>
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
                    <p>{`${data.descripcion}`}</p>
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

                <div>
                    <span>
                        Tiempo estimado
                    </span>
                    <p>{`${data.tiempo_estimado}`}</p>
                </div>

            </div>

        </>
    )

    
}