import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import { Card } from 'react-bootstrap';
import RangeCalendar from '../../components/form-components/RangeCalendar';


class EstadoResultados extends Component {

    state = {
        form:{
            fechaInicio: new Date(),
            fechaFin: new Date,
        }
    }

    onChangeRange = range => {
        const { startDate, endDate } = range
        const { form } = this.state
        form.fechaInicio = startDate
        form.fechaFin = endDate
        this.setState({
            ... this.state,
            form
        })
    }

    render() {
        const { form } = this.state
        return (
            <Layout active = 'reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">Estados de resultados</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex justify-content-center">
                            <RangeCalendar start = { form.fechaInicio } end = { form.fechaFin } 
                                onChange = { this.onChangeRange } />
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

export default connect(mapStateToProps, mapDispatchToProps)(EstadoResultados)