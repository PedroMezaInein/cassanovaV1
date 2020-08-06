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
            }
        }
        if (!presupuesto) history.push("/");
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
        const { title } = this.state
        waitAlert()
        this.addPresupuestosAxios()
    }

    render() {
        const { form, title, options, formeditado, presupuesto, modal } = this.state;
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
                        onChangeConceptos={this.onChangeConceptos}
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
