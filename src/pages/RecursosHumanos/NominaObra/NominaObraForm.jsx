import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert, customInputAlert, validateAlert, questionAlert, questionAlertY } from '../../../functions/alert'
import { setOptions } from '../../../functions/setters'
import { NominaObraForm as NominaObraFormulario } from '../../../components/forms'
import readXlsxFile from 'read-excel-file'
import { SelectSearchGray } from '../../../components/form-components'
import Scrollbar from 'perfect-scrollbar-react';
import 'perfect-scrollbar-react/dist/style.min.css';
import moment from 'moment'
class NominaObraForm extends Component {

    state = {
        data: { usuarios: [] },
        options: { usuarios: [], proyectos: [], empresas: [], cuentas:[] },
        title: 'Nueva nómina de obra',
        formeditado: 0,
        form: {
            periodo: '',
            empresas: '',
            fechaInicio: new Date().setDate( new Date().getDate() - 4),
            fechaFin: new Date(),
            proyecto: '',
            nominasObra: [{
                usuario: '',
                costo_hr_regular: 0.0,
                costo_hr_nocturna: 0.0,
                costo_hr_extra: 0.0,
                total_hrs_regular: 0,
                total_hrs_nocturna: 0,
                total_hrs_extra: 0,
                viaticos: 0.0,
                nominImss: 0.0,
                restanteNomina: 0.0,
                extras: 0.0
            }],
            adjuntos: {
                adjunto: {
                    value: '',
                    placeholder: 'Ingresa los adjuntos',
                    files: []
                },
                excel: {
                    value: '',
                    placeholder: '¿Deseas importar la nómina?',
                    files: []
                }
            },
            cuentaImss:'',
            cuentaRestante:''
        },
        nomina: ''
    }
    
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const module = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({ ...this.state, title: 'Nueva nómina de obra', formeditado: 0 })
                break;
            case 'edit':
                const { nomina } = state
                this.setState({...this.state, title: 'Editar nómina de obra', formeditado: 1})
                this.getNominaAxios(nomina.id);
                break;
            default:
                break;
        }
        if (!module)
            history.push('/')
        this.getOptionsAxios()
    }

    getOptionsAxios = async() =>{
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.options(`${URL_DEV}v2/rh/nomina-obra`,  { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                Swal.close()
                const { proyectos, usuarios, empresas, cuentas } = response.data
                const { options, data } = this.state
                data.usuarios = usuarios
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.usuarios = setOptions(usuarios, 'nombre', 'id')
                options.empresas = setOptions(empresas, 'name', 'id')
                options.cuentas = setOptions(cuentas, 'nombre', 'id')
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    openModalCompras = () => {
        // const { history } = this.props;
        const { options, form } = this.state;
        customInputAlert(
            <div style={{ display: 'flex', maxHeight: '300px'}} >
                <Scrollbar>
                    <div class="row mx-0">
                        <h3 className="mb-2 font-weight-bold text-dark col-md-12">¿DESEAS CREAR LAS COMPRAS?</h3>
                        <span className="font-weight-light col-md-9 mx-auto mb-5">Si no deseas crear las cuentas, da clic en cancelar</span>
                        <h5 className="mb-4 font-weight-bold text-dark col-md-12 mt-4">SELECCIONA LA CUENTA PARA:</h5>
                        <div className="row mx-0 col-md-12 px-0 form-group-marginless d-flex justify-content-center mb-5">
                            {
                                this.getTotalesByType("nominImss") !==0 &&
                                <div className="col-md-10">
                                    <SelectSearchGray options = { options.cuentas } onChange = { (value) => { this.onChangeSwal(value, 'cuentaImss') } }
                                        name = 'cuentaImss' value = { form.cuentaImss } customdiv = "mb-2 text-left" requirevalidation = { 1 }
                                        placeholder = 'NÓMINA IMSS' withicon = { 0 } />
                                </div>
                            }
                            {
                                this.getTotalesByType("restanteNomina") !== 0 &&
                                    <div className="col-md-10">
                                        <SelectSearchGray options = { options.cuentas } onChange = { (value) => { this.onChangeSwal(value, 'cuentaRestante') } }
                                            name='cuentaRestante' value = { form.cuentaRestante } customdiv = "mb-2 text-left" requirevalidation = { 1 }
                                            placeholder='RESTANTE NÓMINA' withicon = { 0 } />
                                    </div> 
                            }
                        </div>
                    </div>
                </Scrollbar>
            </div>,
            '',
            () => { this.generarComprasAxios() },
            () => { '' },
            'htmlClass'
        )
    }

    openModalComprasUpdate = () => {
        // const { history } = this.props;
        const { options, form } = this.state;
        customInputAlert(
            <div style={{ display: 'flex', maxHeight: '300px'}} >
                <Scrollbar>
                    <div class="row mx-0">
                        <h3 className="mb-2 font-weight-bold text-dark col-md-12">PARA CONTINUAR SELECCIONA LAS CUENTAS A ASIGNAR</h3>
                        <h5 className="mb-4 font-weight-bold text-dark col-md-12 mt-4">SELECCIONA LA CUENTA PARA:</h5>
                        <div className="row mx-0 col-md-12 px-0 form-group-marginless d-flex justify-content-center mb-5">
                            {
                                this.getTotalesByType("nominImss") !==0 &&
                                <div className="col-md-10">
                                    <SelectSearchGray options = { options.cuentas } onChange = { (value) => { this.onChangeSwal(value, 'cuentaImss') } }
                                        name = 'cuentaImss' value = { form.cuentaImss } customdiv = "mb-2 text-left" requirevalidation = { 1 }
                                        placeholder = 'NÓMINA IMSS' withicon = { 0 } />
                                </div>
                            }
                            {
                                this.getTotalesByType("restanteNomina") !== 0 &&
                                    <div className="col-md-10">
                                        <SelectSearchGray options = { options.cuentas } onChange = { (value) => { this.onChangeSwal(value, 'cuentaRestante') } }
                                            name='cuentaRestante' value = { form.cuentaRestante } customdiv = "mb-2 text-left" requirevalidation = { 1 }
                                            placeholder='RESTANTE NÓMINA' withicon = { 0 } />
                                    </div> 
                            }
                        </div>
                    </div>
                </Scrollbar>
            </div>,
            '',
            () => { this.updateNominaAxios() },
            () => { '' },
            'htmlClass'
        )
    }

    getTotalesByType(key) {
        const { form } = this.state
        var suma = 0
        form.nominasObra.forEach(element => {
            switch(key){
                case 'nominImss':
                    suma += parseFloat(element[key])
                    break;
                case 'restanteNomina':
                    suma += parseFloat(element.costo_hr_regular *  element.total_hrs_regular) + parseFloat(element.costo_hr_nocturna * element.total_hrs_nocturna) - parseFloat(element.nominImss)
                    break;
                case 'extras':
                    suma += parseFloat(element.costo_hr_extra *  element.total_hrs_extra) + parseFloat(element.viaticos)
                    break;
            }
        })
        if (isNaN(suma)) {
            return suma = 0;
        }
        return suma
    }

    addNominaObraAxios = async() => {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();
        let aux = Object.keys(form)
        aux.forEach((element) => {
            switch (element) {
                case 'fechaInicio':
                case 'fechaFin':
                    data.append(element, (new Date(form[element])).toDateString())
                    break;
                case 'nominasObra':
                    data.append(element, JSON.stringify(form[element]))
                    break;
                case 'adjuntos':
                case 'empresas':
                    break;
                default:
                    data.append(element, form[element])
                    break
            }
        })
        aux = Object.keys(form.adjuntos)
        if(form.adjuntos.adjunto.value !== ''){
            form.adjuntos.adjunto.files.forEach((file) => {
                data.append(`files`, file.file)
            })
        }
        let arreglo = [];
        form.nominasObra.forEach((nom)=>{
            if(nom.usuario === '')
                arreglo.push(nom)
        })
        if(form.nominasObra.length > 0 && arreglo.length === 0){
            await axios.post(`${URL_DEV}v2/rh/nomina-obra`, data, { responseType: 'json', headers: setFormHeader(access_token) }).then(
                (response) => {
                    doneAlert('Nomina de obras guardada con éxito.')
                    const { nomina } = response.data
                    this.openModalCompras()
                    this.setState({...this.state, nomina: nomina})
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.log(error, 'error')
            })
        }else{ errorAlert('Llena todos los campos') }
    }
    
    onChangeSwal = (value, tipo) => {
        const { form } = this.state
        form[tipo] = value
        this.setState({...this.state, form})
    }

    generarComprasAxios = async() => {
        waitAlert();
        const { form, nomina } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/nomina-obra/${nomina.id}/compras`, form, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Compras registradas con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/rh/nomina-obras'
                });
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    getNominaAxios = async(id) => {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(`${URL_DEV}v2/rh/nomina-obra/${id}`,  { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                const { nomina } = response.data
                const { form } = this.state
                form.empresa = nomina.empresa ? nomina.empresa.id.toString() : ''
                form.proyecto = nomina.proyecto ? nomina.proyecto.id.toString() : ''
                form.periodo = nomina.periodo
                form.fechaInicio = new Date(moment(nomina.fecha_inicio))
                form.fechaFin = new Date(moment(nomina.fecha_fin))
                let aux = []
                nomina.nominas_obras.forEach((nom) => {
                    aux.push({
                        usuario: nom.empleado ? nom.empleado.id.toString() : '',
                        costo_hr_regular: parseFloat(nom.costo_hr_regular),
                        costo_hr_nocturna: parseFloat(nom.costo_hr_nocturna),
                        costo_hr_extra: parseFloat(nom.costo_hr_extra),
                        total_hrs_regular: parseFloat(nom.total_hrs_regular),
                        total_hrs_nocturna: parseFloat(nom.total_hrs_nocturna),
                        total_hrs_extra: parseFloat(nom.total_hrs_extras),
                        viaticos: parseFloat(nom.viaticos),
                        nominImss: parseFloat(nom.nomina_imss),
                        id: nom.id
                    })
                })
                form.nominasObra = aux
                this.setState({...this.state, form, nomina})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteRowNominaObraAxios = async(nom) => {
        const { nomina } = this.state
        const { access_token } = this.props.authUser
        await axios.delete(`${URL_DEV}v2/rh/nomina-obra/${nomina.id}/colaborador/${nom.id}`, { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Colaborador eliminado de la nómina con éxito.')
                const { nomina } = response.data
                const { form } = this.state
                form.empresa = nomina.empresa ? nomina.empresa.id.toString() : ''
                form.proyecto = nomina.proyecto ? nomina.proyecto.id.toString() : ''
                form.periodo = nomina.periodo
                form.fechaInicio = new Date(moment(nomina.fecha_inicio))
                form.fechaFin = new Date(moment(nomina.fecha_fin))
                let aux = []
                nomina.nominas_obras.forEach((nom) => {
                    aux.push({
                        usuario: nom.empleado ? nom.empleado.id.toString() : '',
                        costo_hr_regular: parseFloat(nom.costo_hr_regular),
                        costo_hr_nocturna: parseFloat(nom.costo_hr_nocturna),
                        costo_hr_extra: parseFloat(nom.costo_hr_extra),
                        total_hrs_regular: parseFloat(nom.total_hrs_regular),
                        total_hrs_nocturna: parseFloat(nom.total_hrs_nocturna),
                        total_hrs_extra: parseFloat(nom.total_hrs_extras),
                        viaticos: parseFloat(nom.viaticos),
                        nominImss: parseFloat(nom.nomina_imss),
                        id: nom.id
                    })
                })
                form.nominasObra = aux
                this.setState({...this.state, form, nomina})
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    updateNominaAxios = async() => {
        const { nomina, form } = this.state
        const { access_token } = this.props.authUser
        await axios.put(`${URL_DEV}v2/rh/nomina-obra/${nomina.id}`, form,  { responseType: 'json', headers: setSingleHeader(access_token) }).then(
            (response) => {
                doneAlert('Nómina actualizada con éxito.')
                this.getNominaAxios(nomina.id)
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = e => {
        const { value, name } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({...this.state, form})
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({ ...this.state, form })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        files.forEach((file, index) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: index } ) })
        form.adjuntos[item].value = files
        form.adjuntos[item].files = aux
        this.setState({ ...this.state, form })
    }

    onChangeAdjunto = e => {
        const { value, name, files } = e.target
        const { form, data, options } = this.state
        let aux = []
        files.forEach((file, index) => { aux.push( { name: file.name, file: file, url: URL.createObjectURL(file), key: index } ) })
        form.adjuntos[name].value = value
        form.adjuntos[name].files = aux
        this.setState({...this.state, form})
        aux = []
        if( files.length ){
            readXlsxFile(files[0]).then((rows) => {
                rows.forEach( (row, index) => {
                    if(index > 1){
                        if(row[0] !== null && ((row[28] + row[27] + row[26] + row[25]) > 0)){
                            let usuario = data.usuarios.find((element) => { return element.nombre === row[1] })
                            aux.push(
                                {
                                    usuario: usuario ? usuario.id.toString() : '',
                                    costo_hr_regular: row[10] ? row[10] : 0.0,
                                    costo_hr_nocturna: row[19] ? row[19] : 0.0,
                                    costo_hr_extra: row[22] ? row[22] : 0.0,
                                    total_hrs_regular: row[9] ? row[9] : 0,
                                    total_hrs_nocturna: row[18] ? row[18] : 0,
                                    total_hrs_extra: row[21] ? row[21] : 0,
                                    viaticos: row[23] ? row[23] : 0.0,
                                    nominImss: row[25] ? row[25] : 0.0,
                                    restanteNomina: ((row[10] * row[9]) + (row[19] * row[18])) - row[25],
                                    extras: (row[22] * row[21]) + row[23]
                                }
                            )
                        }
                    }
                })
                form.nominasObra = aux.length > 0 ? aux : {
                    usuario: '', costo_hr_regular: 0.0, costo_hr_nocturna: 0.0, costo_hr_extra: 0.0, total_hrs_regular: 0,
                    total_hrs_nocturna: 0, total_hrs_extra: 0, viaticos: 0.0, nominImss: 0.0, restanteNomina: 0.0, extras: 0.0
                }
                options.usuarios = this.updateOptionsUsuarios(form.nominasObra)
                this.setForm(form, options)
            })
        }
    }

    onChangeNominasObra = (key, e, name) => {
        const { value } = e.target
        const { form, data, options } = this.state
        form.nominasObra[key][name] = value
        if(name === 'usuario'){
            let usuario = data.usuarios.find( (empleado) => {
                return value.toString() === empleado.id.toString()
            })
            if(usuario){
                const { costo_hr_regular, costo_hr_nocturna, costo_hr_extra, total_hrs_extra, total_hrs_nocturna, total_hrs_regular, viaticos } = form.nominasObra[key]
                let total = (costo_hr_regular * total_hrs_regular) + (costo_hr_nocturna * total_hrs_nocturna) + (costo_hr_extra * total_hrs_extra) + viaticos
                if(total === 0){
                    form.nominasObra[key].costo_hr_regular = usuario.salario_hr ? usuario.salario_hr : 0.0
                    form.nominasObra[key].costo_hr_nocturna = usuario.salario_hr_nocturno ? usuario.salario_hr_nocturno : 0.0
                    form.nominasObra[key].costo_hr_extra = usuario.salario_hr_extra ? usuario.salario_hr_extra : 0.0
                }
            }
        }
        options.usuarios = this.updateOptionsUsuarios(form.nominasObra)
        this.setState({ ...this.state, form, options })
    }

    setForm = (form, options) => { this.setState({...this.state, form: form, options: options}) }

    addRowNominaObra = () => {
        const { form } = this.state
        form.nominasObra.push( { usuario: '', costo_hr_regular: 0.0, costo_hr_nocturna: 0.0, costo_hr_extra: 0.0, total_hrs_regular: 0,
            total_hrs_nocturna: 0, total_hrs_extra: 0, viaticos: 0.0, nominImss: 0.0, restanteNomina: 0.0, extras: 0.0 } )
        this.setState({ ...this.state, form })
    }

    deleteRowNominaObra = (nom, key) => {
        if(nom.id){
            const { data } = this.state
            let empleado = data.usuarios.find((usuario) => {
                return usuario.id.toString() === nom.usuario.toString()
            })
            questionAlertY('¿ESTÁS SEGURO?', `ELIMINARÁS A ${empleado.nombre} DE LA NÓMINA`, () => { this.deleteRowNominaObraAxios(nom) })
        }else{
            let aux = []
            const { form, options } = this.state
            form.nominasObra.forEach((element, index) => {
                if(index !== key)
                    aux.push(element)
            })
            if (aux.length) { form.nominasObra = aux } 
            else { form.nominasObra = [{ usuario: '', costo_hr_regular: 0.0, costo_hr_nocturna: 0.0, costo_hr_extra: 0.0, total_hrs_regular: 0,
                total_hrs_nocturna: 0, total_hrs_extra: 0, viaticos: 0.0, nominImss: 0.0, restanteNomina: 0.0, extras: 0.0 }] }
            options.usuarios = this.updateOptionsUsuarios(form.nominasObra)
            this.setState({...this.state, form, options})
        }
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

    onSubmit = e => {
        e.preventDefault();
        waitAlert()
        const { title } = this.state
        if (title === 'Nueva nómina de obra')
            this.addNominaObraAxios()
        else{
            const { nomina } = this.state
            if(nomina.compras.length)
                this.openModalComprasUpdate()            
            else
                this.updateNominaAxios()
        }
    }
    clearFiles = (name, key) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < form.adjuntos[name].files.length; counter++) {
            if (counter !== key) {
                aux.push(form.adjuntos[name].files[counter])
            }
        }
        if (aux.length < 1) {
            form.adjuntos[name].value = ''
        }
        form.adjuntos[name].files = aux
        this.setState({
            ...this.state,
            form
        })
    }
    changePageTable = () => {
        const { history } = this.props
        history.push({ pathname: '/rh/nomina-obras' });
    }
    render() {
        const { title, options, form, formeditado, data, nomina } = this.state
        return (
            <Layout active = 'rh' {...this.props}>
                <NominaObraFormulario title = { title } formeditado = { formeditado } className = " px-3 " options = { options } form = { form } 
                    onChange = { this.onChange }  onChangeRange = { this.onChangeRange } handleChange = { this.handleChange } nomina = { nomina }
                    onChangeAdjunto = { this.onChangeAdjunto } onChangeNominasObra = { this.onChangeNominasObra } usuarios = { data.usuarios }
                    addRowNominaObra = { this.addRowNominaObra } deleteRowNominaObra = { this.deleteRowNominaObra } onSubmit = { this.onSubmit } 
                    generarComprasAxios = { this.openModalCompras } formeditado = { formeditado } clearFiles={this.clearFiles} changePageTable={this.changePageTable}/>
            </Layout>
        )
    }

}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(NominaObraForm);