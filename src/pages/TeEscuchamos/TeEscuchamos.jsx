import React, { Component } from 'react'
import Layout from '../../components/layout/layout'
import { NewTable } from '../../components/NewTables'
import moment from 'moment'
import axios from 'axios'
import $ from 'jquery'
import { Modal } from '../../components/singles'
import { URL_DEV, SUGERENCIA_COLUMN } from '../../constants'
import { Form, DropdownButton, Dropdown } from 'react-bootstrap'
import { apiOptions, catchErrors, apiGet, } from '../../functions/api'
import { setSingleHeader,  } from '../../functions/routers'
import { printResponseErrorAlert, deleteAlert, waitAlert, doneAlert, errorAlert, } from '../../functions/alert'
import { setOptions, setTextTableCenter, setNaviIcon } from '../../functions/setters'
import { connect } from 'react-redux'
import { Card, } from 'react-bootstrap'
import { Input, Button, SelectSearch } from '../../components/form-components'

// import PropTypes from 'prop-types'

class TeEscuchamos extends Component {

    state = {

        modal: {
            filters: false,
            externa: false,
            see: false,
            revision: false,
        },
        form: {
            empleado_id: '',
            namePropio: this.props.authUser.user.name,
            sugerencia: '',
            // subarea: '',
            areas_id: '',
            id:''

        },
        data: {
        },
        options: {
            departamentos: [],
            subareas: [],
            nombre: [],
        },
        filters: {},

    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
     
        this.setTableSugerencias()
        this.getOptions()
        // console.log($.fn.dataTable.isDataTable())
        // console.log( $('#aa').DataTable())
    }
    updateSelect = (value, name) => {
        const { form, options, } = this.state
        form[name] = value
        this.setState({ ...this.state, form, options })
    }
    async reloadTableSugerencias() {
         $('#TeEscuchamos').DataTable().ajax.reload();
        
    }


    setActions = (sugerencia) => {
        const { form, } = this.state
        return (
            <div className="w-100 d-flex justify-content-center">
                <DropdownButton menualign="right" title={<i className="fas fa-chevron-circle-down icon-md p-0 "></i>} id='dropdown-button-newtable' >
                    <Dropdown.Item className="text-hover-success dropdown-success"
                        onClick={(e) => {
                            e.preventDefault();
                            form.empleado_id = sugerencia.empleado_id
                            form.sugerencia = sugerencia.sugerencia
                            form.areas_id = sugerencia.areas_id.toString()
                            form.id = sugerencia.id
                            this.setState({ ...this.state, form })
                            this.openModalRevision()
                        }}>
                        {setNaviIcon('flaticon2-magnifier-tool', 'Ver sugerencia')}
                    </Dropdown.Item>
                </DropdownButton>
            </div>
        )
    }

    setTableSugerencias = (sugerencias) => {
        let aux = []
        if (sugerencias) {
            sugerencias.map((sugerencia) => {
                aux.push(
                    {
                        actions: this.setActions(sugerencia),
                        empleado: setTextTableCenter(sugerencia.empleado_id ? sugerencia.usuarios.nombre : ''),
                        departamento: setTextTableCenter(sugerencia.areas_id ? sugerencia.departamentos.nombre : ''),
                        estatus: setTextTableCenter(sugerencia.estatus ? sugerencia.estatus : ''),
                    }
                )
                return false
            }

            )
            return aux
        }
    }



    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    getOptions = async () => {
        const at = this.props.authUser.access_token
        apiOptions(`sugerencia`, at).then(
            (response) => {
                const { departamentos, empleados } = response.data
                const { options, form } = this.state
                options.departamentos = setOptions(departamentos, 'nombre', 'id')
                options.nombre = setOptions(empleados, 'nombre', 'id')
                this.setState({ ...this.state, options, form, response: response.data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }


    async addSugerencia() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'sugerencia', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                doneAlert('Sugerencia aceptada con éxito')
                this.reloadTableSugerencias()
                this.handleCloseModal()

            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }


    changeEstatusAxios = async(data) =>{
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}sugerencia/edit/${data}`,  {estatus: 'Revisada'}, { headers: setSingleHeader(access_token) }).then(
            (response) => {
                   doneAlert(response.data.message !== undefined ? response.data.message : 'Creaste con éxito la prestación.')
                this.setTableSugerencias()
            }, (error) => { printResponseErrorAlert(error) }
            
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    handleCloseModal = () => {
        const { modal } = this.state
        modal.see = false
        modal.externa = false
        this.setState({ ...this.state, modal })
    }

    openModalSugePropia = () => {
        const { modal } = this.state
        modal.see = true
        this.setState({ ...this.state, modal })
    }
    openModalSugeExterna = () => {
        const { modal } = this.state
        modal.externa = true
        this.setState({ ...this.state, modal })
    }

    openModalRevision = () => {
        const { modal } = this.state
        modal.revision = true
        this.setState({ ...this.state, modal })
    }
    clearForm = () => {
        const { form } = this.state
        form.empleado_id = ''
        form.sugerencia = ''
        form.areas_id = ''
        form.id = ''
        this.setState({ ...this.state, form })
    }


    render() {
        const { form, modal, options, title } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <div className="align-items-start flex-column">
                                <span className="font-weight-bolder text-dark font-size-h3">Te escuchamos</span>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <NewTable 
                        idTable='aa' 
                        tableName='TeEscuchamos' 
                        subtitle='Listado de Sugerencias'
                             title='Sugerencias' mostrar_boton={true}
                            columns={SUGERENCIA_COLUMN}
                            accessToken={this.props.authUser.access_token} setter={this.setTableSugerencias}
                            addPropio={() => {
                                this.clearForm()
                                this.openModalSugePropia()
                            }}
                            addExterno={() => { 
                                this.clearForm()
                                this.openModalSugeExterna() }}
                            filterClick={this.openModalFiltros} exportar_boton={true} onClickExport={() => { this.exportVentasAxios() }}
                            urlRender={`${URL_DEV}sugerencia`}

                        />
                    </Card.Body>
                </Card>
                <Modal active={'usuarios'}  {...this.props} size="lg" title='Nueva Sugerencia'
                    show={modal.see}
                    handleClose={() => {
                        const { modal } = this.state
                        modal.see = false
                        this.setState({ ...this.state, modal })
                        this.reloadTableSugerencias()
                    }} >
                    <Form id="form-proveedor">
                        <div className="form-group row form-group-marginless mt-4 col-md-10 m-auto">
                            <div className="col-md-12">
                                <Input
                                    readOnly
                                    requirevalidation={0}
                                    name="nombre"
                                    value={form.namePropio}
                                    placeholder="NOMBRE "
                                    onChange={this.onChangeProv}
                                    iconclass={"far fa-user"}
                                    formeditado={1}
                                    messageinc="Incorrecto. Ingresa el nombre."
                                />
                            </div>
                            <div className="col-md-12">
                                <Input
                                    requirevalidation={0}
                                    name="sugerencia"
                                    value={form.sugerencia}
                                    placeholder="SUGERENCIA"
                                    onChange={this.onChange}
                                    iconclass={"far fa-user"}
                                    formeditado={1}
                                    as='textarea'
                                />
                            </div>

                            <div className="col-md-12">
                                <SelectSearch
                                    required
                                    options={options.departamentos}
                                    placeholder="SELECCIONA EL DEPARTAMENTO"
                                    name="area"
                                    value={form.areas_id}
                                    onChange={(value) => { this.updateSelect(value, 'areas_id') }}
                                    formeditado={1}
                                    iconclass={"far fa-window-maximize"}
                                    messageinc="Incorrecto. Selecciona el departamento"
                                />
                            </div>

                        </div>



                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2"
                                        onClick={
                                            (e) => {

                                                this.reloadTableSugerencias()
                                                e.preventDefault()
                                                waitAlert()
                                                form.empleado_id = this.props.authUser.user.empleado_id
                                                this.setState({ ...this.state, form })
                                                this.addSugerencia()
                                            }
                                        }
                                        text="ENVIAR"
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
                <Modal active={'usuarios'}  {...this.props} size="lg" title='Revisión de sugerencia'
                    show={modal.revision}
                    handleClose={() => {
                        const { modal } = this.state
                        modal.revision = false
                        this.setState({ ...this.state, modal })
                    }} >
                    <Form id="form-proveedor">
                        <div className="form-group row form-group-marginless mt-4 col-md-10 m-auto">
                            <div className="col-md-12">
                                <Input
                                    readOnly
                                    requirevalidation={0}
                                    name="nombre"
                                    value={form.namePropio}
                                    placeholder="NOMBRE "
                                    onChange={this.onChangeProv}
                                    iconclass={"far fa-user"}
                                    formeditado={1}
                                    messageinc="Incorrecto. Ingresa el nombre."
                                />
                            </div>
                            <div className="col-md-12">
                                <Input
                                    readOnly
                                    requirevalidation={0}
                                    name="sugerencia"
                                    value={form.sugerencia}
                                    placeholder="SUGERENCIA"
                                    onChange={this.onChange}
                                    iconclass={"far fa-user"}
                                    formeditado={1}
                                    as='textarea'
                                />
                            </div>

                            <div className="col-md-12">
                                <SelectSearch
                                    readOnly
                                    options={options.departamentos}
                                    placeholder="SELECCIONA EL DEPARTAMENTO"
                                    name="area"
                                    value={form.areas_id}
                                    onChange={(value) => { this.updateSelect(value, 'areas_id') }}
                                    formeditado={1}
                                    iconclass={"far fa-window-maximize"}
                                />
                            </div>

                        </div>



                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' onClick={() => {
                                        this.changeEstatusAxios(form.id)
                                        waitAlert()
                                        this.reloadTableSugerencias()
                                        const { modal } = this.state
                                        modal.revision = false
                                        this.setState({ ...this.state, modal })
                                    }}
                                        className={"btn btn-icon btn-light-success btn-lg mr-2 ml-auto"}
                                        only_icon={"flaticon2-check-mark icon-md"} tooltip={{ text: 'Marcar como revisada' }} />
                                                                            {/* <Button icon='' onClick={() => { 
                                                                            openModalWithInput('Rechazado')}}
                                                                            className={"btn btn-icon btn-light-danger btn-l pulse pulse-danger"}
                                                                            only_icon={"flaticon2-cross icon-sm"} tooltip={{ text:'RECHAZAR' }} /> */}
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
                <Modal active={'usuarios'}  {...this.props} size="lg" title="Nueva Sugerencia Externa"
                    show={modal.externa}
                    handleClose={() => {
                        const { modal } = this.state
                        modal.externa = false
                        this.setState({ ...this.state, modal })
                    }} >
                    <Form id="form-proveedor">
                        <div className="form-group row form-group-marginless mt-4 col-md-10 m-auto">
                            <div className="col-md-12">
                                <SelectSearch
                                    required
                                    options={options.nombre}
                                    placeholder="NOMBRE"
                                    name="empleado"
                                    value={form.empleado_id}
                                    onChange={(value) => { this.updateSelect(value, 'empleado_id') }}
                                    // formeditado={formeditado}
                                    iconclass={"far fa-window-maximize"}
                                    messageinc="Incorrecto. Selecciona al empleado"
                                />
                            </div>
                            <div className="col-md-12">
                                <Input
                                    requirevalidation={0}
                                    name="sugerencia"
                                    value={form.sugerencia}
                                    placeholder="SUGERENCIA"
                                    onChange={this.onChange}
                                    iconclass={"far fa-user"}
                                    formeditado={0}
                                    as='textarea'
                                />
                            </div>
                            <div className="col-md-12">
                                <SelectSearch
                                    required
                                    options={options.departamentos}
                                    placeholder="SELECCIONA EL DEPARTAMENTO"
                                    name="area"
                                    value={form.areas_id}
                                    onChange={(value) => { this.updateSelect(value, 'areas_id') }}
                                    // formeditado={formeditado}
                                    iconclass={"far fa-window-maximize"}
                                    messageinc="Incorrecto. Selecciona el departamento"
                                />
                            </div>
                        </div>
                        <div className="card-footer py-3 pr-1">
                            <div className="row mx-0">
                                <div className="col-lg-12 text-right pr-0 pb-0">
                                    <Button icon='' className="btn btn-primary mr-2"
                                        onClick={
                                            (e) => {
                                                e.preventDefault()
                                                waitAlert()
                                                this.addSugerencia()
                                            }
                                        }
                                        text="ENVIAR"
                                    />
                                </div>
                            </div>
                        </div>
                    </Form>
                </Modal>
            </Layout>

        )
    }
}

// TeEscuchamos.propTypes = {

// }
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(TeEscuchamos)
