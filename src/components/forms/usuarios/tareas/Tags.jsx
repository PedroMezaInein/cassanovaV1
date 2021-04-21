import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap'

class Tags extends Component {

    render() {
        return (
            <div className="card card-custom gutter-b">
                <div className="card-body d-flex align-items-center justify-content-between  py-3">
                    <h3 className="font-weight-bold mb-0">TAGS</h3>
                    <Dropdown className="text-center">
                        <Dropdown.Toggle
                            style={
                                {
                                    backgroundColor: '#f3f6f9', color: '#80809a', border: 'transparent', padding: '0.3rem 0.6rem',
                                    width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px',
                                    fontWeight: 600
                                }}>
                            AGREGAR TAGS
                                                </Dropdown.Toggle>
                        <Dropdown.Menu className="p-0" >
                            <Dropdown.Header>
                                <span className="font-size-12px">Elige una opción</span>
                            </Dropdown.Header>
                            <Dropdown.Item className="p-0">
                                <span className="navi-link w-100">
                                    <span className="navi-text">
                                        <span className="label label-xl label-inline label-light-danger rounded-0 w-100 font-size-12px">URGENTE</span>
                                    </span>
                                </span>
                            </Dropdown.Item>
                            <Dropdown.Item className="p-0">
                                <span className="navi-link w-100">
                                    <span className="navi-text">
                                        <span className="label label-xl label-inline label-light-info rounded-0 w-100 font-size-12px">EN PROCESO</span>
                                    </span>
                                </span>
                            </Dropdown.Item>
                            <Dropdown.Item className="p-0">
                                <span className="navi-link w-100">
                                    <span className="navi-text">
                                        <span className="label label-xl label-inline label-light-success rounded-0 w-100 font-size-12px">EN REVISIÓN</span>
                                    </span>
                                </span>
                            </Dropdown.Item>
                            <Dropdown.Item className="p-0">
                                <span className="navi-link w-100">
                                    <span className="navi-text">
                                        <span className="label label-xl label-inline label-light-warning rounded-0 w-100 font-size-12px">PENDIENTE</span>
                                    </span>
                                </span>
                            </Dropdown.Item>
                            <Dropdown.Item className="p-0">
                                <span className="navi-link w-100">
                                    <span className="navi-text">
                                        <span className="label label-xl label-inline label-white rounded-0 w-100 font-size-12px">AGREGAR NUEVO</span>
                                    </span>
                                </span>
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        )
    }
}

export default Tags