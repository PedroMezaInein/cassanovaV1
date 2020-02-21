import React, { Component } from 'react'
import Layout from '../components/layout/layout'
import { connect } from 'react-redux'

class Home extends Component{
    constructor(props) {
        super(props)
    }

    componentDidMount(){
        const { user : { id: tipo} } = this.props.authUser
        const { history } = this.props
        console.log(tipo)
        switch (tipo){
            case 1:
                history.push('/usuarios/usuarios')
                break;
            case 2:
                history.push('/usuarios/tareas')
                break;
            case 3:
                history.push('/mi-proyecto')
                break;
            default:
                history.push('/mi-proyecto')
                break;
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