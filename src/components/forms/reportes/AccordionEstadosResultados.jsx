import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import TablaEstadosResultados from '../reportes/TablaEstadosResultados'
import HeadersTotales from '../reportes/HeadersTotales'

class AccordionEstadosResultados extends Component {

    state = {
        title: '',
        accordion: [
            {
                nombre: 'VENTAS',
                icono: 'flaticon2-chart',
                tipo: 1,
                isActive: false,
                total_header: 'Total ventas'
            },
            {
                nombre: 'Ingresos',
                icono: 'flaticon2-chart',
                tipo: 2,
                isActive: false,
                total_header: 'Total ingresos'
            },
            {
                nombre: 'COSTOS DE SERVICIO',
                icono: 'flaticon-coins',
                tipo: 3,
                isActive: false,
                total_header: 'Total costos de servicio'
            },
            {
                nombre: 'GASTOS OPERATIVOS',
                icono: 'flaticon2-chart',
                tipo: 4,
                isActive: false,
                total_header: 'Total de gastos operativos'
            }
        ]
    };


    openAccordion = (indiceClick) => {
        let { accordion } = this.state
        accordion.map((element, key) => {
            if (indiceClick == key) {
                element.isActive = element.isActive ? false : true
            }
            else {
                element.isActive = false
            }
        })
        this.setState({
            accordion: accordion
        });
    }

    sumaTotalVentas() {
        const { ventas } = this.props
        let sumaVentas = 0
        ventas.map((venta) => {
            sumaVentas = sumaVentas + venta.total
        })
        return sumaVentas
    }

    sumaTotalIngresos() {
        const { ingresos } = this.props
        let sumaIngresos = 0
        ingresos.map((ingreso) => {
            sumaIngresos = sumaIngresos + ingreso.total
        })
        return sumaIngresos
    }

    sumaTotalCostos() {
        const { compras } = this.props
        let sumaCompras = 0
        compras.map((compra) => {
            sumaCompras = sumaCompras + compra.total
        })
        return sumaCompras
    }

    sumaTotalGastos() {
        const { egresos } = this.props
        let sumaGastos = 0
        egresos.map((egreso) => {
            sumaGastos = sumaGastos + egreso.total
        })
        return sumaGastos
    }

    sumaUtilidadBruta() {
        const { ingresos, compras } = this.props
        let sumaIngresos = 0
        let sumaCostos = 0
        ingresos.map((ingreso) => {
            sumaIngresos = sumaIngresos + ingreso.total
        })
        compras.map((compra) => {
            sumaCostos = sumaCostos + compra.total
        })
        let totalUtilidad = sumaIngresos + sumaCostos
        return totalUtilidad
    }


    resultOperativo() {
        const { ingresos, compras, egresos } = this.props
        let sumaIngresos = 0
        let sumaCostos = 0
        ingresos.map((ingreso) => {
            sumaIngresos = sumaIngresos + ingreso.total
        })
        compras.map((compra) => {
            sumaCostos = sumaCostos + compra.total
        })
        let utilidadBruta = sumaIngresos + sumaCostos

        let sumaGastos = 0
        egresos.map((egreso) => {
            sumaGastos = sumaGastos + egreso.total
        })

        let resultado = utilidadBruta - sumaGastos
        return resultado
    }

    render() {
        const { accordion } = this.state
        const { ventas, ingresos, compras, egresos } = this.props

        const table = (element) => {
            switch (element.tipo) {
                case 1: return <TablaEstadosResultados ventas={ventas} />;
                case 2: return <TablaEstadosResultados ingresos={ingresos} />;
                case 3: return <TablaEstadosResultados compras={compras} />;
                case 4: return <TablaEstadosResultados egresos={egresos} />;
                default:
                    return ''
            }
        }

        const headers = (element) => {
            switch (element.tipo) {
                case 1: return <HeadersTotales title={'Total ventas'} sumaTotal={this.sumaTotalVentas()} />
                case 2: return <HeadersTotales title={'Total ingresos'} sumaTotal={this.sumaTotalIngresos()} />;
                case 3: return <><HeadersTotales title={'Total costos de servicio'} sumaTotal={this.sumaTotalCostos()} /><HeadersTotales title={'Utilidad bruta'} sumaTotal2={this.sumaUtilidadBruta()} /></>;
                case 4: return <><HeadersTotales title={'Total de gastos operativos'} sumaTotal={this.sumaTotalGastos()} /><HeadersTotales title={'Resultado operativo'} sumaTotal2={this.resultOperativo()} /></>;
                default:
                    return ''
            }
        }
        return (
            <div className="accordion accordion-solid accordion-svg-toggle">
                {
                    accordion.map((element, key) => {
                        return (
                            <div className="card" key={key} style={{width:"450px"}}>
                                <div className="card-header" >
                                    <div className={(element.isActive) ? 'card-title text-primary collapsed' : 'card-title text-dark-50'} onClick={() => { this.openAccordion(key) }}>
                                        <div className="card-label">
                                            <i className={(element.isActive) ? element.icono + ' text-primary' : element.icono + ' text-dark-50'}>
                                            </i> {element.nombre}
                                        </div>
                                        <span className="svg-icon ">
                                            <SVG src={toAbsoluteUrl('/images/svg/Angle-double-right.svg')} />
                                        </span>
                                    </div>
                                </div>
                                <div className={(element.isActive) ? 'collapse show' : 'collapse'} >
                                    <div className="card-body">
                                        <div>{table(element)}</div>
                                    </div>
                                </div>
                                {headers(element)}
                            </div>
                        )
                    }
                    )
                }

            </div>
        )
    }
}

export default AccordionEstadosResultados