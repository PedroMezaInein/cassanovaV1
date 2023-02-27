import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { InputGray, SelectSearchGray, Button, RangeCalendar, InputMoneyGray, InputNumberGray, FileInput } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card, Row, Col } from 'react-bootstrap'
import { ItemSlider } from '../../../components/singles';
class NominaObraForm extends Component {

    updateSelector = (value, name) => {
        const { onChange } = this.props
        onChange({ target: { value: value, name: name } })
    }

    updateProyecto = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'proyecto' } }, 'proyecto')
    }

    updateUsuario = (value, key) => {
        const { onChangeNominasObra } = this.props
        onChangeNominasObra(key, { target: { value: value, name: 'usuario' } }, 'usuario')
    }

    getTotal(key) {
        const { form } = this.props
        const { costo_hr_regular, costo_hr_nocturna, costo_hr_extra, total_hrs_extra, total_hrs_nocturna, total_hrs_regular, viaticos } = form.nominasObra[key]
        return parseFloat(costo_hr_regular * total_hrs_regular) + parseFloat(costo_hr_nocturna * total_hrs_nocturna) + parseFloat(costo_hr_extra * total_hrs_extra) + parseFloat(viaticos ? viaticos : 0.0)
    }

    getTotalesByType(key) {
        const { form } = this.props
        var suma = 0
        form.nominasObra.forEach(element => {
            switch(key){
                case 'nominImss':
                    suma += parseFloat(element[key])
                    break;
                case 'restanteNomina':
                    suma += parseFloat(element.costo_hr_regular *  element.total_hrs_regular) + parseFloat(element.costo_hr_nocturna * element.total_hrs_nocturna) - parseFloat(element.nominImss)
                    break;
                case 'extras':
                    suma += parseFloat(element.costo_hr_extra *  element.total_hrs_extra) + parseFloat(element.viaticos)
                    break;
                default: break;
            }
        })
        return suma
    }

    getTotales() {
        const { form } = this.props
        let suma = 0
        form.nominasObra.forEach(element => {
            suma += parseFloat(element.costo_hr_regular * element.total_hrs_regular) + parseFloat(element.costo_hr_nocturna * element.total_hrs_nocturna) + 
                parseFloat(element.costo_hr_extra * element.total_hrs_extra) + parseFloat(element.viaticos)
        });
        return suma
    }

    /* setOptions = key => {
        const { options, form, usuarios } = this.props
        let array = []
        let newAux = []
        options.usuarios.forEach((element) => {
            element.nombre = `${element.nombre}  ${element.apellido_paterno ? element.apellido_paterno : ''} ${element.apellido_materno ? element.apellido_materno : ''}`
            newAux.push(element)
        })
        if (form.nominasObra[key].usuario === '')
            return newAux
        let aux = usuarios.find((element) => {
            return element.id.toString() === form.nominasObra[key].usuario
        })
        options.usuarios.forEach((element) => {
            array.push(element)
        })
        if (aux)
            array.push({ 'label': `${aux.nombre}  ${aux.apellido_paterno ? aux.apellido_paterno : ''} ${aux.apellido_materno ? aux.apellido_materno : ''}`, 'name': `${aux.nombre}  ${aux.apellido_paterno ? aux.apellido_paterno : ''} ${aux.apellido_materno ? aux.apellido_materno : ''}`, 'value': aux.id.toString() })
        return array
    } */

    setOptions = key => {
        const { options, form, usuarios } = this.props
        let array = []
        if (form.nominasObra[key].usuario === '')
            return options.usuarios
        let aux = usuarios.find((element) => {
            return element.id.toString() === form.nominasObra[key].usuario
        })
        options.usuarios.forEach((element) => {
            array.push(element)
        })
        if (aux)
            array.push({ 'label': aux.nombre, 'name': aux.nombre, 'value': aux.id.toString() })
        return array
    }
   

    render() {
        const { options, addRowNominaObra, deleteRowNominaObra, onChangeNominasObra, onChange, form, onSubmit, formeditado, title, handleChange, onChangeRange,
            clearFiles, onChangeAdjunto, nomina, generarComprasAxios, changePageTable } = this.props
        return (
            <Card className="card card-custom gutter-b example example-compact">
                <Card.Header>
                    <Card.Title>
                        <h3 className="card-label">{title}</h3>
                    </Card.Title>
                    <div className="card-toolbar">
                        <a href='https://admin-proyectos-aws.s3.us-east-2.amazonaws.com/rrhh/plantilla-nomina-obra.xlsx' target='_blank' rel="noreferrer"
                            className="btn btn-sm btn-bg-light btn-icon-info btn-hover-light-info font-weight-bolder text-info align-self-center" >
                            <i className="far fa-file-excel text-info px-0"></i><span className="pl-2 ocultar-checador">DESCARGAR PLANTILLA</span>
                        </a>
                    </div>
                </Card.Header>
                <Form id="form-nominaobra"
                    onSubmit={
                        (e) => {
                            e.preventDefault();
                            validateAlert(onSubmit, e, 'form-nominaobra')
                        }
                    }
                >
                    <Card.Body>
                        <Row className="mx-0">
                            <Col md="4" className="text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar onChange = { onChangeRange } start = { form.fechaInicio } end = { form.fechaFin } formeditado = { formeditado } />
                            </Col>
                            <Col md="8" className="align-self-center">
                                <div className="form-group row form-group-marginless mx-0">
                                    <div className="col-md-4">
                                        <InputGray withtaglabel = { 1 } withtextlabel = { 1 } withplaceholder = { 1 }
                                            withicon = { 1 } requirevalidation = { 1 } withformgroup = { 1 }
                                            formeditado = { formeditado } name = "periodo"
                                            value = { form.periodo } placeholder = "PERIODO DE NÓMINA"
                                            onChange = { onChange } iconclass = "far fa-window-maximize"
                                            messageinc = "Ingresa el periodo de nómina." />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1} formeditado = { formeditado } options = { options.empresas }
                                            placeholder = "Selecciona la empresa" name = "empresa"
                                            value = { form.empresa } onChange = { (value) =>  { this.updateSelector(value, 'empresa') } }
                                            iconclass = "far fa-building" messageinc = "Selecciona la empresa" />
                                    </div>
                                    <div className="col-md-4">
                                        <SelectSearchGray withtaglabel={1} withtextlabel={1} formeditado = { formeditado } options = { options.proyectos }
                                            placeholder = "Selecciona el proyecto" name = "proyecto" value = { form.proyecto }
                                            onChange = { (value) =>  { this.updateSelector(value, 'proyecto') } } iconclass = "far fa-folder-open"
                                            messageinc = "Selecciona el proyecto"
                                        />
                                    </div>
                                </div>
                                {
                                    formeditado !== 1 ?
                                        <>
                                            <div className="separator separator-dashed mt-1 mb-2"></div>
                                            <div className="form-group row form-group-marginless d-flex justify-content-center mx-0">
                                                <div className="col-md-10 text-center">
                                                    <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                                    <ItemSlider
                                                        items={form.adjuntos.adjunto.files}
                                                        item='adjunto'
                                                        handleChange={handleChange}
                                                        multiple={true}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    : ''
                                }
                            </Col>
                        </Row>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless mt-8 mx-0">                                
                            <div className="col-md-12 d-flex align-items-center px-0">
                                <FileInput onChangeAdjunto = { onChangeAdjunto } placeholder = '¿Deseas importar la nómina?' value = { form.adjuntos.excel.value } 
                                    name = 'excel' id = 'file-upload' accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                                    files = { form.adjuntos.excel.files } deleteAdjunto = { clearFiles } multiple = { false } 
                                    iconclass='la la-file-upload text-primary icon-lg'
                                    classbtn='btn btn-default btn-hover-icon-primary font-weight-bolder btn-hover-bg-light text-hover-primary text-dark-50 mb-0 font-size-13px' />
                            </div>
                        </div>
                        <div className="table-responsive mb-5 pb-25">
                            <table className="table table-separate pt-5">
                                <thead>
                                    <tr>
                                        <th rowSpan="2" className="p-0"></th>
                                        <th rowSpan="2" className="px-0 pt-0"><div className="mt-2 pb-3 font-size-sm">Colaborador</div></th>
                                        <th colSpan="3" className="py-0 border-bottom-0 font-size-sm text-center"><div style={{ color: '#26A69A', backgroundColor: '#E0F2F1', borderRadius:'4px'}}>Jornada regular</div></th>
                                        <th colSpan="3" className="py-0 border-bottom-0 font-size-sm text-center"><div style={{ color: '#7E57C2', backgroundColor: '#E8EAF6', borderRadius:'4px'}}>Jornada nocturna</div></th>
                                        <th colSpan="4" className="py-0 border-bottom-0 font-size-sm text-center"><div style={{ color: '#EC407A', backgroundColor: '#FCE4EC', borderRadius:'4px'}}>Extra y viáticos</div></th>
                                        <th className="py-0 border-bottom-0 font-size-sm text-center" style={{ minWidth:'110px' }}>Nómina IMSS</th>
                                        <th className="py-0 border-bottom-0 font-size-sm text-center" style={{ minWidth:'141px' }}>Restante Nómina</th>
                                        <th className="py-0 border-bottom-0 font-size-sm text-center">Extras</th>
                                        <th className="py-0 border-bottom-0 font-size-sm text-center">Total</th>
                                    </tr>
                                    <tr>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#26A69A'}}> <div className="p-0 my-0 font-size-sm text-center"> $ x hr</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#26A69A'}}> <div className="p-0 my-0 font-size-sm text-center"> # hrs</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#26A69A'}}> <div className="p-0 my-0 font-size-sm text-center"> TOTAL</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#7E57C2'}}> <div className="p-0 my-0 font-size-sm text-center"> $ x hr</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#7E57C2'}}> <div className="p-0 my-0 font-size-sm text-center"> # hrs</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#7E57C2'}}> <div className="p-0 my-0 font-size-sm text-center"> TOTAL</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#EC407A'}}> <div className="p-0 my-0 font-size-sm text-center"> $ x hr</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#EC407A'}}> <div className="p-0 my-0 font-size-sm text-center"> # hrs</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#EC407A'}}> <div className="p-0 my-0 font-size-sm text-center"> VIÁTICOS</div> </th>
                                        <th className='pt-2' style={{ minWidth: "80px", color: '#EC407A' }}> <div className="p-0 my-0 font-size-sm text-center"> TOTAL</div> </th>
                                        <th className="pt-2"><div className="p-0 my-0 font-weight-bolder font-size-sm text-center" style={{ color: '#42A5F5', backgroundColor: '#E3F2FD', borderRadius:'4px'}}>{setMoneyTableForNominas(this.getTotalesByType("nominImss"))}</div></th>
                                        <th className="pt-2"><div className="p-0 my-0 font-weight-bolder font-size-sm text-center" style={{ color: '#42A5F5', backgroundColor: '#E3F2FD', borderRadius:'4px'}}>{setMoneyTableForNominas(this.getTotalesByType("restanteNomina"))}</div></th>
                                        <th className="pt-2"><div className="p-0 my-0 font-weight-bolder font-size-sm text-center" style={{ color: '#42A5F5', backgroundColor: '#E3F2FD', borderRadius:'4px'}}>{setMoneyTableForNominas(this.getTotalesByType("extras"))}</div></th>
                                        <th className="pt-2"><div className="p-0 my-0 font-weight-bolder font-size-sm text-center">{setMoneyTableForNominas(this.getTotales())}</div></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        form.nominasObra.map((nom, key) => {
                                            return (
                                                <tr key={key}>
                                                    <td className='text-center align-middle px-0' style={{ minWidth: "41px" }}>
                                                        <Button icon='' onClick={() => { deleteRowNominaObra(nom, key) }}
                                                            className="btn btn-sm btn-icon btn-bg-white btn-icon-danger btn-hover-danger" only_icon="far fa-trash-alt icon-md text-danger" />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <SelectSearchGray identificador="empleado" formeditado={formeditado} name="usuario"
                                                            options={this.setOptions(key)} placeholder="Selecciona el colaborador" value={nom['usuario']}
                                                            onChange={(value) => this.updateUsuario(value, key)}
                                                            customstyle={{ minWidth: "260px" }} withtaglabel={0} withtextlabel={0} withicon={0} customdiv="mb-0" iconvalid={1}
                                                        />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputMoneyGray customclass="px-2" identificador="costo_hr_regular" requirevalidation={0} formeditado={formeditado}
                                                            name="costo_hr_regular" value={nom['costo_hr_regular']} thousandseparator={true} prefix='$'
                                                            onChange={e => onChangeNominasObra(key, e, 'costo_hr_regular')}/>
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputNumberGray customclass="px-2" formgroup="mb-0" withicon={0} customlabel="d-none" identificador="total_hrs_regular" requirevalidation={0}
                                                            formeditado={formeditado} name="total_hrs_regular" value={nom['total_hrs_regular']}
                                                            onChange={e => onChangeNominasObra(key, e, 'total_hrs_regular')}
                                                            thousandseparator={true} typeformat="###########" />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <div className="p-0 my-0 font-size-sm" style={{color: '#26A69A'}}>
                                                            {setMoneyTableForNominas(nom.costo_hr_regular * nom.total_hrs_regular)}
                                                        </div>
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputMoneyGray customclass="px-2" identificador="costo_hr_nocturna" requirevalidation={0} formeditado={formeditado}
                                                            name="costo_hr_nocturna" value={nom['costo_hr_nocturna']} thousandseparator={true} prefix='$'
                                                            onChange={e => onChangeNominasObra(key, e, 'costo_hr_nocturna')} />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputNumberGray customclass="px-2" formgroup="mb-0" withicon={0} customlabel="d-none" identificador="total_hrs_nocturna" requirevalidation={0}
                                                            formeditado={formeditado} name="total_hrs_nocturna" value={nom['total_hrs_nocturna']}
                                                            onChange={e => onChangeNominasObra(key, e, 'total_hrs_nocturna')}
                                                            thousandseparator={true} typeformat="###########" />
                                                    </td>
                                                    <td className='text-center align-middle'>
                                                        <div className="p-0 my-0 font-size-sm" style={{color: '#7E57C2'}}>
                                                            {setMoneyTableForNominas(nom.costo_hr_nocturna * nom.total_hrs_nocturna)}
                                                        </div>
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputMoneyGray customclass="px-2" identificador="costo_hr_extra" requirevalidation={0} formeditado={formeditado}
                                                            name="costo_hr_extra" value={nom.costo_hr_extra} thousandseparator={true} prefix='$'
                                                            onChange={e => onChangeNominasObra(key, e, 'costo_hr_extra')} />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputNumberGray customclass="px-2" formgroup="mb-0" withicon={0} customlabel="d-none" identificador="total_hrs_extra" requirevalidation={0}
                                                            formeditado={formeditado} name="total_hrs_extra" value={nom.total_hrs_extra}
                                                            onChange={e => onChangeNominasObra(key, e, 'total_hrs_extra')}
                                                            thousandseparator={true} typeformat="###########" />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputMoneyGray customclass="px-2" identificador="viaticos" requirevalidation={0} formeditado={formeditado}
                                                            name="viaticos" value={nom.viaticos} thousandseparator={true} prefix='$'
                                                            onChange={e => onChangeNominasObra(key, e, 'viaticos')} />
                                                    </td>
                                                    <td className='text-center align-middle'>
                                                        <div className="p-0 my-0 font-size-sm" style={{color: '#EC407A'}}>
                                                            {setMoneyTableForNominas(parseFloat(nom.costo_hr_extra * nom.total_hrs_extra) + parseFloat(nom.viaticos ? nom.viaticos : 0.0))}
                                                        </div>
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <InputMoneyGray customclass="px-2" identificador="nominImss" requirevalidation={0} formeditado={formeditado}
                                                            name="nominImss" value={nom.nominImss} onChange={e => onChangeNominasObra(key, e, 'nominImss')}
                                                            thousandseparator={true} prefix='$' />
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <div className="p-0 my-0 font-size-sm">
                                                            {setMoneyTableForNominas(parseFloat(nom.costo_hr_regular * nom.total_hrs_regular)
                                                                + parseFloat(nom.costo_hr_nocturna * nom.total_hrs_nocturna) - parseFloat(nom.nominImss ? nom.nominImss : 0.0))}
                                                        </div>
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <div className="p-0 my-0 font-size-sm">
                                                            {setMoneyTableForNominas(parseFloat(nom.costo_hr_extra * nom.total_hrs_extra) + parseFloat(nom.viaticos ? nom.viaticos : 0.0))}
                                                        </div>
                                                    </td>
                                                    <td className='text-center align-middle' >
                                                        <div id="total" className="font-size-lg font-weight-bolder">
                                                            {setMoneyTableForNominas(this.getTotal(key))}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="button" className="btn btn-sm btn-bg-light btn-hover-light-primary font-weight-bolder text-primary align-self-center font-size-13px" onClick={addRowNominaObra}>AGREGAR COLABORADOR</button>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="d-flex justify-content-between">
                            <button type="button" className="btn btn-bg-light btn-hover-light-danger font-weight-bolder text-danger align-self-center font-size-13px" onClick={(e) => { e.preventDefault(); changePageTable() }}>REGRESAR</button>
                            
                            <div className="d-flex">
                                <Button text='ENVIAR' type='submit' className="btn btn-bg-light btn-hover-light-success font-weight-bolder text-success align-self-center font-size-13px" icon=''/>
                                { 
                                    nomina !== '' ?  
                                        nomina.compras.length === 0 ?
                                            <Button text='GENERAR COMPRAS' className="btn btn-bg-light btn-hover-light-primary font-weight-bolder text-primary align-self-center font-size-13px ml-2" icon=''only_icon='fas fa-wallet mr-1 text-primary'
                                                onClick = { (e) => { e.preventDefault(); generarComprasAxios(); } } />  
                                        : <></>         
                                    : <></> 
                                }
                            </div>
                        </div>
                    </Card.Footer>
                </Form>
            </Card>
        )
    }
}

export default NominaObraForm