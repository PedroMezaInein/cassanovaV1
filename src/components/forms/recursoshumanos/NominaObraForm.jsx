import React, { Component } from 'react'
import Form from 'react-bootstrap/Form'
import { Input, SelectSearch, Button, RangeCalendar, InputMoneySinText, SelectSearchSinText, InputNumberSinText, FileInput } from '../../form-components'
import { validateAlert } from '../../../functions/alert'
import { setMoneyTableForNominas } from '../../../functions/setters'
import { Card } from 'react-bootstrap'
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
            clearFiles, onChangeAdjunto, nomina, generarComprasAxios } = this.props
        return (
            <Card className="card card-custom gutter-b example example-compact">
                <Card.Header>
                    <Card.Title>
                        <h3 className="card-label">{title}</h3>
                    </Card.Title>
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
                        <div className="form-group row form-group-marginless">
                            <div className="col-md-4">
                                <Input requirevalidation = { 1 } formeditado = { formeditado } name = "periodo"
                                    value = { form.periodo } placeholder = "PERIODO DE NÓMINA DE OBRA"
                                    onChange = { onChange } iconclass = "far fa-window-maximize"
                                    messageinc = "Incorrecto. Ingresa el periodo de nómina de obra." />
                            </div>
                            <div className="col-md-4">
                                <SelectSearch formeditado = { formeditado } options = { options.empresas }
                                    placeholder = "Selecciona la empresa" name = "empresa"
                                    value = { form.empresa } onChange = { (value) =>  { this.updateSelector(value, 'empresa') } }
                                    iconclass = "far fa-building" messageinc = "Incorrecto. Selecciona la empresa" />
                            </div>
                            <div className="col-md-4">
                                <SelectSearch formeditado = { formeditado } options = { options.proyectos }
                                    placeholder = "Selecciona el proyecto" name = "proyecto" value = { form.proyecto }
                                    onChange = { (value) =>  { this.updateSelector(value, 'proyecto') } } iconclass = "far fa-building"
                                    messageinc = "Incorrecto. Selecciona la empresa"
                                />
                            </div>
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless d-flex justify-content-center">
                            <div className="col-md-6 text-center">
                                <label className="col-form-label my-2 font-weight-bolder">Fecha de inicio - Fecha final</label><br />
                                <RangeCalendar onChange = { onChangeRange } start = { form.fechaInicio } end = { form.fechaFin } formeditado = { formeditado } />
                            </div>
                            {
                                formeditado !== 1 ?
                                    <>
                                        <div className="col-md-4 text-center">
                                            <label className="col-form-label my-2 font-weight-bolder">{form.adjuntos.adjunto.placeholder}</label>
                                            <ItemSlider
                                                items={form.adjuntos.adjunto.files}
                                                item='adjunto'
                                                handleChange={handleChange}
                                                multiple={true}
                                            />
                                        </div>
                                        
                                    </>
                                : ''
                            }
                        </div>
                        <div className="separator separator-dashed mt-1 mb-2"></div>
                        <div className="form-group row form-group-marginless mt-8">                                
                            <div className="col-md-12 d-flex align-items-center">
                                <a href = 'https://admin-proyectos.s3.us-east-2.amazonaws.com/rrhh/plantilla-nomina-obra.xlsx' target = '_blank' rel="noreferrer"
                                    className="btn btn-sm btn-bg-light btn-icon-success btn-hover-success font-weight-bolder text-success align-self-center mr-3" >
                                    <i className="far fa-file-excel text-success px-0"></i><span className="pl-2 ocultar-checador">DESCARGAR PLANTILLA</span>
                                </a>
                                <FileInput onChangeAdjunto = { onChangeAdjunto } placeholder = '¿Deseas importar la nómina?' value = { form.adjuntos.excel.value } 
                                    name = 'excel' id = 'file-upload' accept = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" 
                                    files = { form.adjuntos.excel.files } deleteAdjunto = { clearFiles } multiple = { false } 
                                    iconclass='flaticon2-clip-symbol text-primary'
                                    classbtn='btn btn-default btn-hover-icon-success font-weight-bolder btn-hover-bg-light text-hover-success text-dark-50 mb-0' />
                            </div>
                        </div>
                        <table className="table table-separate table-responsive-xl table_nominas_obras pt-5" id="tabla_obra">
                            <thead>
                                <tr>
                                    <th rowSpan="2"></th>
                                    <th rowSpan="2"><div className="mt-2 pb-3 font-size-sm">Colaborador</div></th>
                                    <th colSpan="3" className="pb-0 border-bottom-0 font-size-sm"><div>Jornada regular</div></th>
                                    <th colSpan="3" className="pb-0 border-bottom-0 font-size-sm"><div>Jornada nocturna</div></th>
                                    <th colSpan="4" className="pb-0 border-bottom-0 font-size-sm"><div>Extra y viáticos</div></th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Nómina IMSS</th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Restante Nómina</th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Extras</th>
                                    <th className="pb-0 border-bottom-0 font-size-sm ">Total</th>
                                </tr>
                                <tr>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> $ x hr</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> # hrs</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> TOTAL</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> $ x hr</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> # hrs</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> TOTAL</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> $ x hr</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> # hrs</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> VIÁTICOS</div> </th>
                                    <th className = 'pt-2' style={{ minWidth: "80px" }}> <div className="p-0 my-0 font-size-sm text-center"> TOTAL</div> </th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotalesByType("nominImss"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotalesByType("restanteNomina"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotalesByType("extras"))}</div></th>
                                    <th className="pt-2"><div className="p-0 my-0 text-primary bg-primary-o-40 font-weight-bolder font-size-sm ">{setMoneyTableForNominas(this.getTotales())}</div></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    form.nominasObra.map((nom, key) => {
                                        return(
                                            <tr key = { key }>
                                                <td className='text-center align-middle' style={{ minWidth: "60px" }}>
                                                    <Button icon='' onClick={() => { deleteRowNominaObra(nom, key) }}
                                                        className="btn btn-sm btn-icon btn-bg-white btn-icon-danger btn-hover-danger" only_icon="far fa-trash-alt icon-md text-danger" />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <SelectSearchSinText identificador = "empleado" formeditado = { formeditado } name = "usuario" 
                                                        options = { this.setOptions(key) } placeholder = "Selecciona el colaborador" value = { nom['usuario'] }
                                                        onChange={(value) => this.updateUsuario(value, key)} />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputMoneySinText identificador = "costo_hr_regular" requirevalidation = { 0 } formeditado = { formeditado }
                                                        name = "costo_hr_regular" value = { nom['costo_hr_regular'] } thousandseparator = { true } prefix = '$'
                                                        onChange = { e => onChangeNominasObra(key, e, 'costo_hr_regular') } />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputNumberSinText identificador = "total_hrs_regular" requirevalidation = { 0 }
                                                        formeditado = { formeditado } name = "total_hrs_regular" value = { nom['total_hrs_regular'] }
                                                        onChange = { e => onChangeNominasObra(key, e, 'total_hrs_regular') }
                                                        thousandseparator = { true } typeformat = "###########" />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <div className="p-0 my-0 font-size-sm"> 
                                                        { setMoneyTableForNominas(nom.costo_hr_regular * nom.total_hrs_regular) } 
                                                    </div>
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputMoneySinText identificador = "costo_hr_nocturna" requirevalidation = { 0 } formeditado = { formeditado }
                                                        name = "costo_hr_nocturna" value = { nom['costo_hr_nocturna'] } thousandseparator = { true } prefix = '$'
                                                        onChange = { e => onChangeNominasObra(key, e, 'costo_hr_nocturna') } />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputNumberSinText identificador = "total_hrs_nocturna" requirevalidation = { 0 }
                                                        formeditado = { formeditado } name = "total_hrs_nocturna" value = { nom['total_hrs_nocturna'] }
                                                        onChange = { e => onChangeNominasObra(key, e, 'total_hrs_nocturna') }
                                                        thousandseparator = { true } typeformat = "###########" />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <div className="p-0 my-0 font-size-sm"> 
                                                        { setMoneyTableForNominas(nom.costo_hr_nocturna * nom.total_hrs_nocturna) } 
                                                    </div>
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputMoneySinText identificador = "costo_hr_extra" requirevalidation = { 0 } formeditado = { formeditado }
                                                        name = "costo_hr_extra" value = { nom.costo_hr_extra } thousandseparator = { true } prefix = '$'
                                                        onChange = { e => onChangeNominasObra(key, e, 'costo_hr_extra') } />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputNumberSinText identificador = "total_hrs_extra" requirevalidation = { 0 }
                                                        formeditado = { formeditado } name = "total_hrs_extra" value = { nom.total_hrs_extra }
                                                        onChange = { e => onChangeNominasObra(key, e, 'total_hrs_extra') }
                                                        thousandseparator = { true } typeformat = "###########" />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputMoneySinText identificador = "viaticos" requirevalidation = { 0 } formeditado = { formeditado }
                                                        name = "viaticos" value = { nom.viaticos } thousandseparator = { true } prefix = '$'
                                                        onChange = { e => onChangeNominasObra(key, e, 'viaticos') } />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <div className="p-0 my-0 font-size-sm"> 
                                                        { setMoneyTableForNominas(parseFloat(nom.costo_hr_extra * nom.total_hrs_extra) + parseFloat(nom.viaticos ? nom.viaticos : 0.0)) } 
                                                    </div>
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <InputMoneySinText identificador = "nominImss" requirevalidation = { 0 } formeditado = { formeditado }
                                                        name = "nominImss" value = { nom.nominImss } onChange = { e => onChangeNominasObra(key, e, 'nominImss') }
                                                        thousandseparator = { true } prefix = '$' />
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <div className="p-0 my-0 font-size-sm"> 
                                                        { setMoneyTableForNominas(parseFloat(nom.costo_hr_regular * nom.total_hrs_regular) 
                                                            + parseFloat(nom.costo_hr_nocturna * nom.total_hrs_nocturna) - parseFloat(nom.nominImss ? nom.nominImss : 0.0))} 
                                                    </div>
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <div className="p-0 my-0 font-size-sm"> 
                                                        { setMoneyTableForNominas(parseFloat(nom.costo_hr_extra * nom.total_hrs_extra) + parseFloat(nom.viaticos ? nom.viaticos : 0.0)) } 
                                                    </div>
                                                </td>
                                                <td className='text-center align-middle' >
                                                    <div id="total" className="font-size-lg font-weight-bolder">
                                                        { setMoneyTableForNominas(this.getTotal(key)) }
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                        <div className="form-group d-flex justify-content-center">
                            <button type="button" className="btn btn-light-primary font-weight-bold mr-2" onClick={addRowNominaObra} >Agregar Fila</button>
                        </div>
                    </Card.Body>
                    <Card.Footer>
                        <div className="text-right">
                            <Button text='ENVIAR' type='submit' className="btn btn-primary mr-2" icon=''/>
                            { 
                                nomina !== '' ?  
                                    nomina.compras.length === 0 ?
                                        <Button text='GENERAR COMPRAS' className="btn btn-success mr-2" icon=''only_icon='fas fa-wallet mr-1'
                                            onClick = { (e) => { e.preventDefault(); generarComprasAxios(); } } />  
                                    : <></>         
                                : <></> 
                            }
                        </div>
                    </Card.Footer>
                </Form>
            </Card>
        )
    }
}

export default NominaObraForm