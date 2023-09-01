import React,{ useState } from 'react'
import {useEffect} from 'react'
import { useSelector } from 'react-redux'
import Modal from 'react-bootstrap/Modal'
import Layout from "../../components/layout/layout";
import SubirComunicado from "../../components/forms/Comunicados/SubirComunicado";

import { apiGet, apiPostForm } from "../../functions/api";
import '../../styles/_comunicados.scss'

export default function Comunicados(){
    const auth = useSelector(state => state.authUser.access_token)
    const usuario = useSelector(state => state.authUser)
    const [show, setShow] = useState(false);
    const [filtros, setFiltros] = useState({
        name: '',
        date: '',
    })
    const [files, setFiles] = useState(false)
    
    let prop = {
        pathname: '/rh/comunicados',
    }

    useEffect(() => {
        getInfo()
    }, [])

    const getInfo = () => {
        try {
            apiGet('comunicado', auth)
            .then(res => {
                let archivos = res.data.comunicado.map((file) => {
                    return {
                        id: file.adjuntos[0]? file.adjuntos[0].id : '',
                        name: file.nombre,
                        date: file.Fecha_comunicado.slice(0,10),
                        url: file.adjuntos[0] ? file.adjuntos[0].url : '',
                        id_comunicado: file.id
                    }
                })
                setFiles(archivos)
                setFilterFiles(archivos)
            })
            
        } catch (error) {
        }
    }
    
    const [filterFiles, setFilterFiles] = useState(files)
    
    const handleSearch = (e) => {
        e.preventDefault()
        setFiltros({
            ...filtros,
            [e.target.name]: e.target.value
        })
        let search = e.target.value
        let campo = e.target.name
        let result = files.filter(file => file[campo].includes(search))
        setFilterFiles(result)
    }

    const resetFilter = () => {
        setFilterFiles(files)
        setFiltros({
            name: '',
            date: '',
        })
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleView = (viewComunicado) => {
        try {
            apiPostForm('comunicado/add', viewComunicado, auth)
        } catch (error) {
            
        }
    }

    return(
        <>
            <Layout authUser={auth} location={prop} history={{location: prop}} active='plataforma'>
                <div className='comunicados'>
                    <div>
                        <h1>Comunicados</h1>
                        <div className="btn-subir">
                                <button onClick={handleShow}> + Subir Comunicado </button>
                        </div>
                        <div className="filtros-comunicados" > 
                            <div className="input-gray">
                               <label>Fecha</label>
                                <input value={filtros.date} type='date' name="date" onChange={handleSearch}/> 
                            </div>

                            <div className="input-gray">
                                <label>Nombre</label>
                                <input  value={filtros.name} type='text' name="name" onChange={handleSearch}/>
                            </div>
                            <div>
                                <button onClick={resetFilter}>Borrar filtros</button>
                            </div>

                        </div>
                        
                    </div>
                    <hr/>
                    <div className='comunicados-container'>
                        {
                            filterFiles[0] ? filterFiles.map((item, index) => {
                                let viewComunicado = {
                                    id_comunicado: item.id_comunicado,
                                    empleado_id: usuario.user.empleado_id
                                }
                                return(
                                    <div key={index} className="comunicado">
                                        <div className="date">
                                            <div>{item.date}</div>
                                        </div>
                                        <object
                                            data={item.url}
                                            
                                            type="application/pdf"
                                        >
                                        </object>
                                        <div className="btn-comunicado">
                                            <a href={`${item.url}`} target="_blank" ><button onClick={e=>handleView(viewComunicado)}>Ver comunicado {item.name}</button></a>
                                        </div>
                                    </div>  
                                )
                                
                            }):<>sin datos</>
                        } 
                    </div>
                </div>
            </Layout>
            <Modal size="md"  show={show} onHide={handleClose} centered={true} keyboard={true}>
                <Modal.Header>
                    <Modal.Title>Subir Comunicado</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <SubirComunicado getinfo={getInfo} handleClose={handleClose}/>
                </Modal.Body>
                    
            </Modal>

        </>
    )
}