import { connect } from 'react-redux';
import React, { Component } from 'react';
import Layout from '../../../components/layout/layout';
import { Button } from '../../../components/form-components';

class Crm extends Component {
    render() {
        return (
            <Layout active = 'leads' { ... this.props } >
                <div className = "d-flex justify-content-end">
                    <Button
                        /* onClick={() => { changeEstatus('Aceptado') }}  */
                        className = "btn btn-icon btn-light-success success2 btn-md mr-2"
                        only_icon = "fas fa-phone icon-md"
                        tooltip = { { text:'Nuevo lead por teléfono' } }
                        />
                    <Button
                        /* onClick={() => { changeEstatus('Aceptado') }}  */
                        className = "btn btn-icon btn-light-warning btn-md mr-2"
                        only_icon = "flaticon2-black-back-closed-envelope-shape icon-md"
                        tooltip = { { text:'Nuevo lead por correo' } }
                        />
                    <Button
                        /* onClick={() => { changeEstatus('Aceptado') }}  */
                        className = "btn btn-icon btn-light-info btn-md mr-2"
                        only_icon = "fas fa-dove icon-md"
                        tooltip = { { text:'Nuevo lead por Tawk to' } }
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