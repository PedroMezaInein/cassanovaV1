import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import Layout from '../../../components/layout/layout'
import { Card } from 'react-bootstrap'
import { URL_DEV } from '../../../constants'
import { Button, SelectSearch } from '../../../components/form-components'
import { errorAlert, forbiddenAccessAlert } from '../../../functions/alert'
import { getAños, getMeses } from '../../../functions/setters'

const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
class PlanTrabajo extends Component{

    state = {
        mes: meses[new Date().getMonth()],
        año: new Date().getFullYear().toString(),
        form:{
            mes: meses[new Date().getMonth()],
        },
        data: [],
    }

    componentDidMount(){
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        this.getContentAxios()
    }

    updateAño = value => {
        this.setState({...this.state, año: value })
    }

    updateMes = value => {
        this.setState({...this.state, mes: value})
    }

    isActiveNextButton = () => {
        const { mes, año } = this.state
        let esteAño = new Date().getFullYear()
        let esteMes = new Date().getMonth()
        if(esteMes > 9){
            if((esteAño + 1).toString() === año )
                if(mes === 'Diciembre')
                    return 'disabled'
        }else{
            if((esteAño).toString() === año )
                if(mes === 'Diciembre')
                    return 'disabled'
        }
        return 'enabled'
    }

    isActiveBackButton = () => {
        const { mes, año } = this.state
        let esteAño = new Date().getFullYear()
        let esteMes = new Date().getMonth()
        if(esteMes > 9){
            if((esteAño + 1).toString() === año )
                if(mes === 'Diciembre')
                    return 'disabled'
        }else{
            if((esteAño).toString() === año )
                if(mes === 'Diciembre')
                    return 'disabled'
        }
        return 'enabled'
    }

    nextMonth = () => {
        const { mes } = this.state
    }

    // ANCHOR ASYNC CALL TO GET CONTENT
    getContentAxios = async() => {
        const { access_token } = this.props.authUser
        const { mes } = this.state
        console.log(URL_DEV, "URL_DEV")
        await axios.get(`${URL_DEV}mercadotecnia/plan-trabajo/${mes}`, { headers: {Authorization: `Bearer ${access_token}`} } ).then(
            (response) => {
                
            },
            (error) => {
                console.log(error, 'error')
                if (error.response.status === 401) { forbiddenAccessAlert() } 
                else { errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.') }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        }) 
    }
    
    render(){
        const { mes, año } = this.state
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
                                <SelectSearch name = 'mes' options = { getMeses() } value = { mes }
                                    onChange = { this.updateMes } iconclass = "fas fa-calendar-day"
                                    messageinc = "Incorrecto. Selecciona el mes." />
                            </div>
                            <div className = 'd-flex'>
                                <SelectSearch name = 'mes' options = { getAños() } value = { año }
                                    onChange = { this.updateAño } iconclass = "fas fa-calendar-day"
                                    messageinc = "Incorrecto. Selecciona el año." />
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className = 'd-flex justify-content-between'>
                            <div>
                                {`${mes} ${año}`}
                            </div>
                            <div>
                                <div class="btn-group">
                                    <button class={`fc-prev-button btn btn-primary ${this.isActiveBackButton()}`} type="button" aria-label="prev">
                                        <span class="fa fa-chevron-left"></span>
                                    </button>
                                    <button class={`fc-next-button btn btn-primary ${this.isActiveNextButton()}`} type="button" aria-label="next"
                                        onClick = { this.nextMonth }>
                                        <span class="fa fa-chevron-right"></span>
                                    </button>
                                </div>
                            </div>
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