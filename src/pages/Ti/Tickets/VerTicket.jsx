import React from 'react'
import style from './../../../pages/Administracion/RequisicionCompras/Modales/Ver'

export default function VerTicket ({ data }) {
    console.log(data)
    return (
        <>
            <div className='row ml-10 mt-2'>

                <div className='col-6'>
                    <div className={style.container}>

                        <div>
                            <span>
                                Fecha de petición:
                            </span>
                            <p>{` ${data.fecha}`}</p>
                        </div>

                        <div>
                            <span>
                                Tipo de ticket:
                            </span>
                            <p>{` ${data.tipo}`}</p>
                        </div>

                        <div>
                            <span>
                                Estatus:
                            </span>
                            <p>{`${data.estatus}`}</p>
                        </div>

                        <div>
                            <span>
                                Funcionalidad:
                            </span>
                            <p>{`${data.funcionalidad}`}</p>
                        </div>
                    </div>
                </div>

                <div>
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
                            {/* {`Compras: ${data.auto1 && data.auto1.name ? data.auto1.name : 'Pendiente'}`} */}
                            {`${data.aprobacion}`}
                        </p>
                    </div>

                    <div>
                        <span>
                        Fecha de entrega
                        </span>
                        <p>{`${data.fecha_entrega}`}</p>
                    </div>

                </div>
            </div>
        </>
    )

    
}