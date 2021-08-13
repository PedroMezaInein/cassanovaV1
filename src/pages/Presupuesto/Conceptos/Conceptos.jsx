import React, { Component } from 'react'
import { renderToString } from 'react-dom/server'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV, CONCEPTOS_COLUMNS } from '../../../constants'
import { setMoneyTableReactDom, setTextTableReactDom, setOptions, setTextTableCenter } from '../../../functions/setters'
import Layout from '../../../components/layout/layout'
import { ModalDelete, Modal } from '../../../components/singles'
import { printResponseErrorAlert, errorAlert, doneAlert, waitAlert, customInputAlert } from '../../../functions/alert'
import { replaceMoney } from '../../../functions/functions'
import NewTableServerRender from '../../../components/tables/NewTableServerRender'
import { ConceptoCard } from '../../../components/cards'
import { DoubleSelectSearchGray, InputGray, InputNumberGray, SelectSearchGray } from '../../../components/form-components'
import { Update } from '../../../components/Lottie'
import Swal from 'sweetalert2'
import { printSwalHeader } from '../../../functions/printers'
import $ from "jquery";
class Conceptos extends Component {

    state = {
        modalDelete: false,
        modalSee: false,
        title: 'Nuevo concepto',
        formeditado: 0,
        conceptos: [],
        concepto: '',
        form: {
            descripcion: '',
            costo: 0,
            proveedor: '',
            subpartida: '',
            unidad: ''
        },options:{
            subpartidas: [],
            unidades: [],
            proveedores: [],
        }
        
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const conceptos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getOptionsAxios()
        if (!conceptos)
            history.push('/')
    }

    changePageEdit = concepto => {
        const { history } = this.props
        history.push({
            pathname: '/presupuesto/conceptos/edit',
            state: { concepto: concepto }
        })
    }

    openModalDelete = concepto => {
        this.setState({
            ...this.state,
            modalDelete: true,
            concepto: concepto
        })
    }

    handleCloseDelete = () => {
        const { modalDelete } = this.state
        this.setState({
            ...this.state,
            modalDelete: !modalDelete,
            concepto: '',
        })
    }

    openModalSee = concepto => {
        this.setState({
            ...this.state,
            modalSee: true,
            concepto: concepto
        })
    }

    handleCloseSee = () => {
        this.setState({
            ...this.state,
            modalSee: false,
            concepto: ''
        })
    }

    setOptions = (data, tipo) => {
        const { options } = this.state
        switch(tipo){
            case 'proveedor':
                return options.proveedores
            case 'unidad':
                return options.unidades
            case 'subpartida':
                if(data.subpartida)
                    if(data.subpartida.partida)
                        if(data.subpartida.partida.subpartidas)
                            return setOptions(data.subpartida.partida.subpartidas, 'nombre', 'id')
                return []
            default: return []
        }
    }

    doubleClick = (data, tipo) => {
        const { form, options } = this.state
        switch(tipo){
            case 'proveedor':
            case 'unidad':
            case 'subpartida':
                if(data[tipo])
                    form[tipo] = data[tipo].id.toString()
                break
            case 'partida':
                if(data.subpartida){
                    if(data.subpartida.partida){
                        form.partida = data.subpartida.partida.id.toString()
                        form.subpartida = data.subpartida.id.toString()
                        options.subpartidas = setOptions(data.subpartida.partida.subpartidas, 'nombre', 'id')
                    }
                }
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
                    tipo === 'descripcion' &&
                        <InputGray  withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } rows  = { 6 } as = 'textarea'
                            onChange = { (e) => { this.onChange(e.target.value, tipo)} } swal = { true } letterCase = { false } />
                }
                {
                    tipo === 'costo' &&
                        <InputNumberGray withtaglabel = { 0 } withtextlabel = { 0 } withplaceholder = { 0 } withicon = { 0 }
                            requirevalidation = { 0 }  value = { form[tipo] } name = { tipo } prefix = '$' thousandSeparator = { true }
                            onChange = { (e) => { this.onChange(e.target.value, tipo)} } swal = { true } />
                }
                {
                    (tipo !== 'descripcion') && (tipo !== 'costo') && (tipo !== 'partida') &&
                        <SelectSearchGray options = { this.setOptions(data, tipo) }
                            onChange = { (value) => { this.updateSelectSearch(value, tipo)} } name = { tipo }
                            value = { form[tipo] } customdiv="mb-2 mt-7" requirevalidation={1} 
                            placeholder={`SELECCIONA ${tipo==='proveedor' ? 'el proveedor' : 'la ' + tipo }`} withicon={1}/>
                }
                {
                    tipo === 'partida' &&
                    <DoubleSelectSearchGray options = { options } form = { form } onChange = { this.onChange } 
                        one = { { placeholder: 'SELECCIONA LA PARTIDA', name: 'partida', opciones: 'partidas'} } 
                        two = { { placeholder: 'SELECCIONA LA SUBPARTIDA', name: 'subpartida', opciones: 'subpartidas'} }/>
                }
            </div>,
            <Update />,
            () => { this.patchConcepto(data, tipo) },
            () => { this.setState({...this.state,form: this.clearForm()}); Swal.close(); },
        )
    }

    updateSelectSearch = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch(element){
                default:
                    form[element] = ''
                break;
            }
        })
        return form
    }

    setConceptos = conceptos => {
        let aux = []
        conceptos.map((concepto) => {
            aux.push(
                {
                    actions: this.setActions(concepto),
                    clave: renderToString(setTextTableCenter(concepto.clave)),
                    descripcion: setTextTableReactDom(concepto.descripcion, this.doubleClick, concepto, 'descripcion', 'text-justify'),
                    unidad: concepto.unidad ? setTextTableReactDom(concepto.unidad.nombre, this.doubleClick, concepto, 'unidad', 'text-center') : '',
                    costo: setMoneyTableReactDom(concepto.costo, this.doubleClick, concepto, 'costo'),
                    partida: concepto.subpartida ? concepto.subpartida.partida ? setTextTableReactDom(concepto.subpartida.partida.nombre, this.doubleClick, concepto, 'partida', 'text-center') : '' : '',
                    subpartida: concepto.subpartida ? setTextTableReactDom(concepto.subpartida.nombre, this.doubleClick, concepto, 'subpartida', 'text-center') : '',
                    proveedor: setTextTableReactDom(concepto.proveedor ? concepto.proveedor.razon_social : '', this.doubleClick, concepto, 'proveedor', 'text-center'),
                    id: concepto.id
                }
            )
            return false
        })
        return aux
    }

    onChange = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state,form})
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
            },
            {
                text: 'Mostrar&nbsp;información',
                btnclass: 'primary',
                iconclass: 'flaticon2-magnifier-tool',
                action: 'see',
                tooltip: { id: 'see', text: 'Mostrar', type: 'info' },
            }
        )
        return aux
    }

    getOptionsAxios = async() => {
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}conceptos/options`, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { unidades, partidas, proveedores } = response.data
                const { options } = this.state
                options['unidades'] = setOptions(unidades, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                this.setState({ ...this.state, options })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    patchConcepto = async( data,tipo ) => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        let value = ''
        switch(tipo){
            case 'costo':
                value = replaceMoney(form[tipo])
                break
            case 'partida':
                value = { partida: form.partida, subpartida: form.subpartida }
                break
            default:
                value = form[tipo]
                break
        }
        waitAlert()
        await axios.put(`${URL_DEV}v2/presupuesto/conceptos/${tipo}/${data.id}`, 
            { value: value }, 
            { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getConceptosTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'El concepto fue editado con éxito.')
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    async deleteConceptoAxios() {
        const { access_token } = this.props.authUser
        const { concepto } = this.state
        await axios.delete(URL_DEV + 'conceptos/' + concepto.id, { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.getConceptosTable()
                doneAlert(response.data.message !== undefined ? response.data.message : 'La concepto fue registrado con éxito.')
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
            console.error(error, 'error')
        })
    }

    async getConceptosTable() {
        $('#kt_datatable_conceptos').DataTable().ajax.reload();
    }
    async exportConceptosAxios() {
        waitAlert()
        let aux = $('#kt_datatable_conceptos').DataTable().rows({ selected: true }).data();
        let longitud = aux.length
        let arreglo = []
        for (let i = 0; i < longitud; i++) {
            arreglo.push(aux[i].id)
        }
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'exportar/conceptos', { selected: arreglo }, { responseType: 'blob', headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'conceptos.xlsx');
                document.body.appendChild(link);
                link.click();
                doneAlert(response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.')
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }

    render() {
        const { modalDelete, modalSee, concepto } = this.state
        return (
            <Layout active={'presupuesto'}  {...this.props}>
                <NewTableServerRender columns = { CONCEPTOS_COLUMNS } title = 'Conceptos' subtitle = 'Listado de conceptos'
                    mostrar_boton = { true } abrir_modal = { false } url = '/presupuesto/conceptos/add' mostrar_acciones = { true }
                    actions = { { 'edit': { function: this.changePageEdit }, 'delete': { function: this.openModalDelete }, 'see': { function: this.openModalSee } } }
                    exportar_boton = { true } onClickExport = { () => this.exportConceptosAxios() } accessToken = { this.props.authUser.access_token }
                    setter = { this.setConceptos } urlRender= { `${URL_DEV}v2/presupuesto/conceptos` } idTable = 'kt_datatable_conceptos' cardTable = 'cardTable'
                    cardTableHeader = 'cardTableHeader' cardBody = 'cardBody' checkbox = { true }  />
                <ModalDelete
                    title="¿Estás seguro que deseas eliminar el concepto?"
                    show={modalDelete}
                    handleClose={this.handleCloseDelete}
                    onClick={(e) => { e.preventDefault(); this.deleteConceptoAxios() }} />

                <Modal size="lg" title="Concepto" show={modalSee} handleClose={this.handleCloseSee} >
                    <ConceptoCard 
                        concepto={concepto}
                    />
                </Modal>
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