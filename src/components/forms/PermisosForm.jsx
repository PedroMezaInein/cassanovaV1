import React, { Component } from 'react'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { ToggleButton, Button } from '../form-components'
import { Accordion, Card } from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import { doneAlert, errorAlert, printResponseErrorAlert } from '../../functions/alert'
class PermisosForm extends Component {

    state = {
        toggle: false,
        grupos: null,
        activeKey: ''
    }

    constructor(props) {
        super(props)
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    handleAccordion = eventKey => {
        const { grupos } = this.state;
        const { activeKey } = this.state
        let aux = activeKey
        grupos.find(function (element, index) {
            if (element.name === eventKey && element.checked) {
                aux = eventKey
            }
            return false
        });
        this.setState({
            activeKey: aux
        })
    }

    handleGroupToggler = e => {
        const { name, checked } = e.target
        let { grupos, activeKey } = this.state
        if (!checked) {
            grupos.find(function (element, index) {
                if (element.name === name) {
                    grupos[index].checked = false
                    grupos[index].modulos.map((modulo) => {
                        return modulo.checked = false;
                    })
                }
                return false
            });
            this.setState({
                activeKey: activeKey === name ? '' : activeKey,
                grupos
            })
        } else {
            grupos.find(function (element, index) {
                if (element.name === name) {
                    grupos[index].checked = true
                }
                return false
            });
            this.setState({
                activeKey: !checked ? activeKey : name,
                grupos
            })
        }
    }

    handleCheckbox = (module) => (e) => {
        const { padre, name, checked } = module

        let { grupos } = this.state

        grupos.find(function (element, index) {
            if (element.name === padre) {
                let aux = false;
                element.modulos.find(function (element, index) {
                    if (element.name === name) {
                        element.checked = !checked
                    }
                    aux = element.checked || aux
                    return false
                })
                element.checked = aux
            }
            return false
        });

        this.setState({
            ...this.state,
            grupos: grupos
        })
    }

    setGrupos = grupos => {
        let { activeKey } = this.state
        activeKey = grupos[0].slug
        let auxActive = null
        let gruposObject = []
        grupos.map((grupo, key) => {
            let aux = true

            const { slug: slugGrupo, name: nombre, icon } = grupo
            let modulosObject = []
            grupo.modulos.map((modulo, key) => {
                const { slug, name: nombre, icon } = modulo
                if (modulo.permisos.length) {
                    modulosObject.push({ checked: true, padre: slugGrupo, name: slug, nombre: nombre, icon: icon })
                    aux = aux && true
                } else {
                    modulosObject.push({ checked: false, padre: slugGrupo, name: slug, nombre: nombre, icon: icon })
                    aux = aux && false
                }
                return false
            })
            if ((auxActive === null && aux)) {
                if (auxActive === null) {
                    auxActive = key
                }
            }
            gruposObject.push({ checked: aux, modulos: modulosObject, name: slugGrupo, nombre: nombre, icon: icon })
            return false
        })

        this.setState({
            ...this.state,
            grupos: gruposObject,
            activeKey: auxActive ? grupos[auxActive].slug : activeKey
        })
    }

    async componentDidMount() {
        const { authUser: { access_token }, history, user } = this.props
        if (!access_token)
            history.push('/login')
        await axios.get(`${URL_DEV}modulos/user/${user}`, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { modulos: grupos } } = response
                this.setGrupos(grupos);
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    handleSubmit = e => {
        e.preventDefault();
        const { grupos } = this.state
        const { user } = this.props
        this.setPermisosAxios(user, grupos);
    }

    async setPermisosAxios(user, data) {
        const { authUser: { access_token }, history, handleClose } = this.props
        if (!access_token)
            history.push('/login')
        await axios.put(`${URL_DEV}modulos/user/${user}`, { grupos: data }, { headers: { Authorization: `Bearer ${access_token}`, } }).then(
            (response) => {
                const { data: { modulos: grupos } } = response
                this.setGrupos(grupos);
                handleClose();
                doneAlert(response.data.message !== undefined ? response.data.message : 'Actualizaste los permisos.',)
            },(error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    render() {
        const { grupos, activeKey } = this.state

        return (
            <form onSubmit={this.handleSubmit}>
                <Accordion activeKey={activeKey} className="accordion accordion-light">
                    {
                        grupos !== null && grupos.map((grupo, key) => {
                            return (
                                <div key={key}>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey={grupo.name} onClick={() => this.handleAccordion(grupo.name)}>
                                            <div className="d-flex align-items-center">
                                                <ToggleButton
                                                    {...grupo}
                                                    onToggle={(e) => this.handleGroupToggler(e)}
                                                    leftBG={"#ECF0F3"}
                                                    rightBG={"#ECF0F3"}
                                                    borderColor={"#ECF0F3"}
                                                    leftKnobColor={"#FFF"}
                                                    rightKnobColor={"#2171c1"}
                                                />
                                                
                                                <div className="card-title collapsed pl-2">{grupo.nombre}</div>

                                            </div>
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey={grupo.name}>
                                            <Card.Body className="bg-light">
                                                <div className="row mx-0 mt-2 d-flex justify-content-center">
                                                    {
                                                        grupo.modulos.map((modulo, key) => {
                                                            return (
                                                                <div key={key} className="col-md-3 pt-4 px-3">
                                                                    <div className="text-center">
                                                                        <span className="font-size-sm font-weight-bold mb-1">{modulo.nombre}</span>
                                                                    </div>
                                                                    <div className="d-flex justify-content-center">
                                                                        <Form.Group>
                                                                            <div className="checkbox-list">
                                                                                <label className="checkbox checkbox-outline checkbox-outline-2x checkbox-primary">
                                                                                    <input
                                                                                        name={modulo.name}
                                                                                        type="checkbox"
                                                                                        checked={modulo.checked}
                                                                                        onChange={this.handleCheckbox(modulo)}
                                                                                    />
                                                                                    <span></span>
                                                                                </label>
                                                                            </div>
                                                                        </Form.Group>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                    <div className="separator separator-solid"></div>
                                </div>
                            )
                        })
                    }
                </Accordion>
                <div className="d-flex justify-content-center my-3">
                    <Button icon='' type="submit" text='CONFIRMAR' className={"btn btn-light-primary font-weight-bolder mr-3 pr-4"} />
                </div>
            </form>
        )
    }
}

export default PermisosForm