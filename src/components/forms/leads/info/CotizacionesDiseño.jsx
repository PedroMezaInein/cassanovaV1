import React, { Component } from 'react'
import { Card, Dropdown, DropdownButton } from 'react-bootstrap'
import { setNaviIcon } from '../../../../functions/setters'
import HistorialCotizacionesDiseño from '../info/HistorialCotizacionesDiseño'
import PresupuestoDiseñoCRMForm from '../../leads/info/PresupuestoDiseñoCRMForm'
class CotizacionesDiseño extends Component {
    state = {
        activeCotizacion: ''
    }
    componentDidMount() {
        const { lead } = this.props
        let { activeCotizacion } = this.state
        if(this.hasCorizaciones(lead)){
            activeCotizacion = 'historial'
        }else{
            activeCotizacion = 'new'
        }
        this.setState({
            activeCotizacion
        })
    }
    getTitle = () => {
        const { activeCotizacion } = this.state
        const { lead } = this.props
        switch(activeCotizacion){
            case 'new':
                if(!this.hasCorizaciones(lead)){
                    return 'NUEVA COTIZACIÓN'
                }else{
                    return 'ACTUALIZAR COTIZACIÓN'
                }
            case 'historial':
                return 'COTIZACIONES GENERADAS'
            case 'contratar':
                return 'CONVERTIR LEAD'
            default:
                return ''
        }
    }
    onClickCotizacion = (type) => {
        this.setState({
            ...this.state,
            activeCotizacion: type
        })
    }
    hasCorizaciones (lead){
        if(lead)
            if(lead.presupuesto_diseño)
                if(lead.presupuesto_diseño.pdfs)
                    if(lead.presupuesto_diseño.pdfs.length)
                        return true
        return false
    }
    changePageContratar = (pdf) => {
        const { au } = this.props
        console.log(`AU`, au)
        /* window.location.href = `http://localhost:3001?tag=${au.access_token}` */

        /* window.location.href = '/enrollment-form/citizenship'; */
        const { history, lead } = this.props
        
        history.push({ pathname: '/leads/crm/contratar', state: { lead: lead, cotizacionId : pdf} })
    }
    render() {
        const { lead, sendPresupuesto, options, formDiseño, onChange, onChangeConceptos, checkButtonSemanas, onChangeCheckboxes,
            onSubmit, submitPDF, formeditado, onClickTab, activeKey, defaultKey, onChangePartidas} = this.props
        const { activeCotizacion } = this.state
        return (
            <>
                <Card className='card card-custom gutter-b'>
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">{this.getTitle()}</div>
                        <div className="card-toolbar">
                            <div className="card-toolbar toolbar-dropdown">
                                <DropdownButton menualign="right" title={<span className="d-flex">OPCIONES <i className="las la-angle-down icon-md p-0 ml-2"></i></span>} id='dropdown-proyectos' >
                                    {
                                        activeCotizacion === 'historial' ?
                                        <Dropdown.Item className="text-hover-success dropdown-success" onClick={() => { this.onClickCotizacion('new')}}>
                                            {setNaviIcon(`las icon-lg la-${!this.hasCorizaciones(lead)?'plus':'edit'}`, `${!this.hasCorizaciones(lead)?'AGREGAR NUEVA COTIZACIÓN':'MODIFICAR COTIZACIÓN'}`)}
                                        </Dropdown.Item>
                                        :<></>
                                    }
                                    {
                                        ( activeCotizacion === 'new' && this.hasCorizaciones(lead) ) || ( activeCotizacion === 'contratar' ) ?
                                            <Dropdown.Item className="text-hover-info dropdown-info" onClick={() => { this.onClickCotizacion('historial')}}>
                                                {setNaviIcon(`las la-clipboard-list icon-lg`, 'HISTORIAL DE COTIZACIONES')}
                                            </Dropdown.Item>
                                        :<></>
                                    }
                                </DropdownButton>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body>
                        {
                            activeCotizacion === 'historial' ?
                                <HistorialCotizacionesDiseño pdfs={lead.presupuesto_diseño.pdfs} sendPresupuesto={sendPresupuesto} changePageContratar={this.changePageContratar} />
                            : activeCotizacion === 'new' ?
                                <PresupuestoDiseñoCRMForm
                                    options={options}
                                    formDiseño={formDiseño}
                                    onChange={onChange}
                                    onChangeConceptos={onChangeConceptos}
                                    checkButtonSemanas={checkButtonSemanas}
                                    onChangeCheckboxes={onChangeCheckboxes}
                                    onSubmit={onSubmit}
                                    submitPDF={submitPDF}
                                    formeditado={formeditado}
                                    onClickTab={onClickTab}
                                    activeKey={activeKey}
                                    defaultKey={defaultKey}
                                    onChangePartidas={onChangePartidas}
                                />
                            : <></>
                        }
                    </Card.Body>
                </Card>
            </>
        )
    }
}

export default CotizacionesDiseño