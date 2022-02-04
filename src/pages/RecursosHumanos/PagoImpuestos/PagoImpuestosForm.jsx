import React, { Component } from 'react'
import moment from 'moment'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import Layout from '../../../components/layout/layout'
import { setOptions } from '../../../functions/setters'
import { onChangeAdjunto } from '../../../functions/onChanges'
import { waitAlert, printResponseErrorAlert, doneAlert } from '../../../functions/alert'
import { PagoImpuestosForm as PagoImpuestosFormulario } from '../../../components/forms'
import { apiOptions, apiGet, apiPostFormData, apiPutForm, apiDelete, catchErrors } from '../../../functions/api'
const meses = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']

class PagoImpuestosForm extends Component {
    state = {
        formeditado: 0,
        data: {
            adjuntos: [],
            usuarios: []
        },
        title: 'Nueva prestación',
        form: {
            empresa:'',
            fechaInicio: new Date(),
            fechaFin: new Date(),
            cuentaImss: '',
            cuentaRcv: '',
            cuentaInfonavit: '',
            cuentaIsn: '',
            pagoImpuestos: [{
                usuario: '',
                imss: '',
                rcv: '',
                infonavit: '',
                isn: ''
            }],
            mes: meses[new Date().getMonth()],
            año: new Date().getFullYear(),
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                }
            }
        },
        options: {
            usuarios: [],
            empresas: [],
            cuentas: []
        },
        action: '',
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props

        const nominaOmbra = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nueva prestación',
                    formeditado: 0,
                    action: 'add'
                })
                break;
            case 'edit':
                if (state) {
                    if (state.impuesto) {
                        const { impuesto } = state
                        this.setState({
                            ...this.state,
                            title: 'Editar prestación',
                            formeditado: 1,
                            action: 'edit'
                        })
                        this.getOnePagoImpuestosAxios(impuesto.id)
                        
                    }
                    else
                        history.push('/rh/pago-impuestos')
                } else
                    history.push('/rh/pago-impuestos')
                break;
            default:
                break;
        }
        if (!nominaOmbra)
            history.push('/')
        this.getOptionsAxios()
    }
    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        apiOptions('v2/rh/pago-impuestos?tipo=administrativo', access_token).then(
            (response) => {

                Swal.close()
                const { usuarios, empresas, cuentas } = response.data
                const { options, data, form, formeditado } = this.state
                data.usuarios = usuarios
                options.empresas = setOptions(empresas, 'name', 'id')
                options.cuentas = setOptions(cuentas, 'nombre', 'id')
                if (formeditado === 0) {
                    let aux = []
                    usuarios.forEach((element) => {
                        aux.push({
                            'usuario': element.id.toString(),
                            'imss': element.imss,
                            'rcv': element.rcv,
                            'infonavit': element.infonavit,
                            'isn': element.isn
                        })
                    })
                    form.pagoImpuestos = aux
                }
                options.usuarios = this.updateOptionsUsuarios(form.pagoImpuestos)
                this.setState({ ...this.state, options, data, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    getOnePagoImpuestosAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        apiGet(`v2/rh/pago-impuestos/${id}`, access_token).then(
            (response) => {
                Swal.close()
                const { impuesto } = response.data
                const { form, options } = this.state

                form.empresa = impuesto.empresa ? impuesto.empresa.id.toString() : ''
                form.fechaInicio = new Date(moment(impuesto.fecha_inicio))
                form.fechaFin = impuesto.fecha_fin ? new Date(moment(impuesto.fecha_fin)) : ''

                let aux = []
                impuesto.nominas_impuestos.forEach((nom, key) => {
                    aux.push(
                        {
                            usuario: nom.empleado ? nom.empleado.id.toString() : '',
                            imss: nom.nomina_imss,
                            rcv: nom.nomina_infonavit,
                            infonavit: nom.nomina_isn,
                            isn: nom.nomina_rcv,
                            id: nom.id
                        }
                    )
                })

                if (aux.length) { form.pagoImpuestos = aux } 
                else { form.pagoImpuestos = [{ usuario: '', imss: '', rcv: '', infonavit: '', isn: '' }] }

                if(impuesto.egresos){
                    if(impuesto.egresos.length){
                        if(impuesto.cuentaImss){ form.cuentaImss = impuesto.cuentaImss.id.toString() }
                        if(impuesto.cuentaRcv){ form.cuentaRcv = impuesto.cuentaRcv.id.toString() }
                        if(impuesto.cuentaInfonavit){ form.cuentaInfonavit = impuesto.cuentaInfonavit.id.toString() }
                        if(impuesto.cuentaIsn){ form.cuentaIsn = impuesto.cuentaIsn.id.toString() }
                    }
                }
                this.setState({
                    ...this.state,
                    impuesto: impuesto,
                    form,
                    options
                })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }
    async addPagoImpuestosAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'pagoImpuestos':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                case 'adjuntos':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        aux.forEach((element) => {
            if (form.adjuntos[element].value !== '') {
                form.adjuntos[element].files.forEach((file) => {
                    data.append(`files_name_${element}[]`, file.name)
                    data.append(`files_${element}[]`, file.file)
                })
                data.append('adjuntos[]', element)
            }
        })
        apiPostFormData('v2/rh/pago-impuestos', data, access_token).then(
            (response) => {
                const { history } = this.props
                doneAlert(response.data.message !== undefined ? response.data.message : 'Prestación agregada con éxito.')
                history.push({ pathname: '/rh/pago-impuestos' });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => { catchErrors(error) })
    }

    async updatePagoImpuestosAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        const { form, impuesto } = this.state

        apiPutForm(`v2/rh/pago-impuestos/${impuesto.id}`, form, access_token).then(
            (response) => {
                const { nom } = response.data
                const { options } = this.state
                doneAlert(response.data.message !== undefined ? response.data.message : 'Prestación modificada con éxito.')
                let aux = []

                nom.nominas_administrativas.forEach((element, key) => {
                    aux.push(
                        {
                            usuario: element.empleado ? element.empleado.id.toString() : '',
                            imss: element.imss,
                            rcv: element.rcv,
                            infonavit: element.restante_nomina,
                            isn: element.isn,
                            id: element.id
                        }
                    )
                })
                if (aux.length) { form.pagoImpuestos = aux } 
                else { form.pagoImpuestos = [{ usuario: '', imss: '', rcv: '', infonavit: '', isn: '' }] }
                options.usuarios = this.updateOptionsUsuarios(form.pagoImpuestos)
                window.history.replaceState(nom, 'nomina')
                this.setState({...this.state, nomina: nom, options, form })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch(( error ) => { catchErrors(error) })
    }
    deleteRowPagoImpuestoAdmin = async(nominaAdmin, key) => {
        if(nominaAdmin.id){
            waitAlert()
            const { access_token } = this.props.authUser
            const { nomina } = this.state
            apiDelete(`v2/rh/pago-impuestos/${nomina.id}/${nominaAdmin.id}`, access_token).then(
                (response) => {
                    Swal.close()
                    const { form, options } = this.state
                    const { nom } = response.data
                    let aux = []
                    nom.nominas_administrativas.forEach((element, key) => {
                        aux.push(
                            {
                                usuario: element.empleado ? element.empleado.id.toString() : '',
                                imss: element.nomina_imss,
                                rcv: element.rcv,
                                infonavit: element.infonavit,
                                isn: element.isn,
                                id: element.id
                            }
                        )
                    })
                    if (aux.length) { form.pagoImpuestos = aux } 
                    else { form.pagoImpuestos = [{ usuario: '', imss: '', rcv: '',  infonavit: '', isn: '' }] }
                    options.usuarios = this.updateOptionsUsuarios(form.pagoImpuestos)
                    window.history.replaceState(nom, 'nomina')
                    this.setState({...this.state, nomina: nom, options, form })
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => { catchErrors(error) })
        }else{
            let aux = []
            const { form, options } = this.state
            form.pagoImpuestos.forEach((element, index) => {
                if(index !== key)
                    aux.push(element)
            })
            if (aux.length) { form.pagoImpuestos = aux } 
            else { form.pagoImpuestos = [{ usuario: '', imss: '', rcv: '', infonavit: '', isn: '' }] }
            options.usuarios = this.updateOptionsUsuarios(form.pagoImpuestos)
            this.setState({...this.state, form, options})
        }
    }

    clearFilesPagoImpuestoAdmin = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) { if (counter !== key) { aux.push(form.adjuntos[name].files[counter]) } }
        if (aux.length < 1) { form.adjuntos[name].value = '' }
        form.adjuntos[name].files = aux
        this.setState({ ...this.state, form })
    }

    onChangeAdmin = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }
    
    onSubmit = e => {
        e.preventDefault()
        const { title } = this.state
        if (title === 'Editar prestación')
            this.updatePagoImpuestosAxios()
        else
            this.addPagoImpuestosAxios()
    }

    onChangePagoImpuestosAdmin = (key, e, name) => {
        const { value } = e.target
        const { form, data, options } = this.state
        if(name === 'usuario'){
            data.usuarios.map( (empleado) => {
                if(value.toString() === empleado.id.toString()){
                    form['pagoImpuestos'][key].imss = empleado.imss
                    form['pagoImpuestos'][key].rcv = empleado.rcv
                    form['pagoImpuestos'][key].infonavit = empleado.infonavit
                    form['pagoImpuestos'][key].isn = empleado.isn
                }
                return false
            }) 
        }
        form['pagoImpuestos'][key][name] = value
        if(name === 'usuario'){
            options.usuarios = this.updateOptionsUsuarios(form.pagoImpuestos)
        }
        
        this.setState({ ...this.state, form, options })
    }

    addRowPagoImpuestoAdmin = () => {
        const { form } = this.state
        form.pagoImpuestos.push( {  usuario: '', imss: '', rcv: '', infonavit: '', isn: '' } )
        this.setState({ ...this.state, form })
    }
    updateOptionsUsuarios = (formulario) => {
        const { data, options } = this.state
        let aux = []
        let aux2 = []
        options.usuarios = setOptions(data.usuarios, 'nombre', 'id')
        formulario.forEach((element) => {
            aux.push(element.usuario)
        })
        options.usuarios.forEach((element) => {
            if(!aux.includes(element.value))
                aux2.push(element)
        })
        return aux2
    }

    render() {
        const { options, title, form, formeditado, data, action } = this.state
        return (
            <Layout active={'rh'} {...this.props}>
                <PagoImpuestosFormulario
                    title = { title } formeditado = { formeditado } className = "px-3" options = { options } form = { form }
                    addRowPagoImpuestoAdmin = { this.addRowPagoImpuestoAdmin } deleteRowPagoImpuestoAdmin = { this.deleteRowPagoImpuestoAdmin } 
                    onChangePagoImpuestosAdmin = { this.onChangePagoImpuestosAdmin } onChangeAdmin = { this.onChangeAdmin } clearFilesPagoImpuestoAdmin = { this.clearFilesPagoImpuestoAdmin } 
                    onSubmit = { this.onSubmit } usuarios = { data.usuarios } action = { action }
                    onChangeAdjunto={ (e) => { this.setState({...this.state,form: onChangeAdjunto(e, form) });}}
                />
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(PagoImpuestosForm);