import React from 'react'
// import style from './../../../../../pages/Administracion/RequisicionCompras/Modales/Ver'
// import Style from './../../../../../pages/Administracion/RequisicionCompras/Modales/Ver.module.css'

export default function VerNotaObra ({ data }) {
    console.log(data)
    return (
        <>
            <div className='row mt-2' style={{ padding: '1rem' }}>

                <div className='col-5'>
                    <div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                Fecha:
                            </span>
                            <p>{` ${data.fecha}`}</p>
                        </div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                tipo de nota:
                            </span>
                            <p>{`${data.tipo_nota}`}</p>
                        </div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                nota:
                            </span>
                            <p>{`${data.nota}`}</p>
                        </div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                proveedor:
                            </span>
                            <p>{`${data.proveedor}`}</p>
                        </div>

                    </div>
                </div>

                <div className='col-1'></div>
                
                <div className='col-6'>
                    <div>
                        <object
                            data={data.url}
                        // className={classes.adjuntos}
                        >
                        </object> 
                    </div>
                </div> 
            </div>
        </>
    )

    
}