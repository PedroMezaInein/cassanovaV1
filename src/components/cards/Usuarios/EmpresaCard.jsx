import React, { Component } from 'react'
import Card from 'react-bootstrap/Card'
export default class EmpresaCard extends Component {
    arrayList(array, tipo ) {
        let aux = [];
        switch (tipo) {
            case 'tipos_proyecto':
                array.forEach((tipo) => {
                    aux.push(tipo.tipo)
                })
                break;
            case 'departamentos':
                array.forEach((departamento) => {
                    aux.push(departamento.nombre)
                })
                break;
            default:
                break;
        }
        let result = ''
        for (let i = 0; i < aux.length; i++) {
            if (i < aux.length - 1) {
                result += aux[i] + ', '
            } else {
                result += aux[i] + '.'
            }
        }
        return result
    }
    render() {
        const { empresa } = this.props
        return (
            <div className="col-md-12">
                <Card className="card card-without-box-shadown border-0">
                    <div className="">
                        <div className="card-body d-flex align-items-center justify-content-between flex-wrap pb-2 pl-0 pr-0 pt-4">
                            <div className="mr-2">
                                {
                                    empresa.name ?
                                            <p className="font-size-h3 mb-0">EMPRESA:&nbsp;<strong className="font-size-h4"> {empresa.name}</strong></p>
                                        : ''
                                }
                                {
                                    empresa.razon_social ?
                                            <p className="font-size-h5 text-muted font-size-lg mt-0">RAZÓN SOCIAL:&nbsp;<strong className="font-size-h6"> {empresa.razon_social} </strong></p>
                                        : ''
                                }
                            </div>
                            {
                                empresa.rfc ?
                                    <div>
                                        <div className="d-flex align-items-start mr-2">
                                            <div className="symbol symbol-35 symbol-light-primary mr-4 flex-shrink-0 d-flex align-self-center">
                                                <div className="symbol-label">
                                                    <i className="las la-file-alt text-primary icon-xl"></i>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="font-size-h6 text-dark-75 font-weight-bolder">{empresa.rfc}</div>
                                                <div className="font-size-sm text-muted font-weight-bold mt-1">RFC</div>
                                            </div>
                                        </div>
                                    </div>
                                    : ''
                            }
                        </div>
                        {
                            empresa.tipos || empresa.departamentos ?
                            (empresa.tipos.length > 0 || empresa.departamentos.length > 0) &&
                                <>
                                <div className="separator separator-solid mb-3"></div>
                                <div className="row row-paddingless my-6">
                                    {
                                        empresa.tipos.length > 0 &&
                                            <div className={`col-md-12 ${empresa.departamentos.length > 0 ? 'mb-5':''}`}>
                                                <div className="d-flex">
                                                    <div className="white-space-nowrap align-self-center">
                                                        <span className="text-dark-75 font-weight-bolder font-size-h6 mr-3">{empresa.tipos.length>1?'Tipos de proyectos':'Tipo de proyecto'}:</span>
                                                    </div>
                                                    <div className="text-dark-50 font-weight-light text-justify font-size-lg">
                                                        {this.arrayList(empresa.tipos, 'tipos_proyecto')}
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                    {
                                        empresa.departamentos.length > 0 &&
                                            <div className="col-md-12">
                                                <div className="d-flex">
                                                    <div className="white-space-nowrap align-self-center">
                                                        <span className="text-dark-75 font-weight-bolder font-size-h6 mr-3">{empresa.departamentos.length>1?'Departamentos':'Departamento'}:</span>
                                                    </div>
                                                    <div className="text-dark-50 font-weight-light text-justify font-size-lg">
                                                        {this.arrayList(empresa.departamentos, 'departamentos')}
                                                    </div>
                                                </div>
                                            </div>
                                    }
                                    {
                                        empresa.direccion ?
                                            <div className="font-size-lg font-weight-light mt-5">
                                                <strong >Dirección: </strong><span className="text-dark-50">{empresa.direccion}</span>
                                            </div>
                                            : ''
                                    }
                                </div>
                                </>
                            :''
                        }
                        {
                            (empresa.facebook || empresa.instagram || empresa.linkedin || empresa.pinterest || empresa.blog || empresa.pagina_web) &&
                            <>
                                <div className="separator separator-solid"></div>
                                <div className="mt-5 text-center">
                                    {
                                        empresa.facebook !== null &&
                                        <a href={empresa.facebook} target='_blank' rel="noreferrer" className="btn btn-icon btn-light-facebook mr-2">
                                            <i className="socicon-facebook icon-lg mt-1"></i>
                                        </a>
                                    }
                                    {
                                        empresa.instagram !== null &&
                                        <a href={empresa.instagram} target='_blank' rel="noreferrer" className="btn btn-icon btn-light-instagram mr-2">
                                            <i className="socicon-instagram icon-lg mt-1"></i>
                                        </a>
                                    }
                                    {
                                        empresa.linkedin !== null &&
                                        <a href={empresa.linkedin} target='_blank' rel="noreferrer" className="btn btn-icon btn-light-linkedin mr-2">
                                            <i className="socicon-linkedin icon-lg mt-1"></i>
                                        </a>
                                    }
                                    {
                                        empresa.pinterest !== null &&
                                        <a href={empresa.pinterest} target='_blank' rel="noreferrer" className="btn btn-icon btn-light-pinterest mr-2">
                                            <i className="socicon-pinterest icon-lg mt-1"></i>
                                        </a>
                                    }
                                    {
                                        empresa.blog !== null &&
                                        <a href={empresa.blog} target='_blank' rel="noreferrer" className="btn btn-icon btn-light-blog">
                                            <i className="socicon-blogger icon-lg mt-1"></i>
                                        </a>
                                    }
                                    {
                                        empresa.pagina_web !== null &&
                                        <a href={empresa.pagina_web} target='_blank' rel="noreferrer" className="btn btn-icon btn-light-primary">
                                            <i className="socicon-wordpress icon-lg mt-1"></i>
                                        </a>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </Card>
            </div>
        )
    }
}