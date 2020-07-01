import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { Button } from '../../components/form-components'
import { faPlus, faTrash, faEdit, faMoneyBill, faFileAlt, faFileArchive, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons'
import { AreasForm } from '../../components/forms'
import { URL_DEV, GOLD, AREAS_COLUMNS } from '../../constants'
import { DataTable } from '../../components/tables'
import { Small, Subtitle } from '../../components/texts'
import { Modal, ModalDelete } from '../../components/singles'
import axios from 'axios'
import swal from 'sweetalert'
import NewTable from '../../components/tables/NewTable'
import { waitAlert, errorAlert, forbiddenAccessAlert } from '../../functions/alert'
import { setOptions, setSelectOptions, setTextTable, setDateTable, setListTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'
import { Tabs, Tab } from 'react-bootstrap'

class Areas extends Component {

    state = {
        form: {
            nombre: '',
            subarea: '',
            subareas: []
        },
        data: {
            areas: [],
            areasVentas: []
        },
        formeditado:0,
        areas: [],
        areasVentas: [],
        modal: false,
        modalDelete: false,
        title: 'Nueva área',
        area: '',
        tipo: 'compras'
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const areas = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!areas)
            history.push('/')
        this.getAreasAxios()
    }

    addSubarea = () => {
        const { form } = this.state
        if (form['subarea'] !== '') {
            let aux = false;
            aux = form.subareas.find(function (element, index) {
                if (element === form.subarea)
                    return true
            });
            if (aux !== true) {
                form.subareas.push(form.subarea)
                form.subarea = ''
                this.setState({
                    ... this.state,
                    form
                })
            }
        }
    }

    deleteSubarea = value => {
        const { form } = this.state
        let aux = []
        form.subareas.find(function (element, index) {
            if (element.toString() !== value.toString())
                aux.push(element)
        });
        form.subareas = aux
        this.setState({
            ... this.state,
            form
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    setAreas = areas => {
        let aux = []
        areas.map((area) => {
            aux.push({
                actions: this.setActions(area),
                area: renderToString(setTextTable(area.nombre)),
                subareas: renderToString(setListTable(area.subareas, 'nombre')),
                id: area.id
            })
        })
        return aux
    }

    /*setActions= area => {
        return(
            <>
                <div className="d-flex align-items-center flex-column flex-md-row">
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalEdit(e)(area) } text='' icon={faEdit} color="transparent" 
                        tooltip={{id:'edit', text:'Editar'}} />
                    <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => this.openModalDelete(e)(area) } text='' icon={faTrash} color="red"
                        tooltip={{id:'delete', text:'Eliminar', type: 'error'}} />
                </div>
            </>
        )
    }*/

    setActions = concepto => {
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

    setTextTable = text => {
        return (
            <Small>
                {text}
            </Small>
        )
    }

    setListTable = lista => {
        return (
            <ul>
                {
                    lista.map((element) => {
                        return (
                            <li>
                                <Small>
                                    {element.nombre}
                                </Small>
                            </li>
                        )
                    })
                }
            </ul>
        )
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            switch (element) {
                case 'subareas':
                    form[element] = []
                    break;
                default:
                    form[element] = ''
                    break;
            }
        })
        return form;
    }

    handleClose = () => {
        const { modal } = this.state
        this.setState({
            modal: !modal,
            title: 'Nueva área',
            form: this.clearForm(),
            area: ''
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            modalDelete: !modalDelete,
            area: ''
        })
    }

    openModal = () => {
        let { tipo } = this.state
        tipo = 'compras'
        this.setState({
            modal: true,
            title: 'Nueva área',
            form: this.clearForm(),
            tipo,
            formeditado:0
        })
    }

    openModalVentas = () => {
        let { tipo } = this.state
        tipo = 'ventas'
        this.setState({
            modal: true,
            title: 'Nueva área',
            form: this.clearForm(),
            tipo,
            formeditado:0
        })
    }

    openModalDelete = area => {
        this.setState({
            modalDelete: true,
            area: area
        })
    }

    openModalEdit = area => {
        const { form } = this.state
        let { tipo } = this.state
        tipo = 'compras'
        form.nombre = area.nombre
        let aux = []
        area.subareas.map((element) => {
            aux.push(element.nombre)
        })
        form.subareas = aux
        this.setState({
            modal: true,
            title: 'Editar área',
            area: area,
            form,
            tipo,
            formeditado:1
        })
    }

    openModalEditVentas = area => {
        const { form } = this.state
        let { tipo } = this.state
        tipo = 'ventas'
        form.nombre = area.nombre
        let aux = []
        area.subareas.map((element) => {
            aux.push(element.nombre)
        })
        form.subareas = aux
        this.setState({
            modal: true,
            title: 'Editar área',
            area: area,
            form,
            tipo,
            formeditado:1
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { form, title } = this.state
        if (title === 'Nueva área')
            this.addAreaAxios()
        if (title === 'Editar área')
            this.updateAreaAxios()
    }

    safeDelete = e => () => {
        this.deleteAreaAxios()
    }

    async getAreasAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'areas', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { data } = this.state
                const { areas, areasVentas } = response.data
                data.areas = areas
                data.areasVentas = areasVentas
                this.setState({
                    ... this.state,
                    areas: this.setAreas(areas),
                    areasVentas: this.setAreas(areasVentas),
                    data
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

    async addAreaAxios() {
        const { access_token } = this.props.authUser
        const { form, tipo } = this.state
        form.tipo = tipo
        this.setState({
            ... this.state,
            form
        })
        await axios.post(URL_DEV + 'areas', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { areas, areasVentas } = response.data
                const { data } = this.state
                data.areas = areas
                data.areasVentas = areasVentas
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Creaste con éxito una nueva área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm(),
                    areas: this.setAreas(areas),
                    areasVentas: this.setAreas(areasVentas),
                    data
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

    async updateAreaAxios() {
        const { access_token } = this.props.authUser
        const { form, area } = this.state
        await axios.put(URL_DEV + 'areas/' + area.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { areas, areasVentas } = response.data
                const { data } = this.state
                data.areas = areas
                data.areasVentas = areasVentas
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Editaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm(),
                    areas: this.setAreas(areas),
                    areasVentas: this.setAreas(areasVentas),
                    data,
                    area: ''
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

    async deleteAreaAxios() {
        const { access_token } = this.props.authUser
        const { area } = this.state
        await axios.delete(URL_DEV + 'areas/' + area.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { areas, areasVentas } = response.data
                const { data } = this.state
                data.areas = areas
                data.areasVentas = areasVentas
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'Eliminaste con éxito el área.',
                    icon: 'success',
                    buttons: false,
                    timer: 1500
                })
                this.setState({
                    ... this.state,
                    modalDelete: false,
                    form: this.clearForm(),
                    areas: this.setAreas(areas),
                    areasVentas: this.setAreas(areasVentas),
                    area: '',
                    data
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

    render() {
        const { form, areas, areasVentas, modal, modalDelete, title, data, formeditado} = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Tabs defaultActiveKey="compras">
                    <Tab eventKey="compras" title="Compras y egresos">
                        <div className="py-2">
                            <NewTable columns={AREAS_COLUMNS} data={areas}
                                title='Áreas' subtitle='Listado de áreas'
                                mostrar_boton={true}
                                abrir_modal={true}
                                mostrar_acciones={true}
                                onClick={this.openModal}
                                actions={{
                                    'edit': { function: this.openModalEdit },
                                    'delete': { function: this.openModalDelete }
                                }}
                                elements={data.areas}
                                idTable = 'kt_datatable_compras'
                            />
                        </div>
                    </Tab>
                    <Tab eventKey="ventas" title="Ventas e ingresos">
                        <div className="py-2">
                            <NewTable 
                                columns={AREAS_COLUMNS} 
                                data={areasVentas}
                                title='Áreas' 
                                subtitle='Listado de áreas'
                                mostrar_boton={true}
                                abrir_modal={true}
                                mostrar_acciones={true}
                                onClick={this.openModalVentas}
                                actions={{
                                    'edit': { function: this.openModalEditVentas },
                                    'delete': { function: this.openModalDelete }
                                }}
                                elements={data.areasVentas}
                                idTable = 'kt_datatable_ventas'
                            />
                        </div>
                    </Tab>
                </Tabs>
                

                <Modal title={"Nueva área"} show={modal} handleClose={this.handleClose}>
                    <AreasForm form={form} onChange={this.onChange}
                        addSubarea={this.addSubarea} deleteSubarea={this.deleteSubarea}
                        title={title} onSubmit={this.onSubmit} formeditado={formeditado} />
                </Modal>
                
                <ModalDelete title={"¿Estás seguro que deseas eliminar el área?"} show = { modalDelete } handleClose = { this.handleCloseDelete } onClick = { (e) => { e.preventDefault(); waitAlert(); this.safeDelete(e)() }}>
                </ModalDelete>
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

export default connect(mapStateToProps, mapDispatchToProps)(Areas);