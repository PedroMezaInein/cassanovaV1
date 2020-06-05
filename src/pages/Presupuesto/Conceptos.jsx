/* eslint-disable no-unused-vars */  
import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
//
import { connect } from 'react-redux'
import axios from 'axios'
import swal from 'sweetalert'
import { URL_DEV, CONCEPTOS_COLUMNS } from '../../constants'

// Functions
import { setOptions, setSelectOptions, setTextTable, setDateTable, setMoneyTable, setArrayTable, setFacturaTable, setAdjuntosList } from '../../functions/setters'

//
import Layout from '../../components/layout/layout'
import { Button } from '../../components/form-components'
import { Modal, ModalDelete } from '../../components/singles'
import { faPlus, faLink, faEdit, faTrash, faSync } from '@fortawesome/free-solid-svg-icons'
import { DataTable } from '../../components/tables'
import { Subtitle } from '../../components/texts'
import { ConceptoForm } from '../../components/forms'
import NewTable from '../../components/tables/NewTable'

class Conceptos extends Component {

    state = {
        modal: false,
        modalDelete: false,
        title: 'Nuevo concepto',
        options: {
            categorias: [],
            unidades: []
        },
        data: {
            conceptos: []
        },
        form: {
            unidad: '',
            categoria: '',
            descripcion: '',
            manoObra: '',
            herramienta: '',
            materiales: '',
            clave: '',
            costo: ''
        },
        conceptos: [],
        concepto: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === '/' + url
        });
        if (!conceptos)
            history.push('/')
        this.getConceptosAxios()
    }

    openModal = () => {
        this.setState({
            ... this.state,
            modal: true,
            title: 'Nuevo concepto',
            form: this.clearForm()
        })
    }

    openModalEdit = (concepto) => {
        const { form } = this.state

        form.manoObra = concepto.manoObra
        form.herramienta = concepto.herramienta
        form.materiales = concepto.materiales

        form.descripcion = concepto.descripcion
        form.clave = concepto.clave
        form.costo = concepto.costo

        form.categoria = concepto.categoria.id.toString()
        form.unidad = concepto.unidad.id.toString()

        this.setState({
            ... this.state,
            modal: true,
            title: 'Editar concepto',
            form,
            concepto: concepto
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
        const { modal } = this.state
        this.setState({
            ... this.state,
            modal: !modal,
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
                    categoria: concepto.categoria ? renderToString(setTextTable(concepto.categoria.nombre)) : '',
                    clave: renderToString(setTextTable(concepto.clave)),
                    descripcion: renderToString(setTextTable(concepto.descripcion)),
                    unidad: concepto.unidad ? renderToString(setTextTable(concepto.unidad.nombre)) : '',
                    costo: renderToString(setMoneyTable(concepto.costo)),
                    materiales: renderToString(setTextTable(concepto.materiales)),
                    manoObra: renderToString(setTextTable(concepto.mano_obra)),
                    herramienta: renderToString(setTextTable(concepto.herramienta)),
                    id: concepto.id
                }
            )
        })
        return aux
    }
    /*
        setActions = concepto => {
            return(
                <>
                    <div className="d-flex align-items-center flex-column flex-md-row">
                        <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalEdit(concepto)} } text='' icon={faEdit} color="transparent" 
                            tooltip={{id:'edit', text:'Editar'}} />
                        <Button className="mx-2 my-2 my-md-0 small-button" onClick={(e) => {e.preventDefault(); this.openModalDelete(concepto)} } text='' icon={faTrash} color="red" 
                            tooltip={{id:'delete', text:'Eliminar', type:'error'}} />
                    </div>
                </>
            )
        }
    */
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
                const { data } = this.state
                const { unidades, categorias, conceptos } = response.data
                const { options } = this.state
                data.conceptos = conceptos
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['categorias'] = setOptions(categorias, 'nombre', 'id')
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
                    form: this.clearForm()
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
                    form: this.clearForm()
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
                    concepto: ''
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

        const { modal, modalDelete, title, form, options, conceptos, data } = this.state

        return (
            <Layout active={'administracion'}  {...this.props}>
                {/*
                <div className="text-right">
                    <Button className="small-button ml-auto mr-4" onClick={(e) => { this.openModal() }} text='' icon={faPlus} color="green" />
                </div>
                */}        
                <Modal show={modal} handleClose={this.handleClose} >
                    <ConceptoForm title={title} form={form} options={options}
                        onChange={this.onChange} onSubmit = { this.onSubmit }/>
                </Modal>

                {/* <DataTable columns = { CONCEPTOS_COLUMNS } data = { conceptos } />*/}
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
                />

                <ModalDelete show={modalDelete} handleClose={this.handleCloseDelete} onClick={(e) => { e.preventDefault(); this.deleteConceptoAxios() }}>
                    <Subtitle className="my-3 text-center">
                        ¿Estás seguro que deseas eliminar el concepto?
                    </Subtitle>
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