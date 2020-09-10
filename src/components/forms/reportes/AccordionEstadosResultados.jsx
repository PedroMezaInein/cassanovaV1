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
                isActive: false
            },
            {
                nombre:'Ingresos',
                icono:'flaticon2-chart',
                tipo:2,
                isActive: false
            },
            {
                nombre:'COSTOS DE SERVICIO',
                icono:'flaticon-coins',
                tipo:3,
                isActive: false
            },
            {
                nombre:'GASTOS OPERATIVOS',
                icono:'flaticon2-chart',
                tipo:4,
                isActive: false
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
        
        const project = (element) => {
            
            switch(element.tipo) {                                                         
            case 1: return <TablaEstadosResultados/>;
            case 2: return <TablaEstadosResultados/>;
            case 3: return <TablaEstadosResultados/>;
            case 4: return <TablaEstadosResultados/>;
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
                                    <div className="card" key={key}>
                                        <div className="card-header" >
                                            <div className={(element.isActive) ? 'card-title text-primary collapsed' : 'card-title text-dark-50'} onClick = { () => { this.openAccordion(key) } }>
                                                <div class="card-label">
                                                    <i className= {(element.isActive) ?element.icono+' text-primary' : element.icono+' text-dark-50'}>
                                                    </i> {element.nombre}
                                                </div>
                                                <span class="svg-icon ">
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