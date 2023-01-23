import React from 'react'

import style from './Ver.module.css'

export default function Adjuntos(props) {
    const { data } = props
    console.log(data)
    return (
        <>
            <div className={style.container}>

                <div>
                    <span>
                        Solicitante:
                    </span>
                    <p>{` ${data.solicitante}`}</p>
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
                        Tipo de Egreso:
                    </span>
                    <p>{`${data.tipoEgreso}`}</p>
                </div>

                <div>
                    <span>
                        Tipo de pago:
                    </span>
                    <p>{`${data.tipoPago}`}</p>
                </div>

                <div>
                    <span>
                        Monto solicitado:
                    </span>
                    <p>{`$ ${data.monto_solicitado}`}</p>
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

            </div>

        </>
    )
}