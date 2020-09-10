import React, { Component } from 'react'

class AccordionEstadosResultados extends Component {
    
    state = { 
        accordion:[
            {
                nombre:'VENTAS',
                icono:'flaticon2-chart',
                collapsed: false,
                aria_expanded:false,
                tipo:1,
                isActive: false
            },
            {
                nombre:'COSTOS DE SERVICIO',
                icono:'flaticon-coins',
                collapsed: false,
                aria_expanded:false,
                tipo:2,
                isActive: false
            },
            {
                nombre:'GASTOS OPERATIVOS',
                icono:'flaticon2-chart',
                collapsed: false,
                aria_expanded:false,
                tipo:3,
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
            case 1: return 'soy 1';
            case 2: return 'soy 2';
            case 3: return 'soy 3';
            default: 
                return <h1>No soy ninguno</h1>
            }
        }   
        return (
            <>
                <div id="accordionContenedor" className="accordion accordion-solid accordion-toggle-plus">
                {
                        accordion.map( (element,key) =>
                            {
                                return(
                                    <div className="card" key={key}>
                                        <div className="card-header" >
                                            <div className={(element.isActive) ? 'card-title text-primary collapsed' : 'card-title text-dark'} data-toggle="collapse" onClick = { () => { this.openAccordion(key) } }>
                                                <i className= {(element.isActive) ?element.icono+' text-primary' : element.icono+' text-dark'}  ></i> {element.nombre}
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