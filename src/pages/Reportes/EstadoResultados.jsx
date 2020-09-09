import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from '../../components/layout/layout';
import { Card } from 'react-bootstrap';
import { EstadoResultadosForm, AccordionEstadosResultados } from '../../components/forms'

class EstadoResultados extends Component {

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

    onChangeEmpresa = e => {
        const { name, value } = e.target
        const { options, form } = this.state
        let auxEmpresa = form.empresas
        let aux = []
        options.empresas.find(function (_aux) {
            if (_aux.value.toString() === value.toString()) {
                auxEmpresa.push(_aux)
            } else {
                aux.push(_aux)
            }
        })

        options.empresas = aux
        form['empresas'] = auxEmpresa
        this.setState({
            ... this.state,
            form,
            options
        })
    }

    render() {
        const { form, options} = this.state
        return (
            <Layout active='reportes'  {...this.props}>
                <Card className="card-custom">
                    <Card.Header>
                        <div className="card-title">
                            <h3 className="card-label">ESTADO DE RESULTADOS</h3>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        <div id="id-row" className="row">
                            <div id="col-calendar" className="col-lg-5">
                                <EstadoResultadosForm
                                    onChangeEmpresa = { this.onChangeEmpresa } 
                                    form={form}
                                    options = { options } 
                                />
                            </div>
                            <div id="col-table"  className="col-lg-7">
                                <AccordionEstadosResultados />
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

export default connect(mapStateToProps, mapDispatchToProps)(EstadoResultados)