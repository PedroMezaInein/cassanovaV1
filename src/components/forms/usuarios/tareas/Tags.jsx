import React, { Component } from 'react'
import { Dropdown } from 'react-bootstrap'

class Tags extends Component {

    render() {
        const { etiquetas, removeTag, options, tagShow } = this.props
        return (
            <div className="card card-custom gutter-b">
                <div className="card-body d-flex align-items-center justify-content-between  py-3">
                    <h3 className="font-weight-bold mb-0">TAGS</h3>
                    <div>
                        {
                            etiquetas.map((etiqueta) => {
                                return(
                                    <span key = { etiqueta.id} style = { { backgroundColor: etiqueta.color, color: 'white'}}
                                        className="label font-weight-bold label-inline ml-2 text-hover" 
                                        onClick = { (e) => { e.preventDefault(); removeTag(etiqueta);} } >
                                        {etiqueta.titulo}
                                    </span>
                                )
                            })
                        }
                    </div>
                    <Dropdown className="text-center">
                        <Dropdown.Toggle
                            style={
                                {
                                    backgroundColor: '#f3f6f9', color: '#80809a', border: 'transparent', padding: '0.3rem 0.6rem',
                                    width: 'auto', margin: 0, display: 'inline-flex', justifyContent: 'center', alignItems: 'center', fontSize: '13px',
                                    fontWeight: 600
                                }
                            }>
                            FILTRAR POR TAGS
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="p-0" >
                            <Dropdown.Header>
                                <span className="font-size-12px">Elige una opción</span>
                            </Dropdown.Header>
                            {
                                options.tags.map((tag, key) => {
                                    return (
                                        <div key={key}>
                                            <Dropdown.Item className="p-0" key={key} onClick={() => { tagShow(tag) }}>
                                                <span className="navi-link w-100">
                                                    <span className="navi-text">
                                                        <span className="label label-xl label-inline rounded-0 w-100 font-weight-bold"
                                                            style={{
                                                                color: `${tag.name ==='Nueva etiqueta' ? '#80808f' : 'white' }`,
                                                                backgroundColor: tag.color ,
                                                            }}>
                                                            { tag.name }
                                                        </span>
                                                    </span>
                                                </span>
                                            </Dropdown.Item>
                                        </div>
                                    )
                                })
                            }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        )
    }
}

export default Tags