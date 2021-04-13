import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'

class Home extends Component{
    
    componentDidMount(){
        const { user : { permisos } } = this.props.authUser
        const { history } = this.props

        const calendarioTareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'calendario-tareas'
        }) : null;
        if(calendarioTareas)
            history.push('/usuarios/calendario-tareas')
        
        const crm = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'crm'
        }) : null;
        if(crm)
            history.push('/leads/crm')

        const tareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'tareas'
        }) : null;
        if(tareas)
            history.push('/usuarios/tareas')

        const proyecto = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'mi-proyecto'
        }) : null;
        if(proyecto)
            history.push('/mi-proyecto')
        
        if(permisos === undefined)
            history.push('/login')
        else    
            history.push(permisos[0].modulo.url)
    }

    render(){
        return(
            <Layout { ...this.props}>
                
            </Layout>
        )
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)