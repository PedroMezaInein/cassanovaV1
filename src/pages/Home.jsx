import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'
import { LEADS_FRONT } from '../constants'

class Home extends Component{
    
    componentDidMount(){
        const { user } = this.props.authUser 
        const { history } = this.props
        if(!user.permisos){
            history.push('/login');
            window.location.reload();
        }
        else {
            let perm = null   
             const { access_token } = this.props.authUser.access_token
            let arreglo = ['calendario-tareas', 'crm', 'tareas', 'mi-proyecto']
            arreglo.forEach( (elemento) => {
                if(!perm){
                    perm = user.permisos.find((permiso) => {
                        return permiso.modulo.slug === elemento
                    })
                }
            })
            if(perm){
                if(perm.modulo.slug === 'crm'){
                    window.location.href = `${LEADS_FRONT}/leads/crm?tag=${access_token}`
                }
            }else{
                history.push(user.permisos[0].modulo.url)
            }}
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