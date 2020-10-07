import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../components/layout/layout';
import { Button } from '../../../components/form-components';

class Crm extends Component {

    changePageAdd = tipo => {
        const { history } = this.props
        history.push({
            pathname: '/leads/crm/add/'+tipo
        });
    }

    render() {
        return (
            <Layout active = 'leads' { ... this.props } >
                <div className = "d-flex justify-content-end flex-wrap">
                    <Button
                        onClick={() => { this.changePageAdd('telefono') }} 
                        className = "btn btn-light-success success2 mr-2"
                        only_icon = "fas fa-phone icon-md mr-2"
                        tooltip = { { text:'Nuevo lead por teléfono' } }
                        text = 'Nuevo lead por teléfono'
                        />
                    <Button
                        className = "btn btn-light-warning mr-2"
                        only_icon = "flaticon2-black-back-closed-envelope-shape icon-md mr-2"
                        tooltip = { { text:'Nuevo lead por correo' } }
                        text = 'Nuevo lead por correo'
                        />
                    <Button
                        className = "btn btn-light-info mr-2"
                        only_icon = "fas fa-dove icon-md mr-2"
                        tooltip = { { text:'Nuevo lead por Tawk to' } }
                        text = 'Nuevo lead por Tawk to'
                        />
                </div>
            </Layout>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = (dispatch) => {
}

export default connect(mapStateToProps, mapDispatchToProps)(Crm)