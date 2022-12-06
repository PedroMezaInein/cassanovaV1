import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { URL_DEV } from '../../../../../constants';
import { setSingleHeader } from '../../../../../functions/routers';
import ItemSlider from '../../../../../components/singles/ItemSlider'

import S3 from 'react-aws-s3';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function ProgramaNecesidades() {
    const userAuth = useSelector((state) => state.authUser);
    const [files, setFiles] = useState(null)
    const [fileUrl, setFileUrl] = useState(null)
    const [s3Auth, setS3Auth] = useState(null)

    useEffect(() => { 
        let actualUrl = window.location.href
        actualUrl = actualUrl.split('/')
        setFileUrl(actualUrl[actualUrl.length - 1])
        getAuthS3()
    }, [])
    
    const handleChange = (e) => { 
        setFiles(e.target.files);
    }

    const getAdjuntos = () => { 
        axios.get(`${URL_DEV}v2/proyectos/proyectos/proyecto/${fileUrl}/adjuntos`, { headers: setSingleHeader(userAuth.access_token) })
        .then(res => {
            console.log(res.data);
        })
    }

    const getAuthS3 = () => {
        axios.get(`${URL_DEV}v1/constant/admin-proyectos`, { headers: setSingleHeader(userAuth.access_token) })
        .then(res => {
            setS3Auth(res.data)
        })
    }

    const handleUpload = (e) => {
        e.preventDefault()
        let filePath = `proyecto/${fileUrl}/fotografias_levantamiento/${Math.floor(Date.now() / 1000)}-`
        
        let aux = []
        files.forEach(file => {
            aux.push(file)
        })
        let auxPromises = aux.map((file) => {
            return new Promise((resolve, reject) => {
                new S3(s3Auth.alma).uploadFile(file, `${filePath}${file.name}`)
                    .then((data) => {
                        const { location, status } = data
                        if (status === 204)
                            resolve({ name: file.name, url: location })
                        else
                            reject(data)
                    }).catch(err => reject(err))
            })
        })
        Promise.all(auxPromises).then(values => {
            try {
                axios.post(`${URL_DEV}v2/proyectos/proyectos/adjuntos/${fileUrl}/s3`, { archivos: values },
                    {
                        params: { tipo: 'fotografias_levantamiento' },
                        headers: setSingleHeader(userAuth.access_token)
                    })
                    .then((response) => {

                    })
                    .catch((error) => {
                        console.error(error, 'error')
                    })
            } catch (error) {
                console.error(error, 'error')
            }
        })
        .catch(err => console.error(err))
    }

    console.log(s3Auth);

    return (
        <>
            <div>
                <div>
                    <button onClick={e => getAdjuntos()}>Ver Adjuntos</button>

                </div>
                <div>
                    <label htmlFor="file">Selecciona un archivo</label>
                    <input type="file" id="file" onChange={handleChange} multiple />
                </div>
                <button onClick={e => handleUpload(e)}>Subir Archivo</button>
            </div>

            <div>
                {/* <ItemSlider /> */}
            </div>

        </>
    )
}