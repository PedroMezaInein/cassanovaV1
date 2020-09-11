import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import TablaEstadosResultados from '../../forms/reportes/TablaEstadosResultados'
class AccordionEstadosResultados extends Component {
    
    state = { 
        accordion:[
            {
                nombre:'VENTAS',
                icono:'flaticon2-chart',
                tipo:1,
                isActive: false,
                total_header:'Total ventas',
                total_cantidad:300.00
            },
            {
                nombre:'Ingresos',
                icono:'flaticon2-chart',
                tipo:2,
                isActive: false,
                total_header:'Total ingresos',
                total_cantidad:800.00
            },
            {
                nombre:'COSTOS DE SERVICIO',
                icono:'flaticon-coins',
                tipo:3,
                isActive: false,
                total_header:'Total costos de servicio',
                utilidad:'Utilidad bruta',
                total_cantidad:1000.00,
                total_cantidad_utilidad:3000.00
            },
            {
                nombre:'GASTOS OPERATIVOS',
                icono:'flaticon2-chart',
                tipo:4,
                isActive: false,
                total_header:'Total de gastos operativos',
                resultado: 'Resultado operativo',
                total_cantidad:3100.00,
                total_cantidad_resultado:4000.00
            }
        ]
    };

    
    openAccordion = (indiceClick) =>{ 
        let {accordion} = this.state
        accordion.map((element,key)=>{
            if(indiceClick==key)
            {
                element.isActive = element.isActive ? false : true 
            }
            else
            {
                element.isActive=false 
            }
        }) 
        this.setState({ 
            accordion: accordion
        });
    } 
    
    render() {
        const {accordion} = this.state
        const {ventas, ingresos, compras, egresos} = this.props
        const project = (element) => {
            
            switch(element.tipo) {                                                         
            case 1: return <TablaEstadosResultados
                                ventas = { ventas }
                            />;
            case 2: return <TablaEstadosResultados
                            />;
            case 3: return <TablaEstadosResultados
                            />;
            case 4: return <TablaEstadosResultados
                            />;
            default: 
                return <div>No soy ninguno</div>
            }
        }   
        return (
            <>
                <div id="accordionContenedor" className="accordion accordion-solid accordion-svg-toggle">
                {
                        accordion.map( (element,key) =>
                            {
                                return(
                                    <>
                                    <div className="card" key={key}>
                                        <div className="card-header" >
                                            <div className={(element.isActive) ? 'card-title text-primary collapsed' : 'card-title text-dark-50'} onClick = { () => { this.openAccordion(key) } }>
                                                <div className="card-label">
                                                    <i className= {(element.isActive) ?element.icono+' text-primary' : element.icono+' text-dark-50'}>
                                                    </i> {element.nombre}
                                                </div>
                                                <span className="svg-icon ">
                                                    <SVG src={toAbsoluteUrl('/images/svg/Angle-double-right.svg')} />
                                                </span>
                                            </div>
                                        </div>
                                        <div className={(element.isActive) ? 'collapse show' : 'collapse'} >
                                            <div className="card-body">
                                                <div>{project(element)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end">
                                        <div className="d-flex flex-column mt-2">
                                            <div className="d-flex align-items-center justify-content-between flex-grow-1">
                                                <div className="mr-2 mt-2">
                                                    <h6 className="font-weight-bolder">{element.total_header}</h6>
                                                </div>
                                                <div className="font-weight-boldest font-size-h4 text-primary ml-3">$ {element.total_cantidad}</div>
                                            </div>
                                        </div>
                                    </div>
                                    {
                                        element.utilidad? 
                                        <div className="d-flex justify-content-end">
                                            <div className="d-flex flex-column mt-2">
                                                <div className="d-flex align-items-center justify-content-between flex-grow-1">
                                                    <div className="mr-2 mt-2">
                                                        <h6 className="font-weight-bolder">{element.utilidad}</h6>
                                                    </div>
                                                    <div className="font-weight-boldest font-size-h4 text-info ml-3">$ {element.total_cantidad_utilidad}</div>
                                                </div>
                                            </div>
                                        </div>
                                        :''
                                    }
                                    {
                                        element.resultado? 
                                        <div className="d-flex justify-content-end">
                                            <div className="d-flex flex-column mt-2">
                                                <div className="d-flex align-items-center justify-content-between flex-grow-1">
                                                    <div className="mr-2 mt-2">
                                                        <h6 className="font-weight-bolder">{element.resultado}</h6>
                                                    </div>
                                                    <div className="font-weight-boldest font-size-h4 text-info ml-3">$ {element.total_cantidad_resultado}</div>
                                                </div>
                                            </div>
                                        </div>
                                        :''
                                    }
                                    </>
                                )                           
                            }
                        )
                    }
                    
                </div>
            </>
        )
    }
}

export default AccordionEstadosResultados