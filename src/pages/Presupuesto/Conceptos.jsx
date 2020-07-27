import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CONCEPTOS_COLUMNS } from '../../constants'
import { setOptions, setTextTable, setMoneyTable} from '../../functions/setters'
import Layout from '../../components/layout/layout'
import { Modal, ModalDelete } from '../../components/singles'
import { ConceptoForm } from '../../components/forms'
import NewTable from '../../components/tables/NewTable'

class Conceptos extends Component {

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nuevo concepto',
        options: {
            unidades: [],
            partidas: [],
            subpartidas: []
        },
        data: {
            conceptos: []
        },
        formeditado:0,
        form: {
            unidad: '',
            partida: '',
            subpartida: '',
            descripcion: '',
            costo: ''
        },
        conceptos: [],
        concepto: ''
    }

    componentDidMount() {
        var element = document.getElementById("kt_datatable_conceptos");
        element.classList.remove("table-responsive");

        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!conceptos)
            history.push('/')
        this.getConceptosAxios()
    }

    openModal = () => {
        const { options } = this.state
        options.subpartidas = []
        this.setState({
            ... this.state,
            options,
            modal: true,
            title: 'Nuevo concepto',
            form: this.clearForm(),
            formeditado:0
        })
    }

    openModalEdit = (concepto) => {
        const { form, options } = this.state

        form.descripcion = concepto.descripcion
        form.costo = concepto.costo

        form.unidad = concepto.unidad.id.toString()

        if(concepto.subpartida){
            if(concepto.subpartida.partida){
                form.partida = concepto.subpartida.partida.id.toString()
                options['subareas'] = setOptions(concepto.subpartida.partida.subpartidas, 'nombre', 'id')
                form.subpartida = concepto.subpartida.id.toString()
            }
        }
        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar concepto',
            form,
            concepto: concepto,
            options,
            formeditado:1
        })
    }

    openModalDelete = (concepto) => {
        this.setState({
            ... this.state,
            modalDelete: true,
            concepto: concepto
        })
    }

    handleClose = () => {
        const { modal, options } = this.state
        options.subpartidas = []
        this.setState({
            ... this.state,
            modal: !modal,
            options,
            title: 'Nuevo concepto',
            concepto: '',
            form: this.clearForm()
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ... this.state,
            modalDelete: !modalDelete,
            concepto: '',
        })
    }

    setConceptos = conceptos => {
        let aux = []
        conceptos.map((concepto) => {
            aux.push(
                {
                    actions: this.setActions(concepto),
                    clave: renderToString(setTextTable(concepto.clave)),
                    descripcion: renderToString(setTextTable(concepto.descripcion)),
                    unidad: concepto.unidad ? renderToString(setTextTable(concepto.unidad.nombre)) : '',
                    costo: renderToString(setMoneyTable(concepto.costo)),
                    partida: concepto.subpartida ? concepto.subpartida.partida ? renderToString(setTextTable(concepto.subpartida.partida.nombre)) : '' : '',
                    subpartida: concepto.subpartida ? renderToString(setTextTable(concepto.subpartida.nombre)) : '',
                    id: concepto.id
                }
            )
        })
        return aux
    }
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
    setOptions = (name, array) => {
        const {options} = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            form[element] = ''
        })
        return form
    }

    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        swal({
            title: '¡Un momento!',
            text: 'La información está siendo procesada.',
            buttons: false
        })
        if (title === 'Editar concepto')
            this.editConceptoAxios()
        else
            this.addConceptoAxios()
    }

    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ... this.state,
            form
        })
    }

    async getConceptosAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'conceptos', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades, partidas, conceptos } = response.data
                const { options, data } = this.state
                data.conceptos = conceptos
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                this.setState({
                    ... this.state,
                    options,
                    conceptos: this.setConceptos(conceptos),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async addConceptoAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        await axios.post(URL_DEV + 'conceptos', form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { conceptos } = response.data
                const { data } = this.state
                data.conceptos = conceptos
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    conceptos: this.setConceptos(conceptos),
                    modal: false,
                    title: 'Nuevo concepto',
                    form: this.clearForm(),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async editConceptoAxios() {
        const { access_token } = this.props.authUser
        const { form, concepto } = this.state
        await axios.put(URL_DEV + 'conceptos/' + concepto.id, form, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { conceptos } = response.data
                const { data } = this.state
                data.conceptos = conceptos
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    conceptos: this.setConceptos(conceptos),
                    modal: false,
                    title: 'Nuevo concepto',
                    form: this.clearForm(),
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    async deleteConceptoAxios() {
        const { access_token } = this.props.authUser
        const { concepto } = this.state
        await axios.delete(URL_DEV + 'conceptos/' + concepto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { conceptos } = response.data
                const { data } = this.state
                data.conceptos = conceptos
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })
                this.setState({
                    ... this.state,
                    conceptos: this.setConceptos(conceptos),
                    modalDelete: false,
                    concepto: '',
                    data
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    swal({
                        title: '¡Ups 😕!',
                        text: 'Parece que no has iniciado sesión',
                        icon: 'warning',
                        confirmButtonText: 'Inicia sesión'
                    });
                } else {
                    swal({
                        title: '¡Ups 😕!',
                        text: error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.',
                        icon: 'error',
                    })
                }
            }
        ).catch((error) => {
            swal({
                title: '¡Ups 😕!',
                text: 'Ocurrió un error desconocido catch, intenta de nuevo.' + error,
                icon: 'error'
            })
        })
    }

    render() {

        const { modal, modalDelete, title, form, options, conceptos, data, formeditado} = this.state

        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose} >
                    <ConceptoForm  form={form} options={options} setOptions = { this.setOptions }
                        onChange={this.onChange} onSubmit = { this.onSubmit } formeditado={formeditado}/>
                </Modal>

                <NewTable columns={CONCEPTOS_COLUMNS} data={conceptos}
                    title='Conceptos' subtitle='Listado de conceptos'
                    mostrar_boton={true}
                    abrir_modal={true}
                    mostrar_acciones={true}
                    onClick={ this.openModal }
                    actions={{
                        'edit': { function: this.openModalEdit },
                        'delete': { function: this.openModalDelete }
                    }}
                    elements={data.conceptos}
                    idTable = 'kt_datatable_conceptos'
                />
                
                <ModalDelete title={"¿Estás seguro que deseas eliminar el concepto?"} show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteConceptoAxios() }}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Conceptos);