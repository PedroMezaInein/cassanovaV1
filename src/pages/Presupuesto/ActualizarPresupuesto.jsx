import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import { URL_DEV } from "../../constants";
import { setOptions } from "../../functions/setters";
import { errorAlert, waitAlert, forbiddenAccessAlert } from "../../functions/alert";
import Layout from "../../components/layout/layout";
import { ActualizarPresupuestoForm, AgregarConcepto } from "../../components/forms";
import { Modal } from '../../components/singles'
class ActualizarPresupuesto extends Component {
    state = {
        formeditado: 0,
        modal: false,
        presupuesto: '',
        form: {
            unidad: '',
            partida: '',
            subpartida: '',
            descripcion: '',
            costo: '',
            proveedor: '',
            conceptos: [{
                descipcion: '',
                costo: '',
                cantidad_preliminar: '',
                desperdicio: '',
                active:true,
                cantidad: 0,
                importe: 0,
                id: '',
                mensajes:{
                    active: false,
                    mensaje: ''
                }
            }]
        },
        options: {
            unidades: [],
            partidas: [],
            subpartidas: [],
            proveedores: [],
        },
        data: {
            partidas: [],
            subpartidas: [],
            conceptos: [],
            conceptosNuevos: []
        },
    };

    openModal = () => {
        const { options } = this.state
        options.subpartidas = []
        this.setState({
            ... this.state,
            options,
            modal: true,
            title: 'Agregar concepto',
            form: this.clearForm(),
            formeditado: 0
        })
    }

    clearForm = () => {
        const { form } = this.state
        let aux = Object.keys(form)
        aux.map((element) => {
            if(element !== 'conceptos')
                form[element] = ''
        })
        return form
    }


    handleClose = () => {
        const { modal, options } = this.state
        options.subpartidas = []
        this.setState({
            ... this.state,
            modal: !modal,
            options,
            title: 'Agregar concepto',
            concepto: '',
            form: this.clearForm()
        })
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props;
        const { history: { location: { pathname: pathname } } } = this.props;
        const { history, location: { state: state } } = this.props;

        const presupuesto = permisos.find(function (element, index) {
            const {
                modulo: { url: url },
            } = element;
            return pathname === url + "/" + "update";
        });

        if (state) {
            if (state.presupuesto) {
                const { presupuesto } = state
                const { form } = this.state

                this.getOnePresupuestoAxios(presupuesto.id);

                /* let aux = []
                presupuesto.conceptos.map((concepto) => {
                    aux.push({
                        descripcion: concepto.descripcion,
                        costo: concepto.costo,
                        cantidad_preliminar: concepto.cantidad_preliminar,
                        desperdicio: concepto.desperdicio,
                        cantidad: concepto.cantidad_preliminar * ( 1  + (concepto.desperdicio/100)),
                        importe: (concepto.cantidad_preliminar * ( 1  + (concepto.desperdicio/100))) * concepto.costo,
                        active: concepto.active ? true : false,
                        id: concepto.id, 
                        mensajes:{
                            active: false,
                            mensaje: ''
                        }
                    })

                })

                form.conceptos = aux

                this.setState({
                    ... this.state,
                    presupuesto: presupuesto,
                    form,
                    formeditado: 1
                }) */
            }
        }
        if (!presupuesto) history.push("/");
        this.getOptionsAxios()
    }

    async getOptionsAxios() {
        waitAlert()
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/options', { responseType: 'json', headers: { Accept: '*/*', 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json;', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                swal.close() 
                const { empresas, proyectos, areas, partidas, proveedores, unidades, conceptos} = response.data
                const { options, data, form} = this.state 

                data.partidas = partidas
                let aux = {}
                conceptos.map((concepto) => {
                    aux[concepto.clave] = false
                })
                options['proyectos'] = setOptions(proyectos, 'nombre', 'id')
                options['empresas'] = setOptions(empresas, 'name', 'id')
                options['areas'] = setOptions(areas, 'nombre', 'id')
                options['partidas'] = setOptions(partidas, 'nombre', 'id')
                options['proveedores'] = setOptions(proveedores, 'razon_social', 'id')
                options['unidades'] = setOptions(unidades, 'nombre', 'id')

                this.setState({
                    ... this.state,
                    options
                })
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    setOptions = (name, array) => {
        const { options } = this.state
        options[name] = setOptions(array, 'nombre', 'id')
        this.setState({
            ... this.state,
            options
        })
    }

    onChangeConceptos = (e) => {
        const { name, value } = e.target;
        const { data } = this.state
        switch (name) {
            case 'partida':
                data.partidas.map((partida) => {
                    data.conceptos = []
                    if (partida.id.toString() === value) {
                        data.subpartidas = partida.subpartidas
                    }
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
                })
                break;
            default:
                break;
        }

        const { form } = this.state;
        form[name] = value;
        this.setState({
            ...this.state,
            form,
            data
        });
    };

    // onChangeConceptos = e => {
    //     const { form } = this.state
    //     const { name, value } = e.target
    //     form[name] = value
    //     this.setState({
    //         ... this.state,
    //         form
    //     })
    // }
    checkButtonConceptos = e => {
        const { name, value, checked } = e.target
        const { form } = this.state
        form.conceptos[name] = checked
        this.setState({
            ... this.state,
            form
        })
    }
    
    onChange = (key, e, name) => {
        let { value } = e.target
        const { form, presupuesto } = this.state

        
        if(name === 'desperdicio'){
            value = value.replace('%', '')
        }
        form['conceptos'][key][name] = value
        let cantidad = form['conceptos'][key]['cantidad_preliminar'] * (1 + (form['conceptos'][key]['desperdicio']/100))
        cantidad = cantidad.toFixed(2)
        let importe = cantidad * form['conceptos'][key]['costo']
        importe = importe.toFixed(2)
        form['conceptos'][key]['cantidad'] = cantidad
        form['conceptos'][key]['importe'] = importe
        if(name !== 'mensajes' && name !== 'desperdicio')
            if(presupuesto.conceptos[key][name] !== form.conceptos[key][name]){
                form.conceptos[key].mensajes.active = true
            }else{
                form.conceptos[key].mensajes.active = false
            }
        if(name === 'desperdicio')
            if(presupuesto.conceptos[key][name].toString() !== form.conceptos[key][name].toString()){
                form.conceptos[key].mensajes.active = true
                let aux = value ? value : 0
                form.conceptos[key].mensajes.mensaje = ('Actualización del desecho a un '+ value + '%').toUpperCase()
            }else{
                form.conceptos[key].mensajes.active = false
                form.conceptos[key].mensajes.mensaje = ''
            }
        this.setState({
            ...this.state,
            form
        })
    }

    checkButton = (key, e) => {
        const { name, value, checked } = e.target
        const { form, presupuesto } = this.state

        form.conceptos[key][name] = checked
        
        if(!checked){
            let pre = presupuesto.conceptos[key]
            let aux = { active: false, mensaje: '' }
            this.onChange(key, {target:{value: pre.descripcion}}, 'descripcion')
            this.onChange(key, {target:{value: pre.costo}}, 'costo')
            this.onChange(key, {target:{value: pre.cantidad_preliminar}}, 'cantidad_preliminar')
            this.onChange(key, {target:{value: '$'+pre.desperdicio}}, 'desperdicio')
            this.onChange(key, {target:{value: aux}}, 'mensajes')
        }
        
        this.setState({
            ... this.state,
            form
        })
    }

    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.updatePresupuestosAxios()
    }

    async getOnePresupuestoAxios(id) {
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'presupuestos/' + id, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { form } = this.state
                const { presupuesto } = response.data
                
                let aux = []
                presupuesto.conceptos.map((concepto) => {
                    aux.push({
                        descripcion: concepto.descripcion,
                        costo: concepto.costo,
                        cantidad_preliminar: concepto.cantidad_preliminar,
                        desperdicio: concepto.desperdicio,
                        cantidad: concepto.cantidad_preliminar * ( 1  + (concepto.desperdicio/100)),
                        importe: (concepto.cantidad_preliminar * ( 1  + (concepto.desperdicio/100))) * concepto.costo,
                        active: concepto.active ? true : false,
                        id: concepto.id, 
                        mensajes:{
                            active: false,
                            mensaje: ''
                        }
                    })

                })

                form.conceptos = aux

                this.setState({
                    ... this.state,
                    presupuesto: presupuesto,
                    form,
                    formeditado: 1
                })

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    async updatePresupuestosAxios() {
        const { access_token } = this.props.authUser
        const { form, presupuesto } = this.state

        await axios.put(URL_DEV + 'presupuestos/' + presupuesto.id, form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {

                const { presupuesto } = response.data
                const { form } = this.state

                form.conceptos.map( (concepto) => {
                    concepto.mensajes = {
                        active: false,
                        mensaje: ''
                    }
                })

                this.setState({
                    ... this.state,
                    presupuesto: presupuesto,
                    form
                })

                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El ingreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false
                })

            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) {
                    forbiddenAccessAlert()
                } else {
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    render() {
        const { form, title, options, formeditado, presupuesto, modal, data } = this.state;
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <ActualizarPresupuestoForm
                    formeditado={formeditado}
                    form={form}
                    onChange={this.onChange}
                    checkButton={this.checkButton}
                    onSubmit={this.onSubmit}
                    presupuesto={presupuesto}
                    openModal={this.openModal}
                    {...this.props}
                />
                <Modal size="xl" title={title} show={modal} handleClose={this.handleClose}>
                    <AgregarConcepto
                        options={options}
                        formeditado={formeditado}
                        form={form}
                        onChange={this.onChangeConceptos}
                        setOptions={this.setOptions}
                        checkButtonConceptos={this.checkButtonConceptos}
                        data={data}
                    />
                </Modal>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser,
    };
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(ActualizarPresupuesto);
