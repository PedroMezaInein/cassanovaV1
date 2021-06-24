import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'
import Layout from '../../../components/layout/layout'
import { URL_DEV } from '../../../constants'
import { setFormHeader, setSingleHeader } from '../../../functions/routers'
import { doneAlert, errorAlert, printResponseErrorAlert, waitAlert } from '../../../functions/alert'
import { setOptions } from '../../../functions/setters'
import { NominaObraForm as NominaObraFormulario } from '../../../components/forms'
import readXlsxFile from 'read-excel-file'
class NominaObraForm extends Component {

    state = {
        data: { usuarios: [] },
        options: { usuarios: [], proyectos: [], empresas: [] },
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
            }
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
                const { proyectos, usuarios, empresas } = response.data
                const { options, data } = this.state
                data.usuarios = usuarios
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.usuarios = setOptions(usuarios, 'nombre', 'id')
                options.empresas = setOptions(empresas, 'name', 'id')
                this.setState({ ...this.state, options, data })
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
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
        await axios.post(`${URL_DEV}v2/rh/nomina-obra`, data, { responseType: 'json', headers: setFormHeader(access_token) }).then(
            (response) => {
                doneAlert('Nomina de obras guardad con éxito.')
                Swal.close()
                const { nomina } = response.data
                this.setState({...this.state, nomina: nomina})
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
                                    costo_hr_regular: row[10],
                                    costo_hr_nocturna: row[19],
                                    costo_hr_extra: row[22],
                                    total_hrs_regular: row[9],
                                    total_hrs_nocturna: row[18],
                                    total_hrs_extra: row[21],
                                    viaticos: row[23],
                                    nominImss: row[25],
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

    deleteRowNominaObra = async(nom, key) => {
        if(nom.id){
            waitAlert()
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
        else
            console.log('EDITAR')
    }
    
    render() {
        const { title, options, form, formeditado, data, nomina } = this.state
        return (
            <Layout active = 'rh' {...this.props}>
                <NominaObraFormulario title = { title } formeditado = { formeditado } className = " px-3 " options = { options } form = { form } 
                    onChange = { this.onChange }  onChangeRange = { this.onChangeRange } handleChange = { this.handleChange } nomina = { nomina }
                    onChangeAdjunto = { this.onChangeAdjunto } onChangeNominasObra = { this.onChangeNominasObra } usuarios = { data.usuarios }
                    addRowNominaObra = { this.addRowNominaObra } deleteRowNominaObra = { this.deleteRowNominaObra } onSubmit = { this.onSubmit } />
            </Layout>
        )
    }

}
const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })

export default connect(mapStateToProps, mapDispatchToProps)(NominaObraForm);