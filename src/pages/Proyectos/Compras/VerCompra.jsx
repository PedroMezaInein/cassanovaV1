import React from 'react';
import { useSelector } from 'react-redux';
import style from './Ver.module.css'

export default function VerCompra(props) {
    const { data } = props
    const areaCompras = useSelector(state => state.opciones.compras)

    let valorArea = areaCompras.find((element) => parseInt(element.id_area) === data.area.id)
    let valorPartida = valorArea.partidas.find((element) => parseInt(element.id) === data.partida_id)
    const formattedDate = new Date(data.created_at).toISOString().slice(0, 10);
    
    console.log(valorPartida)

    const formatNumber = (num) => {
        return `${num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}`
    }

    return (
        <>
            <div className={`${style.compra} row ml-10 mt-2`}>

                <div className='col-6'>
                    <div>

                        <div>
                            <span>
                                id de compra:
                            </span>
                            <p>{` ${data.id}`}</p>
                        </div>

                        <div>
                            <span>
                                proveedor:
                            </span>
                            <p>{`${data.proveedor.razon_social}`}</p>
                        </div>

                        <div>
                            <span>
                                proyecto:
                            </span>
                            <p>{`${data.proyecto.nombre}`}</p>
                        </div>

                        <div>
                            <span>
                                empresa:
                            </span>
                            <p>{`${data.empresa.name}`}</p>
                        </div>

                        <div>
                            <span>
                                departamento:
                            </span>
                            <p>{`${data.area.nombre}`}</p>
                        </div>

                        <div>
                            <span>
                                tipo de gasto:
                            </span>
                            <p>{`${valorPartida.nombre}`}</p>
                        </div>

                        <div>
                            <span>
                                tipo de subgasto:
                            </span>
                            <p>{`${data.subarea.nombre}`}</p>
                        </div>
                    </div>
                </div>


                <div className='col-6'>
                    <div>

                        <div>
                            <span>
                                fecha:
                            </span>
                            <p>{`${formattedDate}`}</p>
                        </div>

                        <div>
                            <span>
                                descripción:
                            </span>
                            <p>{`${data.descripcion}`}</p>
                        </div>


                        <div>
                            <span>
                                cuenta:
                            </span>
                            <p>{`${data.cuenta.nombre}`}</p>
                        </div>

                        <div>
                            <span>
                                tipo de pago:
                            </span>
                            <p>{`${data.tipo_pago.tipo}`}</p>
                        </div>

                        <div>
                            <span>
                                tipo de impuesto:
                            </span>
                            <p>{`${data.tipo_impuesto.tipo}`}</p>
                        </div>

                        <div>
                            <span>
                                total:
                            </span>
                            <p>{`${data.total ? '$ ' + formatNumber (data.total): ''}`}</p>
                        </div>

                        <div>
                            <span>
                                comisión:
                            </span>
                            <p>{`${ '$ ' + formatNumber (data.comision)}`}</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}