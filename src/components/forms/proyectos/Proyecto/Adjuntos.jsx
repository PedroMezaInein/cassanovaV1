import React, { Component } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import { URL_DEV, URL_ASSETS } from '../../../../constants'
import { Card, Nav, Tab, Row, Col } from 'react-bootstrap'
import { errorAlert, printResponseErrorAlert, waitAlert, doneAlert } from '../../../../functions/alert'
import ItemSlider from '../../../../components/singles/ItemSlider'
import { setSingleHeader } from '../../../../functions/routers'
import S3 from 'react-aws-s3';
import withReactContent from 'sweetalert2-react-content'
import { toAbsoluteUrl } from "../../../../functions/routers"
import SVG from "react-inlinesvg";
const MySwal = withReactContent(Swal)
const chunkSize = 1048576 * 3;
class Adjuntos extends Component {
    state = {
        primeravista: true,
        showadjuntos: [
            {
                placeholder: 'Fotografías levantamiento',
                id: 'fotografias_levantamiento',
                value: '',
                files: []
            },
            {
                placeholder: 'Manuales de adaptación',
                id: 'manuales_de_adaptacion',
                value: '',
                files: []
            },
            {
                placeholder: 'Minutas',
                id: 'minutas',
                value: '',
                files: []
            },
            {
                placeholder: 'Oficios',
                id: 'oficios',
                value: '',
                files: []
            },
            {
                placeholder: 'Planos entregados por cliente',
                id: 'planos_entregados_por_cliente',
                value: '',
                files: []
            },
            {
                placeholder: 'Propuestas arquitectónicas preliminares',
                id: 'propuestas_arquitectonicas_preliminares',
                value: '',
                files: []
            },
            {
                placeholder: 'Referencias del diseño del proyecto',
                id: 'referencias_del_diseño_del_proyecto',
                value: '',
                files: []
            },
            {
                placeholder: 'Renders',
                id: 'renders',
                value: '',
                files: []
            },
            {
                placeholder: 'Sketch Up',
                id: 'sketch_up',
                value: '',
                files: []
            },
            {
                placeholder: 'Presupuestos preliminares',
                id: 'presupuestos_preliminares',
                value: '',
                files: []
            },
            {
                placeholder: 'Carta oferta',
                id: 'carta_oferta',
                value: '',
                files: []
            }
        ],
        defaultactivekey: "",
        proyecto: '',
        adjuntos: [],
        chunked: {
            showProgress: false,
            progress: 0,
            counter: 1,
            begin: 0,
            end: chunkSize,
            filesize: 0,
            totalCount: 1,
            fileID: '',
            file: '',
            type: ''
        },
        form: {
            adjuntos_grupo: [
                {
                    text: 'Inicio y planeación',
                    id: 'inicio_y_planeacion',
                    icon: 'la la-clipboard-list',
                    adjuntos: [
                        {
                            placeholder: 'Fotografías levantamiento',
                            id: 'fotografias_levantamiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Manuales de adaptación',
                            id: 'manuales_de_adaptacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas',
                            id: 'minutas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Oficios',
                            id: 'oficios',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos entregados por cliente',
                            id: 'planos_entregados_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Propuestas arquitectónicas preliminares',
                            id: 'propuestas_arquitectonicas_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Referencias del diseño del proyecto',
                            id: 'referencias_del_diseño_del_proyecto',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders',
                            id: 'renders',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up',
                            id: 'sketch_up',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos preliminares',
                            id: 'presupuestos_preliminares',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carta oferta',
                            id: 'carta_oferta',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Ejecución de obra',
                    id: 'ejecucion_de_obra',
                    icon: 'la la-hard-hat',
                    adjuntos: [
                        {
                            placeholder: 'Datos de cliente',
                            id: 'datos_de_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato cliente',
                            id: 'contrato_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Contrato proveedores y contratistas',
                            id: 'contrato_proveedores_y_contratistas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Firmas de aprobación',
                            id: 'firmas_de_aprobacion',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte fotográfico de avance de obra',
                            id: 'reporte_fotografico_de_avance_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de materiales',
                            id: 'reporte_de_materiales',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Reporte de proyecto vs ejecutado',
                            id: 'reporte_de_proyecto_vs_ejecutado',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Minutas de obra',
                            id: 'minutas_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuesto aprobado por cliente',
                            id: 'presupuesto_aprobado_por_cliente',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Programa de obra',
                            id: 'programa_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos durante obra',
                            id: 'planos_durante_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Sketch Up aprobados',
                            id: 'sketch_up_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Renders aprobados',
                            id: 'renders_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estados de cuenta',
                            id: 'estados_de_cuenta',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Estimaciones y cierre',
                            id: 'estimaciones_y_cierre',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fianzas y seguros',
                            id: 'fianzas_y_seguros',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Permisos de obra ante dependencias',
                            id: 'permisos_de_obra_ante_dependencias',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Presupuestos extras',
                            id: 'presupuestos_extras',
                            value: '',
                            files: []
                        }
                    ]
                },
                {
                    text: 'Entrega',
                    id: 'entrega',
                    icon: 'la las la-star-o',
                    adjuntos: [
                        {
                            placeholder: 'Catálogo de conceptos ASBUILT',
                            id: 'catalogo_de_conceptos_asbuilt',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Consignas de matenimiento',
                            id: 'consignas_de_matenimiento',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Planos aprobados',
                            id: 'planos_aprobados',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de los equipos',
                            id: 'garantia_de_los_equipos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Garantía de vicios ocultos',
                            id: 'garantia_de_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias de cálculo',
                            id: 'memorias_de_calculo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Memorias descriptivas',
                            id: 'memorias_descriptivas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fichas técnicas',
                            id: 'fichas_tecnicas',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Pruebas de instalaciones',
                            id: 'pruebas_de_instalaciones',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Fotografías fin de obra',
                            id: 'fotografias_fin_de_obra',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Acta de entrega',
                            id: 'acta_de_entrega',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Carpeta de entrega ZIP',
                            id: 'carpeta_de_entrega_zip',
                            value: '',
                            files: []
                        },
                    ]
                },
                {
                    text: 'Mantenimiento',
                    id: 'mantenimiento',
                    icon: 'la la-tools',
                    adjuntos: [
                        {
                            placeholder: 'Fallas y reparaciones por vicios ocultos',
                            id: 'fallas_y_reparaciones_por_vicios_ocultos',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento preventivo',
                            id: 'mantenimiento_preventivo',
                            value: '',
                            files: []
                        },
                        {
                            placeholder: 'Mantenimiento correctivo',
                            id: 'mantenimiento_correctivo',
                            value: '',
                            files: []
                        },
                    ]
                },
            ],
            adjuntos: {
                adjunto_comentario: {
                    value: '',
                    placeholder: 'Adjunto',
                    files: []
                }
            }
        }
    }

    componentDidMount() {
        const { proyecto } = this.props
        this.getAdjuntos(proyecto)
    }
    
    getAdjuntos = async (proyecto) => {
        const { at } = this.props
        waitAlert()
        await axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${proyecto.id}/adjuntos`, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                const { proyecto } = response.data
                this.setState({
                    ...this.state,
                    proyecto: proyecto
                })
                Swal.close()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    seleccionaradj(adjuntos) {
        const { proyecto } = this.state;
        let newdefaultactivekey = "";
        for (var i = 0; i < adjuntos.length; i++) {
            var adjunto = adjuntos[i];
            if (proyecto[adjunto.id].length) {
                newdefaultactivekey = adjunto.id
                break;
            }
        }
        this.setState({
            ...this.state,
            primeravista: false,
            defaultactivekey: newdefaultactivekey,
            subActiveKey: newdefaultactivekey,
            showadjuntos: adjuntos
        })
    }
    updateActiveTabContainer = active => { this.setState({ ...this.state, subActiveKey: active }) }

    async getProyectoAdjuntosZip(array) {
        const { at } = this.props
        const { proyecto } = this.state
        let aux = { tipo: array }
        waitAlert()
        await axios.post(URL_DEV + 'proyectos/' + proyecto.id + '/adjuntos/zip', aux, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                Swal.close()
                const url = URL_ASSETS + '/storage/adjuntos.zip'
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', proyecto.nombre + '.zip'); //or any other extension
                document.body.appendChild(link);
                link.click();
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    /* -------------------------------------------------------------------------- */
    /*                            ANCHOR INICIA CHUNKS                            */
    /* -------------------------------------------------------------------------- */

    handleChange = async (files, item) => {
        waitAlert()
        console.log(item)
        const { proyecto } = this.state
        let filePath = `proyecto/${proyecto.id}/${item}/${Math.floor(Date.now() / 1000)}-`
        let aux = []
        files.forEach((file) => {
            aux.push(file)
        })
        console.log(files)
        console.log(aux)
        if (aux.length) {
            const { at } = this.props
            await axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(at) }).then(
                (response) => {
                    const { alma } = response.data
                    let auxPromises = aux.map((file) => {
                        return new Promise((resolve, reject) => {
                            new S3(alma).uploadFile(file, `${filePath}${file.name}`)
                                .then((data) => {
                                    const { location, status } = data
                                    if (status === 204)
                                        resolve({ name: file.name, url: location })
                                    else
                                        reject(data)
                                }).catch(err => reject(err))
                        })
                    })
                    console.log(auxPromises)
                    Promise.all(auxPromises).then(values => { this.addS3FilesAxios(values, item, proyecto) }).catch(err => console.error(err))
                }, (error) => { printResponseErrorAlert(error) }
            ).catch((error) => {
                errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                console.error(error, 'error')
            })
        }
    }
    addS3FilesAxios = async (arreglo, tipo, proyecto) => {
        const { at } = this.props
        let parametros = { tipo: tipo }
        waitAlert()
        try {
            await axios.post(`${URL_DEV}v2/proyectos/proyectos/adjuntos/${proyecto.id}/s3`, { archivos: arreglo.archivos },
                {
                    params: parametros,
                    headers: setSingleHeader(at)
                }).then(
                    (response) => {
                        doneAlert('Adjunto generado con éxito')
                        this.getAdjuntos(proyecto)
                    }, (error) => { printResponseErrorAlert(error) }
                ).catch((error) => {
                    errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
                    console.error(error, 'error')
                })
        } catch (error) { console.error("error", error); }
    }
    /* -------------------------------------------------------------------------- */
    /*                               DELETE ADJUNTO                               */
    /* -------------------------------------------------------------------------- */
    deleteFile = element => {
        MySwal.fire({
            title: '¿DESEAS ELIMINAR EL ARCHIVO?',
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: 'ACEPTAR',
            cancelButtonText: 'CANCELAR',
            reverseButtons: true,
            customClass: {
                content: 'd-none',
                confirmButton: 'btn-light-danger-sweetalert2',
                cancelButton: 'btn-light-gray-sweetalert2'
            }
        }).then((result) => {
            if (result.value) {
                waitAlert()
                this.deleteAdjuntoAxios(element.id)
            }
        })
    }
    async deleteAdjuntoAxios(id) {
        const { at } = this.props
        const { proyecto } = this.state
        await axios.delete(URL_DEV + 'proyectos/' + proyecto.id + '/adjunto/' + id, { headers: { Authorization: `Bearer ${at}` } }).then(
            (response) => {
                const { proyecto } = response.data
                doneAlert(response.data.message !== undefined ? response.data.message : 'El proyecto fue eliminado con éxito.')
                this.setState({
                    ...this.state,
                    proyecto: proyecto,
                    adjuntos: this.setAdjuntosSlider(proyecto)
                })
            },
            (error) => {
                printResponseErrorAlert(error)
            }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.error(error, 'error')
        })
    }
    setAdjuntosSlider = proyecto => {
        let auxheaders = []
        let aux = []
        auxheaders.map((element) => {
            aux.push({
                id: element.name,
                text: element.placeholder,
                files: proyecto[element.name],
                form: element.form,
                url: ''
            })
            return false
        })
        return aux
    }
    render() {
        const { form, showadjuntos, primeravista, subActiveKey, defaultactivekey, proyecto } = this.state
        return (
            <Card className="card-custom gutter-b">
                <Card.Header className="border-0 align-items-center pt-8 pt-md-0">
                    <div className="font-weight-bold font-size-h4 text-dark">ADJUNTOS DEL PROYECTO</div>
                </Card.Header>
                <Card.Body>
                    <Nav className="nav nav-pills nav-primary2 nav-bolder d-flex flex-nowrap nav-center hover-scroll-x white-space-nowrap">
                        {
                            form.adjuntos_grupo.map((grupo, key) => {
                                return (
                                    <Nav.Item as="li" className="mr-2" key={key}>
                                        <Nav.Link data-toggle="tab" className={`rounded ${primeravista && key === 0 ? "active" : ""}`} eventKey={grupo.id} onClick={() => { this.seleccionaradj(grupo.adjuntos) }}>
                                            <span className="nav-icon"> <i className={`icon-lg ${grupo.icon}`}></i> </span>
                                            <span className="nav-text"> {grupo.text} </span>
                                        </Nav.Link>
                                    </Nav.Item>
                                )
                            })
                        }
                    </Nav>
                    <Tab.Container activeKey={subActiveKey ? subActiveKey : defaultactivekey} defaultActiveKey={defaultactivekey} onSelect={(select) => { this.updateActiveTabContainer(select) }}>
                        <Row className="mx-0 mt-10">
                            <Col md={4} className="navi navi-primary2 navi-accent nav-bold d-flex align-items-center">
                                <Nav variant="pills" className="flex-column navi navi-accent nav-bolder width-inherit rounded" style={{backgroundColor:'#f5f8fa'}}>
                                    {
                                        showadjuntos.map((adjunto, key) => {
                                            return (
                                                <Nav.Item className="navi-item mx-0" key={key}>
                                                    <Nav.Link className="navi-link rounded-0 bg-active" eventKey={adjunto.id}>
                                                        <span className="navi-text">{adjunto.placeholder}</span>
                                                    </Nav.Link>
                                                </Nav.Item>
                                            )
                                        })
                                    }
                                </Nav>
                            </Col>
                            <Col md={8} className="py-5 align-self-center">
                                <Tab.Content>
                                    {
                                        showadjuntos.map((adjunto, key) => {
                                            return (
                                                <Tab.Pane key={key} eventKey={adjunto.id}>
                                                    {
                                                        proyecto ?
                                                            proyecto[adjunto.id] ?
                                                                <div className="">
                                                                    <div className={`d-flex justify-content-${proyecto[adjunto.id].length ?'between':'center'} mb-5`}>
                                                                        {
                                                                            proyecto[adjunto.id].length ?
                                                                                <div className="d-flex align-items-center bg-light-info rounded px-3 py-2 cursor-pointer" onClick={(e) => { e.preventDefault(); this.getProyectoAdjuntosZip([adjunto.id]) }}>
                                                                                    <span className="svg-icon svg-icon-info mr-1">
                                                                                        <span className="svg-icon svg-icon-lg">
                                                                                            <SVG src={toAbsoluteUrl('/images/svg/DownloadedFile.svg')} />
                                                                                        </span>
                                                                                    </span>
                                                                                    <div className="d-flex font-weight-bolder text-info font-size-13px">
                                                                                        Descargar ZIP
                                                                                    </div>
                                                                                </div>
                                                                            : ''
                                                                        }
                                                                        <div className="d-flex align-items-center bg-light-success rounded px-3 py-2 cursor-pointer">
                                                                            <label htmlFor="file-upload" className="d-flex mb-0 align-items-center">
                                                                                <span className="svg-icon svg-icon-success mr-1">
                                                                                    <span className="svg-icon svg-icon-lg">
                                                                                        <SVG src={toAbsoluteUrl('/images/svg/Attachment2.svg')} />
                                                                                    </span>
                                                                                </span>
                                                                                <div className="d-flex font-weight-bolder text-success font-size-13px">
                                                                                    Adjuntar archivo
                                                                                </div>
                                                                            </label>
                                                                            
                                                                            <input id="file-upload" type="file" placeholder={form.adjuntos.adjunto_comentario.placeholder}
                                                                                onChange={(e) => { e.preventDefault(); this.handleChange(e.target.files, subActiveKey) }} multiple
                                                                                value={form.adjuntos.adjunto_comentario.value} name='adjunto_comentario' accept="image/*, application/pdf" />
                                                                        </div>
                                                                        {/* <div>
                                                                            <label htmlFor="file-upload" className="drop-files font-weight-bolder text-primary2">
                                                                                <i className="flaticon-attachment text-primary2"></i> Adjuntar archivo
                                                                            </label>
                                                                            <input id="file-upload" type="file" placeholder={form.adjuntos.adjunto_comentario.placeholder}
                                                                                onChange={(e) => { e.preventDefault(); this.handleChange(e.target.files, subActiveKey) }} multiple
                                                                                value={form.adjuntos.adjunto_comentario.value} name='adjunto_comentario' accept="image/*, application/pdf" />
                                                                        </div> */}
                                                                    </div>
                                                                    <div>
                                                                        <ItemSlider items={proyecto[adjunto.id]} item={adjunto.id} deleteFile={this.deleteFile}  /* handleChange = { this.handleChange } */ />
                                                                    </div>
                                                                </div>
                                                                : ''
                                                            : ''
                                                    }
                                                </Tab.Pane>
                                            )
                                        })
                                    }
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </Card.Body>
            </Card>
        )
    }
}

export default Adjuntos