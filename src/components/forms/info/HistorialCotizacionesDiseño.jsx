import React, { Component } from 'react'
import { Card, Col, OverlayTrigger, Tooltip } from 'react-bootstrap'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../../functions/routers"
import { dayDMY, setMoneyText } from "../../../functions/setters"
import ItemSlider from '../../singles/ItemSlider'
import { CommonLottie, SearchNotFound } from '../../Lottie'

// ===== Helpers de URL (S3 / absolutas) =====
const RAW_S3_BASE = process.env.REACT_APP_S3_BASE || ''
const FALLBACK_S3 = 'https://adminpruebas.s3.us-east-2.amazonaws.com/' // <-- ajusta a tu bucket real si es otro
const S3_BASE = (RAW_S3_BASE || FALLBACK_S3).replace(/\/+$/, '') + '/'

const isHttpUrl = (u) => {
  if (!u) return false
  try { const x = new URL(u); return x.protocol === 'http:' || x.protocol === 'https:' }
  catch { return /^https?:\/\//i.test(String(u)) }
}

// Codifica cada segmento para no romper los '/'
const encodeS3Key = (key) => String(key)
  .replace(/^\/+/, '')
  .split('/')
  .map(s => encodeURIComponent(s))
  .join('/')

const resolveUrl = (u) => {
  if (!u) return ''
  if (isHttpUrl(u)) return u           // ya es absoluta/prefirmada
  return S3_BASE + encodeS3Key(u)      // compón absoluta a S3
}

const getPdfUrl = (pdfObj) => {
  const raw =
    pdfObj?.url_temporal ??
    pdfObj?.url ??
    pdfObj?.pivot?.url ??
    pdfObj?.ruta ??
    pdfObj?.path ??
    ''
  return resolveUrl(raw)
}

// Abre en nueva pestaña y evita que el router/accordion intercepte el click
const openPdf = (e, url) => {
  e.preventDefault()
  e.stopPropagation()
  if (!url) return
  window.open(url, '_blank', 'noopener,noreferrer')
}

class HistorialCotizacionesDiseño extends Component {
  state = {
    openId: null, // control del acordeón (sin mutar props)
  }

  handleAccordion = (id) => {
    this.setState(({ openId }) => ({
      openId: openId === id ? null : id
    }))
  }

  getEsquema(name) {
    if (!name) return ''
    return String(name).split('-', 1)[0]
  }

  labelStatus = (pdfObj) => {
    if (pdfObj.pivot.fecha_envio === null) {
      return (
        <span className="label-status" style={{ backgroundColor: '#f0e3fd', color: '#764ca2' }}>
          Sin enviar
        </span>
      )
    }
    if (pdfObj.pivot.motivo_rechazo) {
      return (
        <span className="label-status" style={{ backgroundColor: '#ffe6ee', color: '#f73967' }}>
          Rechazado
        </span>
      )
    }
    if (pdfObj.pivot.fecha_aceptacion) {
      return (
        <span className="label-status" style={{ backgroundColor: '#E1F0FF', color: '#2171c1' }}>
          Aceptado
        </span>
      )
    }
    return (
      <span className="label-status" style={{ backgroundColor: '#E0F2F1', color: '#26A69A' }}>
        En espera
      </span>
    )
  }

  addOrden = (pdfObj) => {
    return !!(pdfObj.pivot.fecha_envio && pdfObj.pivot.motivo_rechazo === null)
  }

  render() {
    const { pdfs = [], sendPresupuesto, onClickOrden, filtering = {} } = this.props
    const { openId } = this.state

    return (
      <div className="table-responsive">
        <div className="list min-w-500px col-md-12 px-0">
          <div className="accordion accordion-light accordion-svg-toggle">
            {pdfs.length > 0 ? (
              pdfs.map((pdf, index) => {
                const isActive = openId === pdf.id
                const viewUrl = getPdfUrl(pdf) // <- ¡Dentro del map!
                const temporalUrl =
                  pdf?.url_temporal ||
                  pdf?.pivot?.url_temporal || // por si viene en pivot
                  null;


                return (
                  <Card key={index} className={`min-w-xxs-700px w-auto ${isActive ? 'border-top-0' : ''}`} >
                    <Card.Header>
                      <Card.Title
                        className={`rounded-0 px-3 ${isActive ? 'text-primary2 collapsed bg-light' : 'text-dark'}`}
                        onClick={() => { this.handleAccordion(pdf.id) }}
                      >
                        <span className={`svg-icon ${isActive ? 'svg-icon-primary2' : 'svg-icon-dark'}`}>
                          <SVG src={toAbsoluteUrl('/images/svg/Angle-right.svg')} />
                        </span>

                        <div className="card-label ml-3 w-100 d-flex">
                          <div className="w-70 d-flex">
                            <div className="w-40">
                              <div className="font-size-lg">
                                <span className="font-size-sm">ID</span>. {pdf.pivot.identificador}
                              </div>
                              <div className="font-weight-light font-size-sm text-dark-75">
                                {dayDMY(pdf.created_at)} - {this.getEsquema(pdf.name)}
                              </div>
                            </div>

                            <div className="w-30 d-flex justify-content-center align-self-center">
                              <div className="font-weight-light font-size-sm align-items-center">
                                <b>Con iva:</b>
                                <span className="text-dark ml-2">{setMoneyText(pdf.pivot.costo)}</span>
                              </div>
                            </div>

                            <div className="w-30 d-flex justify-content-center align-self-center">
                              <div className="font-weight-light font-size-sm align-items-center">
                                <b>Sin iva:</b>
                                <span className="text-dark ml-2">{setMoneyText(pdf.pivot.costo_sin_iva)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="w-30 d-flex align-self-center">
                            <div className="align-self-center w-70 text-center">
                              {this.labelStatus(pdf)}
                            </div>

                            <div className="w-30 d-flex justify-content-end">
                              {pdf.pivot.fecha_envio === null ? (
                                <OverlayTrigger
                                  rootClose
                                  overlay={<Tooltip><span className='font-weight-bolder'>ENVIAR A CLIENTE</span></Tooltip>}
                                >
                                  <span
                                    onClick={(e) => { e.preventDefault(); sendPresupuesto(pdf) }}
                                    className={`btn btn-icon ${isActive ? 'btn-color-info2' : ''} btn-active-light-info2 w-30px h-30px`}
                                  >
                                    <i className="las la-envelope icon-xl"></i>
                                  </span>
                                </OverlayTrigger>
                              ) : null}

                              <OverlayTrigger
                                rootClose
                                overlay={<Tooltip><span className='font-weight-bolder'>VER PDF</span></Tooltip>}
                              >
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.stopPropagation()}
                                  onClick={(e) => openPdf(e, viewUrl)}
                                  className={`btn btn-icon ${isActive ? 'btn-color-primary2' : ''} btn-active-light-primary2 w-30px h-30px ml-3`}
                                  aria-label="Ver PDF"
                                >
                                  <i className="las la-file-pdf icon-xl mt-1"></i>
                                </button>
                              </OverlayTrigger>
                            </div>
                          </div>
                        </div>
                      </Card.Title>
                    </Card.Header>

                    <Card.Body className={`card-body px-10 ${isActive ? 'collapse show' : 'collapse'}`}>
                      {this.addOrden(pdf) ? (
                        <div className="d-flex col-md-9 mx-auto my-6 justify-content-between">
                          <div className="text-justify">
                            <span className="font-weight-light">
                              <span className="font-weight-bolder"><u>Fecha de envio:</u> </span>{dayDMY(pdf.pivot.fecha_envio)}
                            </span>
                          </div>

                          <div
                            className="d-flex align-items-center bg-light-primary2 rounded p-1 cursor-pointer w-fit-content"
                            onClick={(e) => { e.preventDefault(); onClickOrden('add-orden', pdf) }}
                          >
                            <span className="svg-icon svg-icon-primary2 mr-1">
                              <span className="svg-icon svg-icon-md">
                                <SVG src={toAbsoluteUrl('/images/svg/Question-circle.svg')} />
                              </span>
                            </span>
                            <div className="d-flex font-weight-bolder text-primary2 font-size-sm">
                              Aceptar o rechazar cotización
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <Col md={10} className="mx-auto text-center mt-8">
                        <ItemSlider
                          items={[
                            {
                              url_temporal: viewUrl,   // 👈 lo que pide ItemSlider
                              name: pdf.name || 'Presupuesto.pdf',
                              id: pdf.id,              // opcional, por si borras
                              type: 'pdf'
                            }
                          ]}
                        />

                      </Col>

                      {pdf.pivot.motivo_rechazo !== null ? (
                        <div className="mt-5 text-justify font-weight-light col-md-9 mx-auto">
                          <div className="text-justify mb-3 mt-8">
                            <span className="font-weight-light">
                              <span className="font-weight-bolder">Fecha de envio: </span>{dayDMY(pdf.pivot.fecha_envio)}
                            </span>
                          </div>
                          <span className="font-weight-bolder">MOTIVO DE RECHAZO:</span> {pdf.pivot.motivo_rechazo}
                        </div>
                      ) : null}
                    </Card.Body>
                  </Card>
                )
              })
            ) : (pdfs.length === 0 && filtering.status_filtering) ? (
              <>
                <div className="col-md-4 mx-auto">
                  <CommonLottie animationData={SearchNotFound} />
                </div>
                <div className="text-center font-weight-bold font-size-h6">No se encontró la cotización</div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    )
  }
}

export default HistorialCotizacionesDiseño
