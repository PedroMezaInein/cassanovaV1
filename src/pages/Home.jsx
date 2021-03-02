import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'

class Home extends Component{
    
    componentDidMount(){
        const { user : { permisos } } = this.props.authUser
        const { history } = this.props
        
        const crm = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'crm'
        }) : null;
        const tareas = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'tareas'
        }) : null;
        const proyecto = permisos ? permisos.find(function(element, index) {
            return element.modulo.slug === 'mi-proyecto'
        }) : null;
        
        if(crm){
            history.push('/leads/crm')
        }
        else{
            if(tareas){
                history.push('/usuarios/tareas')
            }
            else{
                if(proyecto){
                    history.push('/mi-proyecto')
                }else{
                    if(permisos === undefined)
                        history.push('/login')
                    else    
                        history.push(permisos[0].modulo.url)
                }
            }
        }
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