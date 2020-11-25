import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'

class Home extends Component{
    
    componentDidMount(){
        const { user : { permisos } } = this.props.authUser
        const { history } = this.props
        
        const crm = permisos.find(function(element, index) {
            return element.modulo.slug === 'crm'
        });
        const tareas = permisos.find(function(element, index) {
            return element.modulo.slug === 'tareas'
        });
        const proyecto = permisos.find(function(element, index) {
            return element.modulo.slug === 'mi-proyecto'
        });
        
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