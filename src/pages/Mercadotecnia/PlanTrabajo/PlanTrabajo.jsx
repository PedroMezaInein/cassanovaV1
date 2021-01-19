import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearchGray } from '../../../components/form-components'
// import SelectSearchGray from '../../../components/form-components/Gray/SelectSearchGray'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class PlanTrabajo extends Component{

    state = {
        form:{
            mes: '',
            año: new Date().getFullYear(),
        },
        data: [],
        options: [
            
        ]
    }

    componentDidMount(){
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
    }

    getMeses = () => {
        return [
            { name: 'Enero', value: 'Enero' },
            { name: 'Febrero', value: 'Febrero' },
            { name: 'Marzo', value: 'Marzo' },
            { name: 'Abril', value: 'Abril' },
            { name: 'Mayo', value: 'Mayo' },
            { name: 'Junio', value: 'Junio' },
            { name: 'Julio', value: 'Julio' },
            { name: 'Agosto', value: 'Agosto' },
            { name: 'Septiembre', value: 'Septiembre' },
            { name: 'Octubre', value: 'Octubre' },
            { name: 'Noviembre', value: 'Noviembre' },
            { name: 'Diciembre', value: 'Diciembre' }
        ]
    }
    onChange = event => {
        const { name, value } = event.target
        const { form } = this.state
        form[name] = value
        this.setState({
            ...this.setState({
                form
            })
        })
    }
    diasEnUnMes(mes, año) {
        var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return new Date(año, meses.indexOf(mes) + 1, 0).getDate();
    }
    updateMes = value => {
        this.onChange({ target: { value: value, name: 'mes' } })
    }
    getAños = ()  => {
        var fecha = new Date().getFullYear()
        var arreglo = [];
        for(let i = 0; i < 10; i++)
            arreglo.push(
                {
                    name: fecha - i,
                    value: fecha - i
                }
            );
        return arreglo
    }
    updateAño = value => {
        this.onChange({ target: { value: value, name: 'año' } })
    }
    render(){
        const { form } = this.state
        return(
            <Layout active = 'mercadotecnia' { ... this.props}>
                <Card className = 'card-custom'>
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column">
                                <span className="font-weight-bolder text-dark">
                                    Plan de trabajo
                                </span>
                            </h3>
                        </div>
                        <div className="card-toolbar align-items-center">
                            <div className = 'mr-3 d-flex'>
                                <SelectSearchGray name = 'mes' options = { this.getMeses() } value = { form.mes }
                                    onChange = { this.updateMes } iconclass = "fas fa-calendar-day"
                                    messageinc = "Incorrecto. Selecciona el mes." requirevalidation={1}/>
                            </div>
                            <div className = 'mr-3 d-flex'>
                                <SelectSearchGray
                                    name = 'año'
                                    options = { this.getAños() }
                                    value = { form.año }
                                    onChange = { this.updateAño }
                                    iconclass = "fas fa-calendar-day"
                                />
                            </div>
                            <Button icon = '' className = 'btn btn-light-success btn-sm font-weight-bold' 
                                only_icon = 'flaticon2-writing pr-0 mr-2' text = 'Agendar plan'
                                onClick = { console.log('Parrilla de contenido') } />
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="table-responsive-xl">
                            <table className="table table-responsive">
                                <thead className="text-center">
                                    <tr>
                                        <th>Empresa</th>
                                        {
                                            (
                                                () => {
                                                    const th = [];

                                                    for (let i = 1; i <= this.diasEnUnMes(form.mes,form.año); i++) {
                                                        th.push(<th key={i}>{i}</th>);
                                                    }
                                                    return th;
                                                }
                                            )
                                            ()
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th>Inein</th>
                                        {
                                            (
                                                () => {
                                                    const td = [];
                                                    for (let i = 1; i <= this.diasEnUnMes(form.mes, form.año); i++) {
                                                        td.push(<td key={i}></td>);
                                                    }
                                                    return td;
                                                }
                                            )
                                            ()
                                        }
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </Card.Body>
                </Card>
            </Layout>
        )
    }

}

const mapStateToProps = (state) => { return { authUser: state.authUser } }
const mapDispatchToProps = (dispatch) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(PlanTrabajo)
