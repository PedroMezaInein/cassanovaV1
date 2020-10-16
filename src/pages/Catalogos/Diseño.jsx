import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { URL_DEV } from '../../constants'
import { setSelectOptions} from '../../functions/setters'
import { waitAlert, errorAlert, forbiddenAccessAlert, doneAlert } from '../../functions/alert'
import Layout from '../../components/layout/layout'
import { Card, Nav, Tab } from 'react-bootstrap'
import { DiseñoForm } from '../../components/forms'
import {Line} from 'react-chartjs-2';

class Contabilidad extends Component {

    state = {
        title: 'Diseño',
        empresas:{
            precio_inicial_diseño:'',
            incremento_esquema_2:'',
            incremento_esquema_3:'',
            variaciones:[{
                inferior:'',
                superior:'',
                cambio:''
            }]
        },
        options:{
            empresas: []
        },
        form: {
            m2: '',
            precio_inicial_diseño:'',
            incremento_esquema_2:'',
            incremento_esquema_3:'',
            precio_esquema_1: '-',
            precio_esquema_2: '-',
            precio_esquema_3: '-',
            empresa: 'inein',
            variaciones:[{
                inferior:'',
                superior:'',
                cambio:''
            }]
        },
        data:{
            empresas: []
        },
        formeditado: 0,
        empresa: ''
    }

    componentDidMount() {
        const { authUser: { user: { permisos } } } = this.props
        const { history: { location: { pathname } } } = this.props
        const { history } = this.props
        const diseño = permisos.find(function (element, index) {
            const { modulo: { url } } = element
            return pathname === url
        });
        if (!diseño)
            history.push('/')
        this.getDiseñoAxios()
    }

    async getDiseñoAxios(){
        const { access_token } = this.props.authUser
        await axios.get(URL_DEV + 'empresa/diseño', { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                const { empresas } = response.data
                const { options, data, form } = this.state
                let { empresa, grafica } = this.state
                data.empresas = empresas
                options.empresas = setSelectOptions(empresas, 'name')
                if(empresas){
                    if(empresas.length){
                        if(empresa === '')
                            empresa = empresas[0]
                        form.precio_inicial_diseño = empresa.precio_inicial_diseño
                        form.incremento_esquema_2 = empresa.incremento_esquema_2
                        form.incremento_esquema_3 = empresa.incremento_esquema_3
                        empresa.variaciones.map((variacion, index)=>{
                            this.addRow()
                            this.onChangeVariaciones(index, {target:{value:variacion.superior}},'superior')
                            this.onChangeVariaciones(index, {target:{value:variacion.inferior}},'inferior')
                            this.onChangeVariaciones(index, {target:{value:variacion.cambio}},'cambio')
                        })
                        /* form.variaciones = empresa.variaciones.length > 0 ? empresa.variaciones : [{superior: '', inferior: '', cambio: ''}] */
                        grafica = this.setGrafica(empresa)
                    }
                }
                this.setState({
                    ...this.state,
                    options,
                    data,
                    empresa,
                    form,
                    grafica
                })
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        waitAlert()
        const { access_token } = this.props.authUser
        const { empresa, form } = this.state
        await axios.post(`${URL_DEV}empresa/${empresa.id}/diseño`, form, { headers: {Authorization:`Bearer ${access_token}`}}).then(
            (response) => {
                doneAlert('Datos actualizados con éxito')
                this.getDiseñoAxios()
            },
            (error) => {
                console.log(error, 'error')
                if(error.response.status === 401){
                    forbiddenAccessAlert()
                }else{
                    errorAlert(error.response.data.message !== undefined ? error.response.data.message : 'Ocurrió un error desconocido, intenta de nuevo.')
                }
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        })
    }

    onChange = e => {
        const { name, value } = e.target
        const { form } = this.state
        let { grafica } = this.state
        form[name] = value
        form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
        form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * ( 1 + (form.incremento_esquema_2/100))
        form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * ( 1 + (form.incremento_esquema_3/100))
        if(name === 'precio_inicial_diseño' || name === 'incremento_esquema_2' || name === 'incremento_esquema_3')
            if(form.precio_inicial_diseño !== '' && form.incremento_esquema_2 !== '' && form.incremento_esquema_3 !== '')
                grafica = this.setGrafica(form)
        this.setState({
            ...this.state,
            form,
            grafica
        })
    }

    onChangeVariaciones = (key, e, name) => {
        let { value } = e.target
        let { form, grafica } = this.state
        if(name === 'cambio')
            value = parseFloat(value)
        if(name === 'inferior'||name ==='superior')  
            value = parseInt(value)
        form.variaciones[key][name] = value
        form.precio_esquema_1 = this.getPrecioEsquemas(form, form.m2)
        form.precio_esquema_2 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * ( 1 + (form.incremento_esquema_2/100))
        form.precio_esquema_3 = form.precio_esquema_1 === '-' ? '-' : form.precio_esquema_1 * ( 1 + (form.incremento_esquema_3/100))
        
        let aux = true
        form.variaciones.map( (variacion) => {
            if(variacion.superior === '' || variacion.inferior === '' || variacion.cambio === '' || variacion.cambio === 0 || 
                variacion.cambio === '0.' || variacion.cambio === '.' || variacion.superior < variacion.inferior){
                aux = false
            }
        })

        if(aux){
            grafica = this.setGrafica(form)
        }
        
        this.setState({
            ...this.state,
            form,
            grafica
        })
    }

    addRow = () => {
        const { form } = this.state
        let aux = true
        let arreglo = []
        form.variaciones.map( (variacion, index) => {
            if(variacion.inferior === '' || variacion.superior === '' || variacion.cambio === '' || 
                variacion.inferior === null || variacion.superior === null || variacion.cambio === null){
                aux = false
            }else
                if(parseInt(variacion.inferior) >= parseInt(variacion.superior)){
                    variacion.inferior = null
                    variacion.superior = null
                    aux = false
                }
            arreglo.push(variacion)
        })
        if(aux){
            form.variaciones = arreglo
            form.variaciones.push(
                {
                    inferior: '',
                    superior: '',
                    cambio: ''
                }
            )
        }else{
            form.variaciones = arreglo
        }
        this.setState({
            ...this.state,
            form
        })
    }

    deleteRow= () => {
        const { form } = this.state
        let { grafica } = this.state
        
        form.variaciones.pop()
        
        if(form.variaciones.length === 0){
            grafica = ''
            form.variaciones = [{superior: '', inferior: '', cambio: ''}]
        }
        else
            grafica = this.setGrafica(form)

        this.setState({
            ...this.state,
            form,
            grafica
        })
    }

    changeActiveKey = empresa => {
        const { form } = this.state
        let { grafica } = this.state

        form.precio_inicial_diseño = empresa.precio_inicial_diseño
        form.incremento_esquema_2 = empresa.incremento_esquema_2
        form.incremento_esquema_3 = empresa.incremento_esquema_3
        form.variaciones = empresa.variaciones.length ? empresa.variaciones : [{
            inferior:'',
            superior:'',
            cambio:''
        }]
        
        if(form.variaciones.length === 1){
            if(form.variaciones[0].superior && form.variaciones[0].inferior && form.variaciones[0].cambio){
                grafica = this.setGrafica(empresa)
            }else{
                grafica = ''
            }
        }
        else{
           grafica = this.setGrafica(empresa)
        }
        
        this.setState({
            ...this.state,
            empresa: empresa,
            form,
            grafica
        })
    }

    setGrafica = empresa => {
        const { form } = this.state
        if(empresa.variaciones.length)
        {
            let labels = []
            let data = []
            let aux = empresa.variaciones
            let limiteInf = aux[0].inferior
            let limiteSup = aux[aux.length - 1].superior
            for(let i = 0; i <= 39; i ++){
                let limite = limiteInf + (i * (limiteSup - limiteInf)/40)
                limite = parseInt(parseFloat(limite).toFixed(2))
                labels.push(limite)
                data.push(this.getPrecioEsquemas(form, limite)/limite)
            }
            labels.push(limiteSup)
            data.push(this.getPrecioEsquemas(form, limiteSup)/limiteSup)
            return {
                labels: labels,
                datasets: [
                  {
                    label: '',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: '#d8005a',
                    borderColor: '#d8005a',
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: '#444',
                    pointBackgroundColor: '#444',
                    pointBorderWidth: 10,
                    pointHoverRadius: 10,
                    pointHoverBackgroundColor: '#444',
                    pointHoverBorderColor: '#444',
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 5,
                    data: data
                  }
                ]
              };
        }
        return ''
    }

    getPrecioEsquemas = (form, m2) => {
        let aux = true
        let auxilar = []
        if(m2 !== '' && form.precio_inicial_diseño !== ''){
            form.variaciones.map( (variacion) => {
                if(!(variacion.inferior !== null && variacion.inferior !== '' &&
                    variacion.superior !== null && variacion.superior !== '' &&
                    variacion.cambio !== ''))
                    aux = false
            })
            if(aux){
                auxilar = form.variaciones
                auxilar = auxilar.sort(function(a, b) {
                    return parseInt(a.inferior) - parseInt(b.inferior);
                });
                if(auxilar.length){
                    let limiteInf = parseInt(auxilar[0].inferior)
                    let limiteSup = parseInt(auxilar[auxilar.length - 1].superior)
                    let m2Aux = parseInt(m2)
                    if( limiteInf <= m2Aux && limiteSup >= m2Aux){
                        let acumulado = 0;
                        let total;
                        auxilar.map( (variacion, index) => {
                            if(index === 0){
                                acumulado =  parseFloat(form.precio_inicial_diseño) - (( parseInt(m2) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                                if(m2Aux >= parseInt(variacion.superior))
                                    acumulado = parseFloat(form.precio_inicial_diseño) - (( parseInt(variacion.superior) - parseInt(variacion.inferior)) * parseFloat(variacion.cambio))
                                if(m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                                    total = parseFloat(acumulado) * parseFloat(m2)
                            }else{
                                if(m2Aux >= parseInt(variacion.superior))
                                    acumulado = parseFloat(acumulado) - (( parseInt(variacion.superior) - parseInt(variacion.inferior)+ 1) * parseFloat(variacion.cambio))
                                else{
                                    acumulado =  parseFloat(acumulado) - (( parseInt(m2) - parseInt(variacion.inferior) + 1) * parseFloat(variacion.cambio))
                                }
                                if(m2Aux >= parseInt(variacion.inferior) && m2Aux <= parseInt(variacion.superior))
                                    total = parseFloat(acumulado) * parseFloat(m2)
                            }
                        })
                        return total
                    }else return '-'
                }else return '-'
            }
        }else
            aux = false
        return '-'
    }

    render() {
        const { form, options, empresa, data, grafica } = this.state
        return (
            <Layout active={'catalogos'}  {...this.props}>
                <Tab.Container activeKey = { empresa !== ''  ? empresa.id : '' } >
                    <Card className="card-custom">
                        <Card.Header className="align-items-center border-0">
                            <div className="card-title">
                                <h3 className="card-label">Diseño</h3>
                            </div>
                            <div className="card-toolbar">
                                <Nav className="nav-tabs nav-bold nav-tabs-line nav-tabs-line-3x border-0">
                                    {
                                        data.empresas.map( (empresa, index) => {
                                            return (
                                                <Nav.Item key = { index } className="nav-item" onClick = { (e) => { e.preventDefault(); this.changeActiveKey(empresa) } } >
                                                    <Nav.Link eventKey={empresa.id}>{empresa.name}</Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }        
                                </Nav>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <DiseñoForm 
                                form = { form } 
                                options = { options } 
                                onChange = { this.onChange } 
                                onSubmit = { this.onSubmit }
                                addRow={this.addRow}
                                deleteRow={this.deleteRow}
                                onChangeVariaciones = { this.onChangeVariaciones }
                            />
                            {
                                grafica !== '' ?
                                    <div className="row mx-0 justify-content-center p-3">
                                        <div className="col-md-8">
                                            <Line data={grafica} />
                                        </div>
                                    </div>   
                                : <></>
                            }
                        </Card.Body>
                    </Card>
                </Tab.Container>
            </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(Contabilidad);