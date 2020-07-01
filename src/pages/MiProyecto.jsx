import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CP_URL, GOLD, PROYECTOS_COLUMNS, URL_ASSETS } from '../constants'

import { forbiddenAccessAlert, errorAlert, waitAlert } from '../functions/alert'
import { SelectSearch } from '../components/form-components'
import { setOptions } from '../functions/setters'
import { Card, Accordion } from 'react-bootstrap'
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';
import { Subtitle, P } from '../components/texts'
import { Button } from '../components/form-components'
import { faList, faPlus, faFolderOpen, faFilePdf } from '@fortawesome/free-solid-svg-icons'
import ItemSlider from '../components/singles/ItemSlider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CustomToggle({ children, eventKey, icon = faPlus, iconColor = 'transparent' }) {

    let variable = false
    
    const handleClick = useAccordionToggle(eventKey, (e) => {
        if(variable){
            variable = false
        }else{
            variable = true
        }
    },);

    return (
        <div className="">
            <div className="d-flex justify-content-between">
                <div>
                    {children}
                </div>
                <Button name = { eventKey } className = " small-button " color = { iconColor } icon = { icon } text = '' onClick = { handleClick } />
            </div>
        </div>
        
    );
}
class MiProyecto extends Component{
    
    state = {
        proyecto: '',
        data:{
            proyectos: []
        },
        form:{
            proyecto: ''
        },
        options:{
            proyectos: []
        },
        adjuntos:[
            {
                name: 'Inicio y planeación',
                value: 'inicio_y_planeacion',
                adjuntos:[
                    {
                        name: 'Fotografías levantamiento',
                        value: 'fotografias_levantamiento'
                    },
                    {
                        name: 'Manuales de adaptación',
                        value: 'manuales_de_adaptacion'
                    },
                    {
                        name: 'Minutas',
                        value: 'minutas'
                    },
                    {
                        name: 'Oficios',
                        value: 'oficios'
                    },
                    {
                        name: 'Planos entregados por cliente',
                        value: 'planos_entregados_por_cliente'
                    },
                    {
                        name: 'Propuestas arquitectónicas preliminares',
                        value: 'propuestas_arquitectonicas_preliminares'
                    },
                    {
                        name: 'Referencias del diseño del proyecto',
                        value: 'referencias_del_diseño_del_proyecto'
                    },
                    {
                        name: 'Renders',
                        value: 'renders'
                    },
                    {
                        name: 'Sketch Up',
                        value: 'sketch_up'
                    },
                    {
                        name: 'Presupuestos preliminares',
                        value: 'presupuestos_preliminares'
                    },
                    {
                        name: 'Carta oferta',
                        value: 'carta_oferta'
                    }
                ]
            },
            {
                name: 'Ejecución de obra',
                value: 'ejecucion_de_obra',
                adjuntos:[
                    {
                        name: 'Datos de cliente',
                        value: 'datos_de_cliente'
                    },
                    {
                        name: 'Contrato cliente',
                        value: 'contrato_cliente'
                    },
                    {
                        name: 'Contrato proveedores y contratistas',
                        value: 'contrato_proveedores_y_contratistas'
                    },
                    {
                        name: 'Firmas de aprobación',
                        value: 'firmas_de_aprobacion'
                    },
                    {
                        name: 'Reporte fotográfico de avance de obra',
                        value: 'reporte_fotografico_de_avance_de_obra'
                    },
                    {
                        name: 'Reporte de materiales',
                        value: 'reporte_de_materiales'
                    },
                    {
                        name: 'Reporte de proyecto vs ejecutado',
                        value: 'reporte_de_proyecto_vs_ejecutado'
                    },
                    {
                        name: 'Minutas de obra',
                        value: 'minutas_de_obra'
                    },
                    {
                        name: 'Presupuesto aprobado por cliente',
                        value: 'presupuesto_aprobado_por_cliente'
                    },
                    {
                        name: 'Programa de obra',
                        value: 'programa_de_obra'
                    },
                    {
                        name: 'Planos durante obra',
                        value: 'planos_durante_obra'
                    },
                    {
                        name: 'Sketch Up aprobados',
                        value: 'sketch_up_aprobados'
                    },
                    {
                        name: 'Renders aprobados',
                        value: 'renders_aprobados'
                    },
                    {
                        name: 'Estados de cuenta',
                        value: 'estados_de_cuenta'
                    },
                    {
                        name: 'Fianzas y seguros',
                        value: 'fianzas_y_seguros'
                    },
                    {
                        name: 'Permisos de obra ante dependencias',
                        value: 'permisos_de_obra_ante_dependencias'
                    }
                ]
            },
            {
                name: 'Entrega',
                value: 'entrega',
                adjuntos:[
                    {
                        name: 'Catálogo de conceptos ASBUILT',
                        value: 'catalogo_de_conceptos_asbuilt'
                    },
                    {
                        name: 'Consignas de matenimiento',
                        value: 'consignas_de_matenimiento'
                    },
                    {
                        name: 'Planos aprobados',
                        value: 'planos_aprobados'
                    },
                    {
                        name: 'Garantía de los equipos',
                        value: 'garantia_de_los_equipos'
                    },
                    {
                        name: 'Garantía de vicios ocultos',
                        value: 'garantia_de_vicios_ocultos'
                    },
                    {
                        name: 'Memorias de cálculo',
                        value: 'memorias_de_calculo'
                    },
                    {
                        name: 'Memorias descriptivas',
                        value: 'memorias_descriptivas'
                    },
                    {
                        name: 'Fichas técnicas',
                        value: 'fichas_tecnicas'
                    },
                    {
                        name: 'Pruebas de instalaciones',
                        value: 'pruebas_de_instalaciones'
                    },
                    {
                        name: 'Fotografías fin de obra',
                        value: 'fotografias_fin_de_obra'
                    },
                    {
                        name: 'Acta de entrega',
                        value: 'acta_de_entrega'
                    },
                    {
                        name: 'Carpeta de entrega ZIP',
                        value: 'carpeta_de_entrega_zip'
                    },
                ]
            },
            {
                name: 'Mantenimiento',
                value: 'mantenimiento',
                adjuntos:[
                    {
                        name: 'Mantenimiento preventivo',
                        value: 'mantenimiento_preventivo'
                    },
                    {
                        name: 'Mantenimiento correctivo',
                        value: 'mantenimiento_correctivo'
                    },
                ]
            }
        ]
    }

    componentDidMount(){
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const proyecto = permisos.find(function(element, index) {
            return element.modulo.url === pathname
        });
        if(!proyecto)
            history.push('/')
        this.getMiProyectoAxios()
    }

    updateProyecto = value => {
        const { data, form } = this.state
        form.proyecto = value
        data.proyectos.map( (proyecto) => {
            if(proyecto.id.toString() === value.toString()){
                this.setState({
                    ... this.state,
                    form,
                    proyecto: proyecto
                })
            }
        } )
        console.log(this.state.proyecto)
    }

    async getMiProyectoAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos } = response.data
                const { data, options } = this.state
                let { proyecto } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                data.proyectos = proyectos
                if(proyectos.length === 1){
                    proyecto = proyectos[0]
                }
                this.setState({
                    ... this.state,
                    data,
                    options,
                    proyecto
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getProyectoAdjuntosZip(array) {
        const { access_token } = this.props.authUser
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close()
                const url =  URL_ASSETS+'/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre+'.zip'); //or any other extension
                document.body.appendChild(link);
                link.click();
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render(){
        const { options, proyecto, form, adjuntos } = this.state
        return(
            <Layout { ...this.props}>
                <div className="form-group row form-group-marginless">
                    <div className="col-md-3">
                        <SelectSearch 
                            formeditado = { 0 }
                            options = { options.proyectos }
                            name = "Seleccione un proyecto"
                            name = "proyecto"
                            value = { form.proyecto }
                            onChange = { this.updateProyecto }
                            /> 
                    </div>
                </div>
                {
                    proyecto ? 
                        <Card>
                            <Card.Header>
                                <Subtitle className="text-center">                                    
                                    {
                                        proyecto.nombre
                                    }
                                </Subtitle>
                            </Card.Header>
                            <Card.Body>
                                <Accordion>
                                    <div className="row mx-0">
                                        {
                                            adjuntos.map( (grupo, key) => {
                                                let aux = false
                                                grupo.adjuntos.forEach(element => {
                                                    if(proyecto[element.value].length)
                                                        aux = true
                                                });
                                                if(aux)
                                                return(
                                                    <div className="col-md-6" key = {key}>
                                                        <div className="px-3 py-2">
                                                            <CustomToggle icon = { faList } iconColor = 'gold' iconColor = 'transparent' eventKey={grupo.value} >
                                                                <strong>
                                                                    <p className="label-form mb-0">
                                                                        {grupo.name}
                                                                    </p>
                                                                </strong>
                                                            </CustomToggle>
                                                            <Accordion.Collapse eventKey = { grupo.value }>
                                                                <div>
                                                                    <div className="row mx-0 pl-2 py-2">
                                                                        <Accordion className="w-100">
                                                                            {
                                                                                grupo.adjuntos.map( (adjunto, key) => {
                                                                                    if(proyecto[adjunto.value].length)
                                                                                    return(
                                                                                        <div key = {key}>
                                                                                            <div className="px-3 pt-2">
                                                                                                <CustomToggle icon = { faFolderOpen } eventKey = { adjunto.value } >
                                                                                                    <strong>
                                                                                                        <p className="label-form">
                                                                                                            {adjunto.name}
                                                                                                        </p>
                                                                                                    </strong>
                                                                                                </CustomToggle>
                                                                                                
                                                                                            </div>
                                                                                            <Accordion.Collapse eventKey={adjunto.value}>
                                                                                                <div>
                                                                                                    {
                                                                                                        proyecto ? 
                                                                                                            proyecto[adjunto.value].length ?
                                                                                                                <div className="mt-2 d-flex justify-content-center">
                                                                                                                    <span className = 'btn btn-hover btn-text-success' onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.value]) }}>
                                                                                                                        <i className="fas fa-file-archive"></i> Descargar ZIP
                                                                                                                    </span>
                                                                                                                </div>
                                                                                                            : ''
                                                                                                        : ''
                                                                                                    }   
                                                                                                    {
                                                                                                        proyecto ? 
                                                                                                            <ItemSlider items = { proyecto[adjunto.value] } item = {adjunto.value} />
                                                                                                        : ''
                                                                                                    }
                                                                                                </div>
                                                                                            </Accordion.Collapse>
                                                                                        </div>
                                                                                    )
                                                                                } )
                                                                            }
                                                                        </Accordion>            
                                                                    </div>
                                                                </div>                                            
                                                            </Accordion.Collapse>
                                                        </div>
                                                    </div>
                                                )
                                            } )
                                        }
                                    </div>
                                </Accordion>
                                {
                                    proyecto.avances.length ?
                                        <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="my-2">
                                                <p>
                                                    Avances por semana.
                                                </p>
                                            </div>
                                            <div className="row mx-0">
                                                {
                                                    proyecto.avances.map( (avance, key) => {
                                                        return(
                                                            <div className="col-md-2 text-center">
                                                                <P>
                                                                    {
                                                                        avance.semana
                                                                    }
                                                                </P>
                                                                <a href = { avance.pdf } target = '_blank'>
                                                                    <FontAwesomeIcon icon = { faFilePdf } />
                                                                </a>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                            
                                        </>
                                    : ''
                                }
                                

                            </Card.Body>
                        </Card>
                    : ''
                }
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(MiProyecto);