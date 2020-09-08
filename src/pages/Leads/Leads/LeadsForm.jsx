import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';

class LeadsForm extends Component {
    render() {
        return (
            <Layout active = 'leads'  { ...this.props } >

            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return{
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(LeadsForm)