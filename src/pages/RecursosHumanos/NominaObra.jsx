import React, { Component } from 'react' 
import { connect } from 'react-redux'
import Layout from '../../components/layout/layout' 
import { Modal, Card, ModalDelete} from '../../components/singles' 
import { NOMINA_OBRA_COLUMNS } from '../../constants'
import NewTable from '../../components/tables/NewTable' 
import { NominaObraForm } from '../../components/forms'

class NominaObra extends Component {
    state = { 
        modalDelete: false,   
        formeditado:0,
        modal:{
            form: false,
            delete: false,
            adjuntos: false,
        },
        title: 'Nueva nómina de obra',
    }

    componentDidMount() {
        const { authUser: { user: { permisos: permisos } } } = this.props
        const { history: { location: { pathname: pathname } } } = this.props
        const { history } = this.props
        const nominaobra = permisos.find(function (element, index) {
            const { modulo: { url: url } } = element
            return pathname === url
        });
        if (!nominaobra)
            history.push('/')
    }

    openModal = () => {
        const { modal } = this.state
        modal.form = true
        this.setState({
            ... this.state,
            // form: this.clearForm(),
            modal,
            // tipo: 'Cliente',
            // title: 'Nueva contrato de cliente',
            formeditado:0
        })
    }
    
    render() {
        const { modal, title, data, formeditado} = this.state

        return (
            <Layout active={'rh'} {...this.props}>
                <NewTable   
                    columns = { NOMINA_OBRA_COLUMNS } data = { "" } 
                    title = 'Nómina de obra' subtitle = 'Listado de nómina de obra'
                    mostrar_boton={true}
                    abrir_modal={true} 
                    onClick={this.openModal} 
                    mostrar_acciones={false} 
                    actions = {{
                    }}
                    elements = { "" }
                />

                <Modal size="xl" title={title} show={modal} handleClose={this.handleCloseModal} >
                    <NominaObraForm
                        formeditado={formeditado}
                        className=" px-3 "     
                    >
                    </NominaObraForm>
                </Modal>  
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

export default connect(mapStateToProps, mapDispatchToProps)(NominaObra);