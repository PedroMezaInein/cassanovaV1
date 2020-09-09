import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import { Card } from 'react-bootstrap';
import { FlujoProyectosForm, TablaReportes } from '../../components/forms'

class FlujoProyectos extends Component {

    state = {
        form: {
            fechaInicio: new Date(),
            fechaFin: new Date,
            empresas: [],
            empresa: 0,
        },
        options: {
            empresas: [],
        },
    }

    render() {
        const { form } = this.state
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">FLUJO DE PROYECTOS</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="row">
                            <div className="col-lg-5">
                                <FlujoProyectosForm
                                    form={form}
                                />
                            </div>
                            <div className="col-lg-7">
                                <TablaReportes />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    return {
        authUser: state.authUser
    }
}

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(FlujoProyectos)