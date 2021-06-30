import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../constants'
import { setOptions } from '../functions/setters'
import { errorAlert, printResponseErrorAlert } from '../functions/alert'
import * as animationData from '../assets/animate/error-404-page.json'
import Lottie from 'react-lottie';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux'
import $ from "jquery";
import { SelectSearchGray } from '../components/form-components'

class InicioMiProyecto extends Component {
    state = {
        options: {
            proyectos: []
        },
        form: {
            proyecto: '',
        },
        data: {
            proyectos: [],
            tickets: [],
            tiposTrabajo: []
        },
        proyecto: '',
    }
    getLink = () => {
        return '/leads/crm'
    }
    componentDidMount() {
        $("body").addClass('bg-white justify-content-center');
        this.getMiProyectoAxios()


    }
    async getMiProyectoAxios() {
        const { access_token, user } = this.props.authUser
        await axios.get(URL_DEV + 'proyectos/mi-proyecto', { headers: { Authorization: `Bearer ${access_token}` } }).then(
            (response) => {
                const { proyectos, partidas, tiposTrabajo } = response.data
                const { data, options, id } = this.state
                let { proyecto } = this.state
                options.proyectos = setOptions(proyectos, 'nombre', 'id')
                options.partidas = setOptions(partidas, 'nombre', 'id')

                data.tiposTrabajo = tiposTrabajo
                data.proyectos = proyectos

                if (id !== '') {
                    proyectos.map((proy) => {
                        if (proy.id === id) {
                            proyecto = proy
                        }
                        return false
                    })
                }

                if (id === '') {
                    if (user.tipo.tipo === 'Cliente') {
                        if (proyectos.length > 0) {
                            proyecto = proyectos[0]
                        }
                    }
                }

                this.setState({
                    ...this.state,
                    data,
                    options,
                    proyecto,
                })

            }, (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }
    updateProyecto = value => {
        this.onChange({ target: { value: value, name: 'proyecto' } })
    }
    onChange = e => {
        const { form } = this.state
        const { name, value } = e.target
        form[name] = value
        this.setState({
            ...this.state,
            form
        })
    }
    changePageEdit = proyecto => {
        console.log('edit', proyecto)
        const { history } = this.props
        history.push({
            pathname: '/mi-proyecto/ver-proyecto',
            state: { proyecto: proyecto}

        });
    }
    render() {
        const { options, form  } = this.state

        return (
            <div> 
                <div className="headerProyecto">
                    <a  href="https://infraestructuramedica.mx/" target="_blank" rel="noopener noreferrer">
                        <img src="/IM_color.png"  alt="IM" style={{backgroundSize:'contain', height:'auto', width:'17rem', backgroundRepeat:'no-repeat'}} />
                    </a>
                </div>
                {/* */}
                {/* d-flex align-items-center flex-direction-column */}
                <div className="row mx-0 col-md-12 row-paddingless text-transform-none ">
                    <div className="mx-0 col-md-6 d-flex align-items-center justify-content-center text-center">
                        <div className="px-4">
                            <div style={{fontSize:'40px'}}>
                                <div className="font-weight-bold text-im">IM Infraestructura Médica</div>
                                <div className="font-weight-lighter">
                                    Plaforma administrativa
                                </div>
                            </div>
                            <div className="d-block mt-10 col-md-8 mx-auto">
                                <SelectSearchGray
                                    options={options.proyectos}
                                    placeholder="SELECCIONE UN PROYECTO"
                                    name="proyecto"
                                    value={form.proyecto}
                                    onChange={this.updateProyecto}
                                    requirevalidation={0}
                                    customdiv="mb-0"
                                    withtaglabel={0}
                                    withtextlabel={0}
                                    withicon={1}
                                    iconvalid={1}
                                />
                            </div>
                            {
                                form.proyecto&&
                                <div className="mt-10">
                                    <a href="#" class="btn btn-light-im font-weight-bolder" onClick={(e) => {  e.preventDefault(); this.changePageEdit(e) }} >
                                        VER PROYECTO
                                    </a>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="row mx-0 col-md-6 row-paddingless d-flex align-items-center justify-content-center mt-15">
                        <div className="col-md-11">
                            <img class="img-fluid" src="/images/svg/Admin.svg" alt="alternative"/>
                        </div>
                    </div>
                </div>
                <div class="footerProyecto">
                    <a href="#" class="mx-4">
                        <img src="/images/svg/RedesSociales/Facebook.svg" class="h-30px my-2" alt="" />
                    </a>
                    <a href="#" class="mx-4">
                        <img src="/images/svg/RedesSociales/Instagram.svg" class="h-30px my-2" alt="" />
                    </a>
                    <a href="#" class="mx-4">
                        <img src="/images/svg/RedesSociales/Pinterest.svg" class="h-30px my-2" alt="" />
                    </a>
                </div>
            </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(InicioMiProyecto);