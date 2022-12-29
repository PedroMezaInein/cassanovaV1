import React from 'react'

export default function Adjuntos(props) {
    const { data } = props
    console.log(data)
    return (
        <>
            <div className="flex-column">
                
                <div>
                    <span>
                        {`Solicitante: ${data.solicitante}`}
                    </span>
                </div>

                <div>
                    <span>
                        {`Fecha de solicitud: ${data.fecha}`}
                    </span>
                </div>

                <div>
                    <span>
                        {`Departamento: ${data.departamento}`}
                    </span>
                </div>

                <div>
                    <span>
                        {`Tipo de egreso: ${data.tipoEgreso}`}
                    </span>
                </div>

                <div>
                    <span>
                        {`Tipo de pago: ${data.tipoPago}`}
                    </span>
                </div>

                <div>
                    <span>
                        {`Monto solicitado: ${data.monto}`}
                    </span>
                </div>

                <div>
                    <span>
                        Estatus: 
                        {
                            data.status === 'Autorizado' && <span className="btn-success">{data.status}</span> 
                        }
                    </span>
                </div>
            </div>

        </>
    )
}