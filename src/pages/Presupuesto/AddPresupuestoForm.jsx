import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import swal from "sweetalert";
import { URL_DEV } from "../../constants";
import { setOptions } from "../../functions/setters";
import { errorAlert, waitAlert, forbiddenAccessAlert } from "../../functions/alert";
import Layout from "../../components/layout/layout";
import { PresupuestoForm } from "../../components/forms";
// import { save, deleteForm } from '../../redux/reducers/formulario'
// import FloatButtons from '../../components/singles/FloatButtons'

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
        data:{
            partidas: [],
            subpartidas: [],
            conceptos: []
        },
        conceptos: {}
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
                    const { empresas, proyectos, areas, partidas, conceptos } = response.data;
                    const { options, data, form } = this.state;
                    data.partidas = partidas
                    data.conceptos = conceptos
                    let aux = {}
                    conceptos.map( (concepto) => {
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

    onChange = (e) => {
        const { name, value } = e.target;
        const { data } = this.state
        switch(name){
            case 'partida':
                data.partidas.map( (partida) => {
                    if(partida.id.toString() === value){
                        data.subpartidas = partida.subpartidas
                    }
                })
            break;
            case 'subpartida':
                data.subpartidas.map( (subpartida) => {
                    if(subpartida.id.toString() === value){
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

        // console.log(data, 'Data on change')
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

    // save = () => {
    //     const { form } = this.state
    //     const { save } = this.props
    //     let auxObject = {}
    //     let aux = Object.keys(form)
    //     aux.map((element) => {
    //         auxObject[element] = form[element]
    //     })
    //     save({
    //         form: auxObject,
    //         page: 'presupuesto/presupuesto/add'
    //     })
    // }

    // recover = () => {
    //     const { formulario, deleteForm } = this.props
    //     this.setState({
    //         ... this.state,
    //         form: formulario.form
    //     })
    //     deleteForm()
    // }

    render() {
        const { form, title, options, formeditado, data } = this.state;
        // const { formulario, deleteForm } = this.props 
        return (
            <Layout active={"presupuesto"} {...this.props}>
                {/* <FloatButtons save = { this.save } recover =  { this.recover } formulario = { formulario } url = { 'presupuesto/presupuesto/add' } /> */}
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
