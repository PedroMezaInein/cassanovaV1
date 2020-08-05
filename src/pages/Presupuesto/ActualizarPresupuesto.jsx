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
            conceptos: {}
        },
        options: {
            proyectos: [],
            empresas: [],
            areas: [],
            partidas: [],
            subpartidas: [],
        },
        data: {
            partidas: [],
            subpartidas: [],
            conceptos: []
        },
    };

    componentDidMount() {
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
            return pathname === url + "/" + "update";
        });

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
                    const { empresas, proyectos, areas, partidas, conceptos } = response.data;
                    const { options, data, form } = this.state;
                    data.partidas = partidas
                    let aux = {}
                    conceptos.map((concepto) => {
                        aux[concepto.clave] = false
                    })
                    form.conceptos = aux;
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

    async addPresupuestosAxios() {
        const { access_token } = this.props.authUser
        const { form } = this.state
        const data = new FormData();

        await axios.post(URL_DEV + 'presupuesto', data, { headers: { Accept: '*/*', 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                this.setState({
                    ... this.state,
                    modal: false,
                    form: this.clearForm()
                })
                swal({
                    title: '¡Felicidades 🥳!',
                    text: response.data.message !== undefined ? response.data.message : 'El egreso fue registrado con éxito.',
                    icon: 'success',
                    timer: 1500,
                    buttons: false,
                })
                const { history } = this.props
                history.push({
                    pathname: '/presupuesto/presupuesto'
                });
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

    onChange = (e) => {
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

    checkButton = e => {
        const { name, value, checked } = e.target
        const { form } = this.state
        form.conceptos[name] = checked
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
        const { form, title, options, formeditado, data } = this.state;
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <ActualizarPresupuestoForm
                    formeditado={formeditado}
                    title={title}
                    form={form}
                    onChange={this.onChange}
                    checkButton={this.checkButton}
                    options={options}
                    setOptions={this.setOptions}
                    onSubmit={this.onSubmit}
                    data={data}
                /* {... this.props} */
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
