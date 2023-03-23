import React, {useState, useEffect} from 'react'
// import style from './Ver.module.css'
import style from './../../../../pages/Administracion/RequisicionCompras/Modales/Ver'

export default function VerInsumo ({ data }) {
    console.log(data)

     //funcion para dar formato a los numeros con comas y dos decimales sin redondear
     const formatNumber = (num) => {
        return `$${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }
    
    return (
        <>
            <div className='row ml-10 mt-2'>

                <div className='col-6'>
                    <div className={style.container}>

                        <div>
                            <span>
                               Insumo:
                            </span>
                            <p>{` ${data.nombre}`}</p>
                        </div>

                        <div>
                            <span>
                                cantidad:
                            </span>
                            <p>{` ${data.cantidad}`}</p>
                        </div>

                        <div>
                            <span>
                                costo:
                            </span>
                            <p>{`${data.costo ? '$ '+ formatNumber (data.costo): ''}`}</p>
                        </div>

                        <div>
                            <span>
                                unidad:
                            </span>
                            <p>{`${data.unidad && data.unidad.nombre ? data.unidad.nombre : ''}`}</p>
                        </div>

                        <div>
                            <span>
                                frecuencia:
                            </span>
                            <p>{`${data.frecuencia}`}</p>
                        </div>
                    </div>
                </div>
                
                <div className='col-6'>
                    <div>
                        <span>stock</span>
                        <p>
                            {
                                data.stock
                            }
                        </p>
                        
                    </div>

                    <div ClassName={style.div9}> 
                        <span>
                            maximo:
                        </span>
                        <p>{`${data.maximo}`}</p>
                    </div>

                    <div>
                        <span>
                            minimo
                        </span>
                        <p>{`${data.minimo}`}</p>
                    </div>

                    <div>
                        <span>
                            descripcion
                        </span>
                        <p>{`${data.descripcion}`}</p>
                    </div>

                </div>
            </div>
        </>
    )

    
}