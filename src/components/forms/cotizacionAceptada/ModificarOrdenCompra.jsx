import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { Card, Modal, Form } from 'react-bootstrap'
import ItemSlider from '../../singles/ItemSlider'
import { InputGray } from '../../form-components'
import { apiGet, catchErrors, apiPostFormData } from '../../../functions/api'
import { printResponseErrorAlert, validateAlert, waitAlert, doneAlert } from '../../../functions/alert'
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
    p?.pivot?.visto_bueno_temporal ||
    p?.pivot?.visto_bueno ||
    p?.url_temporal ||
    p?.url ||
    '';
const getPdfUrl = (p) => rewriteToNewBucket(pickPdfHref(p));


class ModificarOrdenCompra extends Component {
    state = {
        lead: '',
        modal: { orden_compra: false },
        form: { adjunto: '', numero_orden: '' }
    }

    componentDidMount = () => {
        const { lead } = this.props
        this.getLead(lead)
    }

    getLead = async (leadParam) => {
        const { at } = this.props
        apiGet(`v3/leads/crm/${leadParam.id}/presupuesto/aceptado`, at)
            .then(async (response) => {
                const lead = response.data.lead
                await this.ensurePresignedOC(lead)     // ⬅️ firma si hace falta
                this.setState({ ...this.state, lead })
            }, printResponseErrorAlert)
            .catch(catchErrors)
    }
    ensurePresignedOC = async (lead) => {
        const { at } = this.props
        const pdfs = lead?.presupuesto_diseño?.pdfs || []
        const requests = pdfs.map(async (p) => {
            if (!p?.pivot?.visto_bueno_temporal && p?.pivot?.visto_bueno) {
                try {
                    const key = encodeURIComponent(p.pivot.visto_bueno)
                    const { data } = await apiGet(`v3/leads/crm/${lead.id}/presign?key=${key}`, at)
                    p.pivot.visto_bueno_temporal = data.url
                } catch (e) {
                    // si falla, seguimos con rewriteToNewBucket (puede 403 si es privado)
                }
            }
        })
        await Promise.all(requests)
    }
    // ✅ más robusto
    hasOrdenCompra = (lead) => Boolean(lead?.presupuesto_diseño?.pdfs?.length)

    handleCloseOrden = () => {
        const { modal } = this.state
        let { form } = this.state
        modal.orden_compra = false
        form.adjunto = ''
        form.numero_orden = ''
        this.setState({ ...this.state, modal, form })
    }

    onSubmitOrden = async () => {
        const { form, lead } = this.state
        const { at } = this.props
        waitAlert();
        const data = new FormData()
        data.append('file', form.adjunto);
        data.append('orden', form.numero_orden);
        data.append('_method', 'PUT')   // 👈 Laravel lo interpretará como PUT
        apiPostFormData(`v3/leads/crm/${lead.id}/orden-compra`, data, at)
            .then(() => {
                doneAlert('La orden de compra fue modificada con éxito.', () => {
                    this.handleCloseOrden(); this.getLead(lead);
                })
            }, (error) => { printResponseErrorAlert(error) })
            .catch((error) => { catchErrors(error) })
    }

    onClickOrden = () => {
        const { modal } = this.state
        modal.orden_compra = true
        this.setState({ ...this.state, modal })
    }

    onChange = (value, name) => {
        const { form } = this.state
        form[name] = value
        this.setState({ ...this.state, form })
    }

    changeNameFile(id) {
        const f = document.getElementById(id).files?.[0]?.name || 'Subir orden de compra (PDF)';
        document.getElementById('info').innerHTML = f;
    }

    render() {
        const { lead, modal, form } = this.state
        return (
            <>
                <Card className='card card-custom gutter-b'>
                    <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                        <div className="font-weight-bold font-size-h4 text-dark">ORDEN DE COMPRA</div>
                        <div className="card-toolbar">
                            <button
                                type="button"
                                className="btn btn-sm btn-flex btn-light-success font-weight-bolder align-items-center px-2 py-1"
                                onClick={(e) => { e.preventDefault(); this.onClickOrden(); }}>
                                <span className="svg-icon svg-icon-md"><SVG src={toAbsoluteUrl('/images/svg/Edit.svg')} /></span>
                                <div>Modificar orden de compra</div>
                            </button>
                        </div>
                    </Card.Header>

                    <Card.Body className='pt-0'>
                        {this.hasOrdenCompra(lead) && (
                            <ItemSlider
                                items={(lead.presupuesto_diseño?.pdfs || [])
                                    .filter(p => p?.pivot?.orden_compra || p?.pivot?.visto_bueno)
                                    .map(p => {
                                        const url = p.url_temporal || p?.pivot?.visto_bueno_temporal || getPdfUrl(p)
                                        return {
                                            url,
                                            name: p.name || 'Orden de compra.pdf',
                                            type: 'pdf',
                                        }
                                    })
                                    .filter(it => it.url)
                                    .reverse()   // 👈 invertir el orden: primero el más nuevo
                                }
                            />

                        )}
                    </Card.Body>

                </Card>

                <Modal show={modal.orden_compra} onHide={this.handleCloseOrden} centered contentClassName='swal2-popup d-flex w-28rem'>
                    <Modal.Header className="border-0 justify-content-center text-center font-size-h4 p-0 mt-3 font-weight-bold text-dark">
                        MODIFICAR ORDEN DE COMPRA
                    </Modal.Header>
                    <Modal.Body className='p-0'>
                        <Form id="form-orden" onSubmit={(e) => { e.preventDefault(); validateAlert(this.onSubmitOrden, e, 'form-orden') }}>
                            <div className='row mx-0 justify-content-center'>
                                <div className="col-md-12 mt-6">
                                    <div className="row mx-0 form-group-marginless">
                                        <div className="col-md-12 text-justify p-0">
                                            <InputGray
                                                withtaglabel={0} withtextlabel={0} withplaceholder={1}
                                                withicon={1} iconclass='las la-shopping-cart icon-xl'
                                                requirevalidation={0}
                                                value={form.numero_orden}
                                                name='numero_orden'
                                                onChange={(e) => { this.onChange(e.target.value, 'numero_orden') }}
                                                swal={true}
                                                placeholder='NÚMERO DE ORDEN DE COMPRA'
                                            />
                                        </div>
                                    </div>

                                    <div className="separator separator-dashed mt-5 mb-2"></div>

                                    <div className="form-group row form-group-marginless mt-5 mb-0">
                                        <div className="col-md-12 p-0">
                                            <label htmlFor="adjunto" className="drop-files col-md-11">
                                                <i className="las la-file-pdf icon-xl text-primary"></i>
                                                <input
                                                    id="adjunto"
                                                    type="file"
                                                    onChange={(e) => { this.onChange(e.target.files[0], 'adjunto'); this.changeNameFile('adjunto') }}
                                                    name='adjunto'
                                                    accept="application/pdf"
                                                />
                                                <div className="font-weight-bolder font-size-md ml-2 col-11 pl-0 text-truncate" id="info">
                                                    Subir orden de compra (PDF)
                                                </div>
                                            </label>
                                            {form.adjunto === '' ? (
                                                <span className="form-text text-danger is-invalid font-size-xs text-center">
                                                    Adjunta la orden (PDF)
                                                </span>
                                            ) : null}
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
                            MODIFICAR
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default ModificarOrdenCompra
