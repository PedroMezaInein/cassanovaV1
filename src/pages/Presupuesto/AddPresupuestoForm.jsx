import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import { URL_DEV } from "../../constants";
import { setOptions, setSelectOptions } from "../../functions/setters";
import {
    errorAlert,
    waitAlert,
    forbiddenAccessAlert,
    createAlert,
} from "../../functions/alert";
import Layout from "../../components/layout/layout";
import { PresupuestoForm } from "../../components/forms";
import { Card } from "react-bootstrap";

class AddPresupuestoForm extends Component {
    state = {
        formeditado: 0,
        modal: {
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: "Nuevo presupuesto",
        form: {
            proyecto: "",
            area: "",
            empresa: "",
            fecha: new Date(),
            tiempo_ejecucion: "",
            partida: "",
            subpartida: "",
        },
        options: {
            proyectos: [],
            empresas: [],
            areas: [],
            partidas: [],
            subpartidas: [],
        },
    };

    componentDidMount() {
        var elemento = document.getElementById("form-presupuesto");
        elemento.style.display = 'none';
        
        const {
            authUser: {
                user: { permisos: permisos },
            },
        } = this.props;
        const {
            history: {
                location: { pathname: pathname },
            },
        } = this.props;
        const {
            history,
            location: { state: state },
        } = this.props;

        const presupuesto = permisos.find(function (element, index) {
            const {
                modulo: { url: url },
            } = element;
            return pathname === url + "/" + "add";
        });
        // switch(action){
        //     case 'add':
        //         this.setState({
        //             ... this.state,
        //             title: 'Nuevo egreso',
        //             formeditado:0
        //         })
        //         break;
        //     case 'edit':
        //         if(state){
        //             if(state.egreso)
        //             {
        //                 const {  } = state
        //                 const { form, options } = this.state

        //                 this.setState({
        //                     ... this.state,
        //                     title: 'Editar egreso',
        //                     form,
        //                     options,
        //                     egreso: egreso,
        //                     formeditado:1
        //                 })
        //             }
        //             else
        //                 history.push('/administracion/egresos')
        //         }else
        //             history.push('/administracion/egresos')
        //         break;
        //     default:
        //         break;
        // }
        if (!presupuesto) history.push("/");
        this.getOptionsAxios();
    }

    setOptions = (name, array) => {
        const { options } = this.state;
        options[name] = setOptions(array, "nombre", "id");
        this.setState({
            ...this.state,
            options,
        });
    };

    async getOptionsAxios() {
        waitAlert();
        const { access_token } = this.props.authUser;
        await axios
            .get(URL_DEV + "presupuestos/options", {
                responseType: "json",
                headers: {
                    Accept: "*/*",
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json;",
                    Authorization: `Bearer ${access_token}`,
                },
            })
            .then(
                (response) => {
                    swal.close();
                    const { empresas, proyectos, areas, partidas } = response.data;
                    const { options } = this.state;
                    options["proyectos"] = setOptions(proyectos, "nombre", "id");
                    options["empresas"] = setOptions(empresas, "name", "id");
                    options["areas"] = setOptions(areas, "nombre", "id");
                    options["partidas"] = setOptions(partidas, "nombre", "id");

                    this.setState({
                        ...this.state,
                        options,
                    });
                },
                (error) => {
                    console.log(error, "error");
                    if (error.response.status === 401) {
                        forbiddenAccessAlert();
                    } else {
                        errorAlert(
                            error.response.data.message !== undefined
                                ? error.response.data.message
                                : "Ocurrió un error desconocido, intenta de nuevo."
                        );
                    }
                }
            )
            .catch((error) => {
                errorAlert("Ocurrió un error desconocido catch, intenta de nuevo.");
                console.log(error, "error");
            });
    }

    onChange = (e) => {
        const { name, value } = e.target;
        const { form } = this.state;
        form[name] = value;
        this.setState({
            ...this.state,
            form,
        });
    };

    render() {
        const { form, title, options, formeditado, data } = this.state;
        return (
            <Layout active={"presupuesto"} {...this.props}>

                <PresupuestoForm
                    formeditado={formeditado}
                    title={title}
                    form={form}
                    onChange={this.onChange}
                    options={options}
                    setOptions={this.setOptions}
                    onSubmit={this.onSubmit}
                    data={data}
                    {... this.props}
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

export default connect(mapStateToProps, mapDispatchToProps)(AddPresupuestoForm);
