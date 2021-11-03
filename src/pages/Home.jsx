import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { LEADS_FRONT } from '../constants'

class Home extends Component{
    
    componentDidMount(){
        const { user : { permisos } } = this.props.authUser
        const { access_token } = this.props.authUser.access_token
        const { history } = this.props
        let flag = false

        const calendarioTareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'calendario-tareas'
        }) : null;
        if(calendarioTareas){
            flag = true
            history.push('/usuarios/calendario-tareas')
        }
        
        const crm = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'crm'
        }) : null;
        if(crm && flag === false){
            flag = true
            window.location.href = `${LEADS_FRONT}/leads/crm?tag=${access_token}`
        }

        const tareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'tareas'
        }) : null;
        if(tareas && flag === false){
            flag = true
            history.push('/usuarios/tareas')
        }

        const proyecto = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'mi-proyecto'
        }) : null;

        if(proyecto && flag === false){
            flag = true
            history.push('/mi-proyecto')
        }

        if(permisos === undefined && flag === false)
            history.push('/login')
        else
            if(flag === false) 
                history.push(permisos[0].modulo.url)
    }

    render(){
        return(
            <Layout { ...this.props}>
                
            </Layout>
        )
    }
}

const mapStateToProps = state => { return{ authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({ })
export default connect(mapStateToProps, mapDispatchToProps)(Home)