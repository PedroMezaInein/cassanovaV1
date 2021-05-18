import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import { connect } from 'react-redux'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert, customInputAlert } from '../../../functions/alert'
import axios from 'axios'
import { URL_DEV, ACCESOS_COLUMNS, TEL } from '../../../constants'
import Swal from 'sweetalert2';
import $ from "jquery";
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { setTextTableReactDom, setClipboardArrayTableReactDom } from '../../../functions/setters'
import { ModalDelete } from '../../../components/singles'
import { printSwalHeader } from '../../../functions/printers'
import { InputPasswordGray, InputGray, InputPhoneGray } from '../../../components/form-components'
import { Update } from '../../../components/Lottie'
class Accesos extends Component {

    state = {
        modalDelete: false,
        accesos: [],
        acceso:'',
        form: {
            plataforma: '',
            url: '',
            usuario: '',
            responsable: '',
            contraseña: '',
            usuarios: [],
            correo: '',
            numero: '',
            empresas: [],
            descripcion: '',
            adjuntos: {
                adjuntos: {
                    files: [],
                    value: '',
                    placeholder: 'Adjuntos'
                }
            },
            departamentos: []
        },
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const accessos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!accessos)
            history.push('/')
        this.getAccesosAxios()
    }

    getAccesosAxios = async () => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'accesos', { headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { accesos } = response.data
                Swal.close();
                this.setState({
                    ...this.state,
                    accesos: accesos
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async deleteAccesoAxios () {
        const { access_token } = this.props.authUser
        const { acceso } = this.state
        await axios.delete(URL_DEV + 'accesos/' + acceso.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getAccesoTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La acceso fue eliminado con éxito.')
                this.setState({
                    ...this.state,
                    modalDelete: false
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    changePageEdit = acceso => {
        const { history } = this.props
        history.push({
            pathname: '/usuarios/accesos/edit',
            state: { acceso: acceso }
        });
    }

    setHiddenPassword = pwd => {
        let aux = ''
        for (let i = 0; i < pwd.length; i++)
            aux += '*'
        return aux
    }
    substrCadena = cadena => {
        let pantalla = $(window).width()
        let aux = ''
        if (pantalla < 1400) {
            if (cadena.length > 15) {
                aux = cadena.substr(0, 15) + "..."
                return(
                    <OverlayTrigger overlay={<Tooltip>{cadena}</Tooltip>}>
                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                    </OverlayTrigger>
                )
            } else {
                aux = cadena
                return(
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                )
            }
        } else {
            if (cadena.length > 20) {
                aux = cadena.substr(0, 20) + "..."
                return(
                    <OverlayTrigger overlay={<Tooltip>{cadena}</Tooltip>}>
                        <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                    </OverlayTrigger>
                )
            } else {
                aux = cadena
                return(
                    <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{aux}</span>
                )
            }
        }
    }

    setUrl = ( url ) => {
        if(!url.includes('http'))
            return 'https://' + url
        return url
    }

    setConceptos = accesos => {
        let aux = []
        accesos.map((acceso) => {
            aux.push(
                {
                    actions: this.setActions(acceso),
                    plataforma: setTextTableReactDom(acceso.descripcion, this.doubleClick, acceso, 'plataforma', 'text-justify'),
                    usuario: setClipboardArrayTableReactDom(
                        [
                            { 'name': 'USUARIO', 'text': acceso.partida_field ? acceso.partida_field : '-' },
                            { 'name': 'CONTRASEÑA', 'text': acceso.partida_field ? acceso.partida_field : '-' }
                        ],'186px', this.doubleClick, acceso, 'usuario_contraseña'
                    ),
                    correo: setClipboardArrayTableReactDom(
                        [
                            { 'name': 'CORREO', 'text': acceso.partida_field ? acceso.partida_field : '-' },
                            { 'name': 'TELÉFONO', 'text': acceso.partida_field ? acceso.partida_field : '-' }
                        ],'217px', this.doubleClick, acceso, 'correo_telefono'
                    ),
                    // empresa: acceso.departamentos.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(acceso, acceso.departamentos, 'empresa_acceso', this.deleteElementAxios),
                    // responsables: acceso.departamentos.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(acceso, acceso.departamentos, 'responsables_acceso', this.deleteElementAxios),
                    // departamento: acceso.departamentos.length === 0 ? setTextTableCenter("Sin definir") : setTagLabelReactDom(acceso, acceso.departamentos, 'departamento_acceso', this.deleteElementAxios),
                    descripcion: setTextTableReactDom(acceso.descripcion, this.doubleClick, acceso, 'descripcion', 'text-justify'),
                    id: acceso.id
                }
            )
            return false
        })
        return aux
    }
    deleteElementAxios = async(proyecto, element, tipo) => {
        const { access_token } = this.props.authUser
        waitAlert()
        await axios.delete(`${URL_DEV}v2/proyectos/proyectos/${proyecto.id}/${tipo}/${element.id}`, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { key } = this.state
                this.getProyectoAxios(key)
                doneAlert(response.data.message !== undefined ? response.data.message : 'El acceso fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
            case 'usuario_contraseña':
                form.usuario = data.usuario
                form.contraseña = data.contraseña
                break;
            case 'correo_telefono':
                form.correo = data.correo
                form.numero = data.numero
                break;
            default:
                form[tipo] = data[tipo]
                break
        }
        this.setState({form, options})
        customInputAlert(
            <div>
                <h2 className = 'swal2-title mb-4 mt-2'> { printSwalHeader(tipo) } </h2>
                {
                    (tipo === 'plataforma') ?
                        <InputGray withtaglabel = { 0 }  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true } />
                    :<></>
                }
                {
                    tipo === 'usuario_contraseña' &&
                    <>
                        <InputGray withformgroup = { 1 } withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="USUARIO"
                            requirevalidation = { 0 }  value = { form.usuario} name = { 'usuario' } letterCase = { false } iconclass={"fas fa-user"}
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'usuario')} } swal = { true } />
                        
                        <InputPasswordGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="CONTRASEÑA"
                            requirevalidation = { 0 } value = { form.contraseña } name = "contraseña" letterCase = { false }
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'correo')} } swal = { true }  />
                    </>
                }
                {
                    tipo === 'correo_telefono' &&
                    <>
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 1 } withicon = { 1 } placeholder="CORREO ELECTRÓNICO"
                            requirevalidation = { 0 }  value = { form.correo} name = { 'correo' } letterCase = { false } iconclass={"fas fa-envelope"}
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'correo')} } swal = { true } />
                        
                        <InputPhoneGray withicon={1} iconclass="fas fa-mobile-alt" name="telefono" value={form.telefono} 
                            onChange = { (e) => { this.onChangeSwal(e.target.value, 'telefono')} }
                            patterns={TEL} thousandseparator={false} prefix=''  swal = { true } 
                        />
                    </>
                }
                {
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChangeSwal(e.target.value, tipo)} } swal = { true }/>
                }
                </div>,
            <Update />,
            () => { this.patchAcceso(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }
    patchAcceso = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = form[tipo]
        waitAlert()
        await axios.put(`${URL_DEV}v2/usuarios/accesos/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                doneAlert(response.data.message !== undefined ? response.data.message : 'El acceso fue editada con éxito')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'adjuntos':
                    form[element] = {
                        adjuntos: {
                            files: [],
                            value: '',
                            placeholder: 'Adjuntos'
                        }
                    }
                    break;
                default:
                    form[element] = ''
                    break;
            }
            return false
        })
        return form;
    }
    setActions = () => {
        let aux = []
        aux.push(
            {
                text: 'Editar',
                btnclass: 'success',
                iconclass: 'flaticon2-pen',
                action: 'edit',
                tooltip: { id: 'edit', text: 'Editar' }
            },
            {
                text: 'Eliminar',
                btnclass: 'danger',
                iconclass: 'flaticon2-rubbish-bin',
                action: 'delete',
                tooltip: { id: 'delete', text: 'Eliminar', type: 'error' }
            }
        )
        return aux
    }
    openModalDelete = acceso => {
        this.setState({
            ...this.state,
            modalDelete: true,
            acceso: acceso
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            acceso: '',
        })
    }
    async getAccesoTable() {
        $('#kt_datatable_acceso').DataTable().ajax.reload();
    }
    render() {
        const { accesos, modalDelete } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <NewTableServerRender 
                    columns = { ACCESOS_COLUMNS }
                    title = 'Accesos'
                    subtitle = 'Listado de accesos'
                    mostrar_boton = { true }
                    abrir_modal = { false }
                    url = '/usuarios/accesos/add'
                    mostrar_acciones = { true }
                    actions = { { 
                        'edit': { function: this.changePageEdit },
                        'delete': { function: this.openModalDelete }
                    } }
                    exportar_boton = { false }
                    accessToken = { this.props.authUser.access_token }
                    setter = { this.setConceptos }
                    urlRender={`${URL_DEV}v2/presupuesto/conceptos`}
                    idTable = 'kt_datatable_accesos'
                    cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader'
                    cardBody = 'cardBody'
                />
                <ModalDelete
                    title="¿Estás seguro que deseas eliminar el acceso?"
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); this.deleteAccesoAxios() }}
                />
                {/* <Card className="card-custom card-stretch gutter-b py-2">
                    <Card.Header className="align-items-center border-0 pt-3">
                        <h3 className="card-title align-items-start flex-column">
                            <span className="font-weight-bolder text-dark">ACCESOS</span>
                        </h3>
                        <div className="card-toolbar">
                            <div>
                                <a href="/usuarios/accesos/add" className="btn btn-light-success btn-sm mr-2">
                                    <i className="flaticon2-lock pr-0 mr-2"></i>NUEVO ACCESO
                                </a>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="tab-content">
                            <div className="table-responsive-lg">
                                <table className="table table-head-custom table-vertical-center">
                                    <thead className="bg-gray-100">
                                        <tr className="text-left">
                                            <th className="min-width-100px">Plataforma</th>
                                            <th className="min-width-100px">Usuario y contraseña</th>
                                            <th className="min-width-100px">Correo y teléfono de alta</th>
                                            <th className="min-width-100px">Responsables</th>
                                            <th className="min-width-100px">Departamentos</th>
                                            <th className="min-width-100px">Empresas</th>
                                            <th className="min-width-100px text-center">Descripción</th>
                                            <th ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            accesos.map((acceso, key) => {
                                                return (
                                                    <tr key={key}>
                                                        <td>
                                                            <a href = { this.setUrl(acceso.url) } target = "_blank" rel="noopener noreferrer"
                                                                className="font-weight-bolder text-dark text-hover-primary font-size-lg">
                                                                {acceso.plataforma}
                                                            </a>
                                                        </td>
                                                        <td>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.usuario) }}>
                                                            {
                                                                acceso.correo ?
                                                                    <span>{this.substrCadena(acceso.usuario)}</span>
                                                                : <div className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary">-</div>
                                                            }
                                                            </div>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.contraseña) }}>
                                                                <OverlayTrigger overlay={<Tooltip>{acceso.contraseña}</Tooltip>}>
                                                                    <span className="text-muted font-weight-bold text-transform-none">{this.setHiddenPassword(acceso.contraseña)}</span>
                                                                </OverlayTrigger>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.correo) }}>
                                                                {
                                                                    acceso.correo ?
                                                                        <OverlayTrigger overlay={<Tooltip>{acceso.correo}</Tooltip>}>
                                                                            <span className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary text-transform-none">{this.substrCadena(acceso.correo)}</span>
                                                                        </OverlayTrigger>
                                                                        : <div className="text-dark-75 font-weight-bolder d-block font-size-lg text-hover-primary">-</div>
                                                                }
                                                            </div>
                                                            <div className='text-hover' onClick={() => { navigator.clipboard.writeText(acceso.numero) }}>
                                                                {
                                                                    acceso.numero ?
                                                                        <span className="text-muted font-weight-bold">{acceso.numero}</span>
                                                                        : <div className="text-muted font-weight-bold">-</div>
                                                                }
                                                            </div>
                                                        </td>
                                                        <td>
                                                            {
                                                                acceso.usuarios.length > 1 ?
                                                                    acceso.usuarios.map((usuario, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index}>
                                                                                <ul className="pl-4 mb-2">
                                                                                    <li>{usuario.name}</li>
                                                                                </ul>
                                                                            </span>
                                                                        )
                                                                    })
                                                                    :
                                                                    acceso.usuarios.map((usuario, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index}>{usuario.name} <br /></span>
                                                                        )
                                                                    })
                                                            }
                                                        </td>
                                                        <td>
                                                            
                                                        </td>
                                                        <td>
                                                            {
                                                                acceso.empresas.length > 1 ?
                                                                    acceso.empresas.map((empresa, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index} >
                                                                                <ul className="pl-4 mb-2">
                                                                                    <li>{empresa.name}</li>
                                                                                </ul>
                                                                            </span>
                                                                        )
                                                                    })
                                                                    :
                                                                    acceso.empresas.map((empresa, index) => {
                                                                        return (
                                                                            <span className="text-muted font-weight-bold" key={index} >{empresa.name} <br /></span>
                                                                        )
                                                                    })
                                                            }
                                                        </td>
                                                        <td className="text-justify">
                                                            <span className="text-muted font-weight-bold">{acceso.descripcion}</span>
                                                        </td>
                                                        <td className="px-0 text-center">
                                                            <OverlayTrigger overlay={<Tooltip>EDITAR</Tooltip>}>
                                                                <span
                                                                    onClick={(e) => { e.preventDefault(); this.changePageEdit(acceso) }}
                                                                    className="btn btn-icon btn-sm mr-2 btn-hover-success mb-2">
                                                                    <span className="svg-icon svg-icon-md svg-icon-success">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Write.svg')} />
                                                                    </span>
                                                                </span>
                                                            </OverlayTrigger>
                                                            <OverlayTrigger overlay={<Tooltip>ELIMINAR</Tooltip>}>
                                                                <span
                                                                    onClick={(e) => { deleteAlert('¿ESTÁS SEGURO QUE DESEAS ELIMINAR EL REGISTRO?', '¡NO PODRÁS REVERTIR ESTO!', () => this.deleteAccesoAxios(acceso.id)) }}
                                                                    className="btn btn-icon btn-sm btn-hover-danger mb-2">
                                                                    <span className="svg-icon svg-icon-md svg-icon-danger">
                                                                        <SVG src={toAbsoluteUrl('/images/svg/Trash.svg')} />
                                                                    </span>
                                                                </span>
                                                            </OverlayTrigger>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </Card.Body>
                </Card > */}
            </Layout >
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

export default connect(mapStateToProps, mapDispatchToProps)(Accesos);