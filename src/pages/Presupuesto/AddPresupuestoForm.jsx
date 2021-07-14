import React, { Component } from "react"
import { connect } from "react-redux"
import axios from "axios"
import Swal from 'sweetalert2'
import { URL_DEV } from "../../constants"
import { setOptions } from "../../functions/setters"
import { errorAlert, waitAlert, printResponseErrorAlert, doneAlert } from "../../functions/alert"
import Layout from "../../components/layout/layout"
import { PresupuestoForm } from "../../components/forms"
class AddPresupuestoForm extends Component {
    state = {
        formeditado: 0,
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
        const { authUser: { user: { permisos } } } = this.props;
        const { history: { location: { pathname } } } = this.props;
        const { history } = this.props;
        const presupuesto = permisos.find(function (element, index) {
            const { modulo: { url } } = element;
            return pathname === url + "/add";
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
                    Swal.close();
                    const { empresas, proyectos, areas, partidas, conceptos } = response.data;
                    const { options, data, form } = this.state;
                    data.partidas = partidas
                    let aux = {}
                    conceptos.map((concepto) => {
                        return aux[concepto.clave] = false
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
                printResponseErrorAlert(error)
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
        await axios.post(URL_DEV + 'presupuestos', form, { headers: { Accept: '*/*', Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { presupuesto } = response.data
                doneAlert(response.data.message !== undefined ? response.data.message : 'El presupuesto fue registrado con éxito.')
                const { history } = this.props
                history.push({
                    pathname: '/presupuesto/presupuesto/update',
                    state: { presupuesto: presupuesto }
                });
            },
            (error) => {
                printResponseErrorAlert(error)
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
                    return false
                })
                break;
            case 'subpartida':
                data.subpartidas.map((subpartida) => {
                    if (subpartida.id.toString() === value) {
                        data.conceptos = subpartida.conceptos
                    }
                    return false
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
        const { name, checked } = e.target
        const { form } = this.state
        form.conceptos[name] = checked
        this.setState({
            ...this.state,
            form
        })
    }
    onSubmit = e => {
        e.preventDefault()
        waitAlert()
        this.addPresupuestosAxios()
    }
    render() {
        const { form, title, options, formeditado, data } = this.state;
        return (
            <Layout active={"presupuesto"} {...this.props}>
                <PresupuestoForm
                    formeditado={formeditado}
                    title={title}
                    form={form}
                    onChange={this.onChange}
                    checkButton={this.checkButton}
                    options={options}
                    setOptions={this.setOptions}
                    onSubmit={this.onSubmit}
                    data={data}
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
