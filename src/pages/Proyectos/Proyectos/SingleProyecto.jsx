import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { setSingleHeader } from '../../../functions/routers'
import Swal from 'sweetalert2'
import { Card, Tab } from 'react-bootstrap'
import { printDates, printDireccion } from '../../../functions/printers'
import { setMoneyText } from '../../../functions/setters'
import { isMobile } from "react-device-detect"

class SingleProyecto extends Component{

    state = {
        proyecto: null
    }

    componentDidMount = () => {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const { match: { params: { id } } } = this.props
        const modulo = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/single/' + id
        })
        if (!modulo)
            history.push('/')
        if(id)
            this.getOneProyecto(id)
        else
            history.push({ pathname: '/proyectos/proyectos' });
    }

    /* -------------------------------------------------------------------------- */
    /*                         ANCHOR ASYNC CALL FUNCTION                         */
    /* -------------------------------------------------------------------------- */
    getOneProyecto = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v3/proyectos/proyectos/${id}`, { headers: setSingleHeader(access_token)}).then(
            (response) => {
                const { proyecto } = response.data
                Swal.close()
                this.setState({...this.state, proyecto})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
        })
    }

    getEmpresaImage = () => {
        const { proyecto } = this.state
        if(proyecto)
            if(proyecto.empresa)
                return proyecto.empresa.logoUnico
    }

    render(){
        const { proyecto } = this.state
        return(
            <Layout active = 'proyectos' {...this.props}>
                <Tab.Container>
                    {
                        proyecto ?
                            <Card className = 'card card-custom gutter-b'>
                                <Card.Body className = 'pb-0 px-0 px-md-4'>
                                    <div className="text-center">
                                        <div className = 'font-weight-bold font-size-h1 mb-3'>
                                            { proyecto.nombre }
                                        </div>
                                    </div>
                                    <div className="row mx-0">
                                        <div className="col-md-6">
                                            <table className={`table table-vertical-center mx-auto table-borderless table-responsive tcalendar_p_info ${!isMobile ? 'w-80' : ''}`}>
                                                <tbody>
                                                    <tr className="border-top-2px">
                                                        <td className="text-center w-5">
                                                            <i className="las la-user-alt icon-2x text-dark-50"></i>
                                                        </td>
                                                        <td className="w-33 font-weight-bolder text-dark-50">CONTACTO</td>
                                                        <td className="font-weight-light">
                                                            <div>
                                                                <span>{proyecto.contacto}</span>
                                                            </div>
                                                            {
                                                                proyecto.numero_contacto ? 
                                                                    <div>
                                                                        <a href = {`tel:+${proyecto.numero_contacto}`}>
                                                                            {proyecto.numero_contacto}
                                                                        </a>
                                                                    </div>
                                                                : ''
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td> <i className="las la-envelope icon-2x text-dark-50" /> </td>
                                                        <td className="font-weight-bolder text-dark-50">Correos de contacto</td>
                                                        <td className="font-weight-light">
                                                            {
                                                                proyecto.contactos.map((contacto, key) => {
                                                                    return ( <div key={key}>• {contacto.correo}</div> )
                                                                })
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="las la-user-friends icon-2x text-dark-50"/> </td>
                                                        <td className="font-weight-bolder text-dark-50">Clientes</td>
                                                        <td className="font-weight-light text-justify">
                                                            {
                                                                proyecto.clientes.map((cliente, key) => {
                                                                    return ( <div key={key}>• {cliente.empresa}</div> )
                                                                })
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="las la-calendar icon-2x text-dark-50"/> </td>
                                                        <td className="font-weight-bolder text-dark-50">PERIODO</td>
                                                        <td className="font-weight-light"> {printDates(proyecto.fecha_inicio, proyecto.fecha_fin)} </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="fas fa-dollar-sign icon-2x text-dark-50"/> </td>
                                                        <td className="font-weight-bolder text-dark-50">Costo con IVA</td>
                                                        <td className="font-weight-light"> <span> { setMoneyText(proyecto.costo) } </span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center">
                                                            <i className = {`fas fa-file-invoice-dollar icon-2x text-${ proyecto.costo - proyecto.totalVentas > 0 ? 'danger' : 'dark-50'}`} />
                                                        </td>
                                                        <td className="font-weight-bolder text-dark-50"> Total pagado </td>
                                                        <td className="font-weight-light"> <span> { setMoneyText(proyecto.totalVentas) } </span> </td>
                                                    </tr>
                                                    {
                                                        isMobile ?
                                                            <>
                                                                <tr>
                                                                    <td className="text-center"> <i className="las la-toolbox icon-2x text-dark-50"/> </td>
                                                                    <td className="font-weight-bolder text-dark-50">TIPO</td>
                                                                    <td className="font-weight-light"> <span>{proyecto.tipo_proyecto.tipo}</span> </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center"> <i className="las la-ruler icon-2x text-dark-50" /> </td>
                                                                    <td className="font-weight-bolder text-dark-50">M²</td>
                                                                    <td className="font-weight-light"> <span>{proyecto.m2 ? proyecto.m2 : 0} m²</span> </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center"> <i className="las la-tools icon-2x text-dark-50" /> </td>
                                                                    <td className="font-weight-bolder text-dark-50">FASE</td>
                                                                    <td className="font-weight-light">
                                                                        { proyecto.fase1 ? <div>• Fase 1</div> : '' }
                                                                        { proyecto.fase2 ? <div>• Fase 2</div> : '' }
                                                                        { proyecto.fase3 ? <div>• Fase 3</div> : '' }
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center"> <i className="las la-map-pin icon-2x text-dark-50" /> </td>
                                                                    <td className="font-weight-bolder text-dark-50">DIRECCIÓN</td>
                                                                    <td className="font-weight-light"> { printDireccion(proyecto) } </td>
                                                                </tr>
                                                                <tr>
                                                                    <td className="text-center"> <i className="las la-file-alt icon-2x text-dark-50"/> </td>
                                                                    <td className="font-weight-bolder text-dark-50">DESCRIPCIÓN</td>
                                                                    <td className="font-weight-light text-justify">
                                                                        <span>{proyecto.descripcion !== 'null' && proyecto.descripcion ? proyecto.descripcion : 'Sin especificar'}</span>
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        : ''
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className = {`col-md-6 ${isMobile ? 'd-none' : ''}`}>
                                            <table className={`table table-vertical-center mx-auto table-borderless table-responsive tcalendar_p_info ${!isMobile ? 'w-80' : ''}`}>
                                                <tbody>
                                                    <tr className="border-top-2px">
                                                        <td className="text-center"> <i className="las la-toolbox icon-2x text-dark-50"/> </td>
                                                        <td className="font-weight-bolder text-dark-50">TIPO</td>
                                                        <td className="font-weight-light"> <span>{proyecto.tipo_proyecto.tipo}</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="las la-ruler icon-2x text-dark-50" /> </td>
                                                        <td className="font-weight-bolder text-dark-50">M²</td>
                                                        <td className="font-weight-light"> <span>{proyecto.m2 ? proyecto.m2 : 0} m²</span> </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="las la-tools icon-2x text-dark-50" /> </td>
                                                        <td className="font-weight-bolder text-dark-50">FASE</td>
                                                        <td className="font-weight-light">
                                                            { proyecto.fase1 ? <div>• Fase 1</div> : '' }
                                                            { proyecto.fase2 ? <div>• Fase 2</div> : '' }
                                                            { proyecto.fase3 ? <div>• Fase 3</div> : '' }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="las la-map-pin icon-2x text-dark-50" /> </td>
                                                        <td className="font-weight-bolder text-dark-50">DIRECCIÓN</td>
                                                        <td className="font-weight-light"> { printDireccion(proyecto) } </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="text-center"> <i className="las la-file-alt icon-2x text-dark-50"/> </td>
                                                        <td className="font-weight-bolder text-dark-50">DESCRIPCIÓN</td>
                                                        <td className="font-weight-light text-justify">
                                                            <span>{proyecto.descripcion !== 'null' && proyecto.descripcion ? proyecto.descripcion : 'Sin especificar'}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        : <></>
                    }
                    
                </Tab.Container>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(SingleProyecto);