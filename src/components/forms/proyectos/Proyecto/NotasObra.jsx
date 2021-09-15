import React, { Component } from 'react'
import { Card, DropdownButton, Dropdown } from 'react-bootstrap'
import { dayDMY, setNaviIcon } from '../../../../functions/setters'

class NotasObra extends Component {
    state = {
        activeNota: 'notas',
        formeditado: 0
    }
    componentDidMount() {
        const { notas } = this.props
        let { activeNota } = this.state
        if (notas.length > 0) {
            activeNota = 'notas'
        }
        this.setState({
            ...this.state,
            activeNota
        })
    }

    onClickNota = (type) => {
        this.setState({
            ...this.state,
            activeNota: type
        })
    }
    render() {
        const { activeNota } = this.state
        const { notas } = this.props
        console.log(activeNota, 'activeNota')
        return (
            <>
                <Card className="card-custom gutter-b">
                    <Card.Header className="border-0 align-items-center">
                        <div className="font-weight-bold font-size-h4 text-dark">Notas de obra</div>
                        <div className="card-toolbar toolbar-dropdown">
                            <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos-light-primary' >
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickNota('new') }}>
                                    {setNaviIcon('las la-plus icon-lg', 'AGREGAR NUEVA NOTA')}
                                </Dropdown.Item>
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickNota('pdf') }}>
                                    {setNaviIcon('las la-file-pdf icon-lg', 'GENERAR PDF')}
                                </Dropdown.Item>
                                <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickNota('see') }}>
                                    {setNaviIcon('las la-search icon-lg', 'VER BITÁCORA')}
                                </Dropdown.Item>
                            </DropdownButton>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {
                            activeNota === 'notas'?
                                notas.length > 0 &&
                                    <div className="table-responsive rounded-top">
                                        <table className="table table-notas table-vertical-center w-100">
                                            <thead className="font-size-h6 bg-light">
                                                <tr>
                                                    <th style={{ width: '5%' }} >#</th>
                                                    <th className="text-align-last-left">Proveedor y tipo</th>
                                                    <th style={{ width: '10%' }}>Fecha</th>
                                                    <th style={{ minWidth: '300px' }}>Nota</th>
                                                    <th style={{ width: '10%' }}>Adjunto</th>
                                                    <th style={{ width: '5%' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    notas.map((nota, index) => {
                                                        return (
                                                            <tr key={index} className="text-dark-75 font-weight-light text-justify">
                                                                <td>
                                                                    <div className={`symbol symbol-45 symbol-light-${index % 2 ? 'success2' : 'primary2'}`}>
                                                                        <span className="symbol-label font-size-sm">{nota.numero_nota.toString().padStart(4, 0)}</span>
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <span className="font-weight-bold mb-1 font-size-lg text-dark">{nota.proveedor ? nota.proveedor.razon_social : '-'}</span>
                                                                    <span className="text-muted font-weight-bold d-block">{nota.tipo_nota}</span>
                                                                </td>
                                                                <td>
                                                                    <div className="w-max-content mx-auto">
                                                                        {dayDMY(nota.fecha)}
                                                                    </div>
                                                                </td>
                                                                <td> {nota.notas} </td>
                                                                <td className="text-center  font-weight-bold">
                                                                    <div className="w-max-content mx-auto">
                                                                        {
                                                                            nota.adjuntos.map((adjunto, key) => {
                                                                                return (
                                                                                    <u>
                                                                                        <a key={key} target='_blank' rel="noreferrer" href={adjunto.url} className="text-dark text-hover-success mb-1 d-block">
                                                                                            Adjunto {key + 1}
                                                                                        </a>
                                                                                    </u>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                </td>
                                                                <td className="pr-0 text-center">
                                                                    <button className='btn btn-icon btn-actions-table btn-xs ml-2 btn-text-danger btn-hover-danger' onClick={(e) => { e.preventDefault(); this.openModalDeleteNota(nota) }} >
                                                                        <i className='flaticon2-rubbish-bin' />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                            :<></>
                            
                            // activeNota === 'new'?
                            // :activeNota === 'new'?
                            // :activeNota === 'new'?
                        }
                        {/* {
                            activeNota === 'new'?
                            :''
                        } */}
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default NotasObra