import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import { URL_DEV } from "../../constants";
import { setOptions } from "../../functions/setters";
import { errorAlert, waitAlert, forbiddenAccessAlert } from "../../functions/alert";
import Layout from "../../components/layout/layout";
import { ActualizarPresupuestoForm } from "../../components/forms";

class ActualizarPresupuesto extends Component {
    state = {
        formeditado: 0,
        form: {
            conceptos: [{
                descipcion: '',
                costo: '',
                cantidad_preliminar: '',
                desperdicio: '',
                active:true
            }]
        }
    };

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
                        active:true
                    })

                })

                form.conceptos = aux

                this.setState({
                    ... this.state,
                    presupuesto,
                    form,
                    formeditado: 1
                })
            }
        }
        if (!presupuesto) history.push("/");
    }

    onChange = (key, e, name) => {
        const { value } = e.target
        const { form} = this.state
        form['conceptos'][key][name] = value
        this.setState({
            ...this.state,
            form
        })
    }

    checkButton = (key, e) => {
        const { name, value, checked } = e.target
        const { form } = this.state

        console.log(form, 'FORM')

        form.conceptos[key][name] = checked
        
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
        const { form, title, options, formeditado, presupuesto } = this.state;
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <ActualizarPresupuestoForm
                    formeditado = { formeditado }
                    form = { form }
                    onChange = { this.onChange }
                    checkButton = { this.checkButton }
                    onSubmit = { this.onSubmit }
                    presupuesto = { presupuesto }
                    {...this.props}
                />
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
