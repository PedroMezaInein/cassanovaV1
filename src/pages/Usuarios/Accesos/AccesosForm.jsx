import React, { Component } from 'react'
import Layout from '../../../components/layout/layout'
import Swal from 'sweetalert2'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../../constants'
import { AccesosForm as AccesosFormulario } from '../../../components/forms'
import { Card } from 'react-bootstrap'
import { errorAlert, printResponseErrorAlert, waitAlert, createAlert, questionAlert } from '../../../functions/alert'
import { setSelectOptions } from '../../../functions/setters'
import { ItemSlider, Modal } from '../../../components/singles'
import { Button } from '../../../components/form-components'
import readXlsxFile from 'read-excel-file'
class AccesosForm extends Component {

    state = {
        modal_add_excel: false,
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
        options: {
            usuarios: [],
            empresas: [],
            departamentos: []
        },
        editables: {
            usuarios: [],
            empresas: []
        }
    }
    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { match: { params: { action } } } = this.props
        const { history, location: { state } } = this.props
        const accesos = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url + '/' + action
        });
        switch (action) {
            case 'add':
                this.setState({
                    ...this.state,
                    title: 'Nuevo acceso',
                    formeditado: 0
                })
                break;
            case 'edit':
                if (state) {
                    if (state.acceso) {
                        const { acceso } = state
                        const { form, options, editables } = this.state
                        form.plataforma = acceso.plataforma
                        form.url = acceso.url
                        form.usuario = acceso.usuario
                        form.contraseña = acceso.contraseña
                        editables.usuarios = acceso.usuarios
                        form.correo = acceso.correo
                        form.numero = acceso.numero
                        editables.empresas = acceso.empresas
                        form.descripcion = acceso.descripcion
                        this.setState({
                            ...this.state,
                            title: 'Editar acceso',
                            acceso: acceso,
                            form,
                            options,
                            formeditado: 1,
                            editables
                        })
                    }
                    else
                        history.push('/usuarios/accesos')
                } else
                    history.push('/usuarios/accesos')
                break;
            default:
                break;
        }
        if (!accesos)
            history.push('/')
        this.getOptionsAxios()
    }

    sendPlantilla = async(item) => {
        let arreglo = []
        if(item.files.length === 1){
            readXlsxFile(item.files[0].file).then((rows) => {
                rows.map((row, index)=>{
                    if(index > 0){
                        arreglo.push({
                            empresas: row[0],
                            plataforma: row[1],
                            url: row[2],
                            usuario: row[3],
                            contraseña: row[4],
                            usuarios: row[5],
                            correo: row[6],
                            numero: row[7],
                            descripcion: row[8]
                        })
                    }
                    return false
                })
                if(arreglo.length > 0) this.sendPlantillaAxios(arreglo)
                else errorAlert('Adjunta la plantilla correcta')
            })
        }else
            errorAlert('Adjunta la plantilla correcta')
            
    }

    sendPlantillaAxios = async(arreglo) => {
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'accesos/excel', {data: arreglo}, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { history } = this.props
                history.push({pathname: '/usuarios/accesos'});
            },
            (error) => {
                this.setState({
                    ...this.state,
                    form: this.clearForm(),
                })
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            this.setState({
                ...this.state,
                form: this.clearForm(),
            })
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async getOptionsAxios() {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'accesos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { usuarios, empresas } = response.data
                const { options, editables, form } = this.state
                options['usuarios'] = setSelectOptions(usuarios, 'name', 'id')
                options['empresas'] = setSelectOptions(empresas, 'name', 'id')
                // options.departamentos = []
                // departamentos.forEach( ( element ) => {
                //     options.departamentos.push({
                //         name: element.nombre,
                //         value: element.id.toString(),
                //         label: element.nombre
                //     })
                // });
                let auxArray = []
                options.usuarios.map((element)=>{
                    let bandera = false
                    editables.usuarios.map((usuario)=>{
                        if(element.value.toString() === usuario.id.toString())
                            bandera = usuario
                        return ''
                    })
                    if(bandera !== false){
                        form.usuarios.push(
                            {
                                value: bandera.id.toString(),
                                target: bandera.name,
                                text: bandera.name
                            }
                        )
                    }
                    else
                        auxArray.push(element)
                    return false
                })
                if(editables.usuarios.length)
                    options.usuarios = auxArray
                auxArray = []
                options.empresas.map((element)=>{
                    let bandera = false
                    editables.empresas.map((empresa)=>{
                        if(element.value.toString() === empresa.id.toString())
                            bandera = empresa
                        return ''
                    })
                    if(bandera !== false){
                        form.empresas.push(
                            {
                                value: bandera.id.toString(),
                                target: bandera.name,
                                text: bandera.name
                            }
                        )
                    }
                    else
                        auxArray.push(element)
                    return false
                })
                if(editables.empresas.length)
                    options.empresas = auxArray
                this.setState({
                    ...this.state,
                    options,
                    editables,
                    form
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

    onSubmit = async() => {
        waitAlert()
        const { form } = this.state
        const { access_token } = this.props.authUser
        await axios.post(URL_DEV + 'accesos', form, { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { history } = this.props
                history.push({pathname: '/usuarios/accesos'});
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onSubmitEdit = async() => {
        waitAlert()
        const { form, acceso } = this.state
        const { access_token } = this.props.authUser
        await axios.put(URL_DEV + 'accesos/'+acceso.id, form, { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                Swal.close()
                const { history } = this.props
                history.push({pathname: '/usuarios/accesos'});
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    deleteOption = (option, arreglo) => {
        const { form, options } = this.state
        let aux = []
        form[arreglo].map((element, key) => {
            if (option.value.toString() !== element.value.toString())
                aux.push(element)
            else
                options[arreglo].push(element)
            return false
        })
        form[arreglo] = aux
        this.setState({
            ...this.state,
            options,
            form
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    onChangeAndAdd = (e, arreglo) => {
        const { value } = e.target
        const { options, form } = this.state
        let auxArray = form[arreglo]
        let aux = []
        options[arreglo].find(function (_aux) {
            if (_aux.value.toString() === value.toString())
                auxArray.push(_aux)
            else
                aux.push(_aux)
            return false
        })
        options[arreglo] = aux
        form[arreglo] = auxArray
        this.setState({
            ...this.state,
            form,
            options
        })
    }

    onChangeEmpresa = empresa => {
        const { options, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        options.empresas.find(function (_aux) {
            if (_aux.value.toString() === empresa.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
            return false
        })
        options.empresas = aux
        form['empresas'] = auxEmpresa
        this.setState({
            ...this.state,
            form,
            options
        })
    }

    updateEmpresa = empresa => {
        const { form, options } = this.state
        let aux = []
        form.empresas.map((element, key) => {
            if (empresa.value.toString() !== element.value.toString()) {
                aux.push(element)
            } else {
                options.empresas.push(element)
            }
            return false
        })
        form.empresas = aux
        this.setState({
            ...this.state,
            options,
            form
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

    openModal = () => {
        this.setState({
            ...this.state,
            modal_add_excel: true,
            title: 'Agregar accesos',
            form: this.clearForm(),
            formeditado: 0
        })
    }
    handleCloseAddExcel = () => {
        const { modal_add_excel } = this.state
        this.setState({
            ...this.state,
            modal_add_excel: !modal_add_excel,
            title: 'Agregar accesos',
            form: this.clearForm()
        })
    }

    handleChange = (files, item) => {
        const { form } = this.state
        let aux = []
        for (let counter = 0; counter < files.length; counter++) {
            aux.push(
                {
                    name: files[counter].name,
                    file: files[counter],
                    url: URL.createObjectURL(files[counter]),
                    key: counter
                }
            )
        }
        form['adjuntos'][item].value = files
        form['adjuntos'][item].files = aux
        questionAlert('¿DESEAS ENVIAR LA PLANTILLA?', '', () => this.sendPlantilla(form.adjuntos[item]))
        this.setState({
            ...this.state,
            form
        })
    }
    downloadPlantilla = () => {
        const link = document.createElement('a');
        const url = 'https://admin-proyectos.s3.us-east-2.amazonaws.com/plantillas/plantilla-acceso.xlsx'
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    render() {
        const { form, title, formeditado, options, modal_add_excel } = this.state
        return (
            <Layout active={'usuarios'} {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">{title}</h3>
                        </div>
                        <div className="card-toolbar">
                            <Button
                                icon=''
                                className="btn btn-light-success btn-sm mr-2"
                                only_icon="far fa-file-pdf pr-0 mr-2"
                                text='AGREGAR ACCESO'
                                onClick={this.openModal}
                            />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <AccesosFormulario form = { form } formeditado = { formeditado } options = { options } 
                            onChange = { this.onChange } onChangeAndAdd = { this.onChangeAndAdd } deleteOption = { this.deleteOption }
                            onChangeEmpresa = { this.onChangeEmpresa } updateEmpresa = { this.updateEmpresa } 
                            onSubmit = { title === 'Editar acceso' ? this.onSubmitEdit : this.onSubmit } />
                    </Card.Body>
                </Card>
                <Modal size='lg' title={title} show={modal_add_excel} handleClose={this.handleCloseAddExcel}>
                    <div className="d-flex mt-3 justify-content-end">
                        <Button
                            onClick={(e) => {
                                e.preventDefault();
                                createAlert('¡IMPORTANTE!', 'LAS EMPRESAS Y LOS RESPONSABLES TIENEN QUE ESTAR EN MAYÚSCULAS Y SEPARADOS POR COMAS.', () => this.downloadPlantilla())
                            }}
                            className="btn btn-light-primary btn-sm ml-auto"
                            only_icon="fas fa-file-download icon-md"
                            text='DESCARGAR PLANTILLA'
                        />
                    </div>
                    <div>
                        <ItemSlider
                            items={form.adjuntos.adjuntos.files}
                            item='adjuntos'
                            multiple={false}
                            handleChange={this.handleChange}
                            accept='.xlsx, .xls, .csv'
                        />
                    </div>
                    {/* {
                        form.adjuntos.adjuntos.files.length > 0 ?
                            <div className="d-flex justify-content-center">
                                <Button icon='' className="btn btn-primary m-2"
                                    onClick={
                                        (e) => {
                                            e.preventDefault();
                                            waitAlert();
                                            this.sendVacaciones();
                                        }
                                    }
                                    text="ENVIAR"
                                />
                            </div>
                            : ''
                    } */}
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

export default connect(mapStateToProps, mapDispatchToProps)(AccesosForm);