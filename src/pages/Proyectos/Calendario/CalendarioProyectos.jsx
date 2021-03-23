import React, { Component } from 'react'
import { Card } from 'react-bootstrap';
import { connect } from 'react-redux';
import Layout from '../../../components/layout/layout';

class CalendarioProyectos extends Component{

    render(){
        return(
            <Layout active = 'proyectos' {...this.props} >
                <Card className="card-custom">
                    <Card.Header>
                        <div className="d-flex align-items-center">
                            <h3 className="card-title align-items-start flex-column"></h3>
                        </div>
                    </Card.Header>
                </Card>
            </Layout>
        )
    }
}

const mapStateToProps = state => { return { authUser: state.authUser } }
const mapDispatchToProps = dispatch => ({})
export default connect(mapStateToProps, mapDispatchToProps)(CalendarioProyectos);