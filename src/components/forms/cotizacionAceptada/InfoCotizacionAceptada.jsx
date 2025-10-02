import React, { Component } from 'react'
import { Card, Modal, Form } from 'react-bootstrap'
import ItemSlider from '../../singles/ItemSlider'
import { apiGet, catchErrors, apiPostFormResponseBlob } from '../../../functions/api'
import { printResponseErrorAlert, validateAlert, waitAlert, doneAlert } from '../../../functions/alert'
import SVG from "react-inlinesvg"
import { InputGray, InputNumberGray } from '../../form-components'
import { toAbsoluteUrl } from "../../../functions/routers"

// ===== Helpers S3 (TOP-LEVEL, fuera de la clase) =====
const RAW_S3_BASE = (process.env.REACT_APP_S3_BASE || 'https://adminpruebas.s3.us-east-2.amazonaws.com/').replace(/\/+$/, '');
const S3_BASE = `${RAW_S3_BASE}/`;
const NEW_HOST = new URL(S3_BASE).host;

const encodePath = (pathname) =>
    String(pathname).split('/').map(seg => encodeURIComponent(seg)).join('/');

// ⬅️ Nuevo: detectar si la URL YA es presignada
const isPresigned = (href) => {
    try {
        const u = new URL(href);
        const sp = u.searchParams;
        return sp.has('X-Amz-Signature') || sp.has('X-Amz-Algorithm') || sp.has('X-Amz-Credential');
    } catch {
        return false;
    }
};

const rewriteToNewBucket = (href) => {
    if (!href) return '';

    // ⬅️ Clave: si ya es presignada, NO tocarla
    if (/^https?:\/\//i.test(href) && isPresigned(href)) return href;

    try {
        const u = new URL(href);

        // path-style viejo
        if (u.host === 's3.us-east-2.amazonaws.com' && u.pathname.startsWith('/inein-aws/')) {
            const key = u.pathname.replace(/^\/inein-aws\//, '');
            return `${S3_BASE}${encodePath(key)}`;
        }

        // virtual-hosted viejos
        if (u.host === 'inein-aws.s3.us-east-2.amazonaws.com' || u.host === 'inein-aws.s3-us-east-2.amazonaws.com') {
            const key = u.pathname.replace(/^\/+/, '');
            return `${S3_BASE}${encodePath(key)}`;
        }

        // ya es adminpruebas (pero NO presignada): solo asegurar encoding
        if (u.host === NEW_HOST) {
            const key = u.pathname.replace(/^\/+/, '');
            return `${S3_BASE}${encodePath(key)}`;
        }

        // otros hosts se dejan igual
        return href;
    } catch {
        // si no es URL absoluta, tratar como key
        const key = String(href).replace(/^\/+/, '');
        return `${S3_BASE}${encodePath(key)}`;
    }
};

// Prioridad de campos (igual que antes)
const pickPdfHref = (p) =>
    p?.url_temporal ||
    p?.pivot?.visto_bueno_temporal ||
    p?.url ||
    p?.pivot?.visto_bueno ||
    '';

const getPdfUrl = (p) => {
    const raw = pickPdfHref(p);
    return rewriteToNewBucket(raw);
};


class InfoCotizacionAceptada extends Component {
    state = {
        lead: '',
        modal: {
            orden_compra: false,
            modal_recibo: false
        },
        form: {
            total: 0.0,
            fecha: new Date().toISOString().slice(0, 10), // <- string YYYY-MM-DD
            descripcion: '',
            diviza_pesos: '', // queda sin seleccionar por default
        }
    }

    componentDidMount = () => {
        const { lead } = this.props
        this.getLead(lead)
    }

    getLead = async (lead) => {
        const { at } = this.props
        apiGet(`v3/leads/crm/${lead.id}/presupuesto/aceptado`, at).then((response) => {
            const { lead } = response.data
            this.setState({ ...this.state, lead })
        }, (error) => { printResponseErrorAlert(error) }).catch((error) => { catchErrors(error) })
    }

    hasPresupuesto = (lead) => Boolean(lead?.presupuesto_diseño?.pdfs?.length)

    handleCloseOrden = () => {
        const { modal } = this.state
        let { form } = this.state
        modal.modal_recibo = false
        form.adjunto = ''
        form.numero_orden = ''
        this.setState({ ...this.state, modal, form })
    }

    onSubmitOrden = async () => {
        const { form, lead, modal } = this.state
        const { at } = this.props

        const previewTab = window.open('', '_blank')
        try {
            waitAlert()
            const res = await apiPostFormResponseBlob(`ticket-pdf/lead/pdf/${lead.id}`, form, at)

            const ct = (res.headers && (res.headers['content-type'] || (res.headers.get && res.headers.get('content-type')))) || ''
            if (ct.includes('application/json')) {
                const text = await (res.data.text ? res.data.text() : new Response(res.data).text())
                let msg = 'Ocurrió un error generando el PDF.'
                try { msg = JSON.parse(text).message || msg } catch (_) { }
                throw new Error(msg)
            }

            const blob = res.data instanceof Blob ? res.data : new Blob([res.data], { type: 'application/pdf' })
            const url = URL.createObjectURL(blob)

            if (previewTab) {
                previewTab.location = url
            } else {
                const a = document.createElement('a')
                a.href = url
                a.download = `Recibo-${lead?.id || ''}.pdf`
                document.body.appendChild(a)
                a.click()
                a.remove()
            }

            this.setState({ ...this.state, modal: { ...modal, modal_recibo: false } })
            doneAlert('El PDF fue generado correctamente.')
            setTimeout(() => URL.revokeObjectURL(url), 10000)
        } catch (err) {
            if (previewTab) previewTab.close()
            printResponseErrorAlert(err)
        }
    }

    onClickOrden = () => {
        const { modal } = this.state
        modal.modal_recibo = true
        this.setState({ ...this.state, modal })
    }

    onChange = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    onChangee = (e) => {
        if (!e) return
        let { name, value } = e.target
        let { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    // Unificada (radio + numérico)
    onChangePresupuesto = (e) => {
        if (!e) return
        const { name, value, type } = e.target || {}
        const { form } = this.state

        if (type === 'radio') {
            form[name] = String(value) === 'true'
        } else {
            // limpia $, comas, etc.
            let v = typeof value === 'string' ? value : String(value ?? '')
            v = v.replace(/,/g, '').replace(/\$/g, '')
            form[name] = v
        }
        this.setState({ ...this.state, form })
    }

    onChangeFecha = (ev) => {
        const { form } = this.state
        form.fecha = ev?.target?.value || ''
        this.setState({ ...this.state, form })
    }

    render() {
        const { lead, modal, form } = this.state
        return (
            <>
                <Card className='card card-custom gutter-b'>
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">COTIZACIÓN ACEPTADA</div>
                        <div className="card-toolbar">
                            <button
                                type="button"
                                className="btn btn-sm btn-flex btn-light-success font-weight-bolder align-items-center px-2 py-1"
                                onClick={(e) => { e.preventDefault(); this.onClickOrden(); }}>
                                <span className="las la-user-tie icon-xl"></span>
                                <div> Generar recibo</div>
                            </button>
                        </div>
                    </Card.Header>

                    <Card.Body className='pt-0'>
                        {this.hasPresupuesto(lead) && (
                            <ItemSlider
                                items={(lead.presupuesto_diseño?.pdfs || [])
                                    .map(p => ({ url: getPdfUrl(p), name: p.name || 'Presupuesto.pdf', type: 'pdf' }))
                                    .filter(it => it.url)}
                            />
                        )}
                    </Card.Body>
                </Card>

                <Modal show={modal.modal_recibo} onHide={this.handleCloseOrden} centered contentClassName='swal2-popup d-flex w-28rem'>
                    <Modal.Header className="border-0 justify-content-center text-center font-size-h4 p-0 mt-3 font-weight-bold text-dark">
                        Recibo de pago
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        <Form id="form-orden" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }}>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12 mt-6">
                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify p-0">
                                            <InputNumberGray
                                                withtaglabel={1}
                                                withtextlabel={1}
                                                withplaceholder={1}
                                                withicon={1}
                                                withformgroup={0}
                                                requirevalidation={0}
                                                placeholder="TOTAL"
                                                value={form.total}
                                                iconclass={"fas fa-dollar-sign"}
                                                thousandseparator={true}
                                                onChange={this.onChangePresupuesto}
                                                name="total"
                                            />
                                        </div>
                                    </div>

                                    <div className="row mx-0 form-group-marginless">
                                        <div className="form-group row form-group-marginless mt-5 mb-0">
                                            <div className="col-md-12 text-justify p-0">
                                                <div>
                                                    <label className="col-form-label text-dark-75 font-weight-bold font-size-lg">Tipo de cambio</label>
                                                    <div className="radio-inline">
                                                        <label className="radio">
                                                            <input type="radio" name='diviza_pesos' value={true}
                                                                onChange={this.onChangePresupuesto}
                                                                checked={form.diviza_pesos === true} />MXN
                                                            <span></span>
                                                        </label>
                                                        <label className="radio">
                                                            <input type="radio" name='diviza_pesos' value={false}
                                                                onChange={this.onChangePresupuesto}
                                                                checked={form.diviza_pesos === false} />USD
                                                            <span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify p-0">
                                            <InputGray
                                                withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                                withicon={1} withformgroup={0} requirevalidation={1}
                                                onChange={this.onChangee}
                                                name="descripcion" type="text" value={form.descripcion}
                                                placeholder="CONCEPTO"
                                                messageinc="Incorrecto. Ingresa la descripcción."
                                            />
                                        </div>

                                        <div className="col-md-12">
                                            <InputGray
                                                withtaglabel={1} withtextlabel={1} withplaceholder={1}
                                                withicon={1} withformgroup={0} requirevalidation={1}
                                                onChange={this.onChangeFecha} name="fecha"
                                                type="date" value={form.fecha} placeholder="Fecha"
                                                iconclass="fas fa-user" messageinc="Incorrecto. Ingresa la fecha."
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='border-0 justify-content-center pb-3 pt-8'>
                        <button type="button" className="btn btn-md d-flex place-items-center btn-light font-weight-bold mt-0"
                            onClick={this.handleCloseOrden}>
                            CANCELAR
                        </button>
                        <button type="button" className="btn btn-md d-flex place-items-center btn-primary2 font-weight-bold mt-0"
                            onClick={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }}>
                            DESCARGAR
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default InfoCotizacionAceptada
