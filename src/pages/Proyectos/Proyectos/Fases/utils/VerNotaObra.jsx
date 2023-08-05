import React from 'react'
// import style from './../../../../../pages/Administracion/RequisicionCompras/Modales/Ver'
// import Style from './../../../../../pages/Administracion/RequisicionCompras/Modales/Ver.module.css'

export default function VerNotaObra ({ data }) {
    return (
        <>
            <div className='row mt-2' style={{ padding: '1rem' }}>

                <div className='col-5'>
                    <div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                hora:
                            </span>
                            <p>{` ${data.hora}`}</p>
                        </div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                tipo de nota:
                            </span>
                            <p>{`${data.tipo_nota}`}</p>
                        </div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                tema:
                            </span>
                            <p>{`${data.tema}`}</p>
                        </div>

                        <div>
                            <span style={{ color: '#315694', fontWeight: 'bold'}}>
                                número de personal:
                            </span>
                            <p>{`${data.num_personal}`}</p>
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
                            style={{ width: '90%', heigth: '70%' }}
                        >
                        </object> 
                    </div>
                    <div style={{ display:'flex', justifyContent:'center' }}>
                        <a href={data.url} target='_blank' rel="noreferrer" style={{ color: 'white' }}>
                            <button className='btn btn-primary' style={{ width: '90px' }}>
                                ver
                            </button>
                        </a>
                    </div>
                </div> 
                
            </div>
        </>
    )
}