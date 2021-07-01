import React, { Component } from 'react'
import { Small} from '../texts'
import FileXMLViewer from '../form-components/FileXMLViewer'
export class ShowFile extends Component {

    downloadFile = item => {
        const url = item.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.name);
        document.body.appendChild(link);
        link.click();
    }
    xml = async(url)  => {
        /* await axios.get(url, { headers: setSingleHeader(null)}).then(
            (response) => {
                waitAlert()
            }, (error) => { printResponseErrorAlert(error) }
        ).catch((error) => {
            errorAlert('Ocurrió un error desconocido catch, intenta de nuevo.')
            console.log(error, 'error')
        }) */
        var req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.overrideMimeType('text/plain; charset=x-user-defined');
        req.send(null);
        if (req.status !== 200) return '';
        return req.responseText;
    }
    printSelectiveFile = () => {
        const { item } = this.props
        let arreglo = []
        let extension = ''
        if(item.name)
            arreglo = item.name.split('.')
        if(arreglo.length)
            extension = arreglo[arreglo.length - 1].toUpperCase()
        switch(extension){
            case 'PDF':
                return(
                    <div className="w-100 text-align-last-center">
                        <iframe title = { item.name} src = { item.url} className="pdfview" />
                    </div>
                )
            case 'JPG':
            case 'JPEG':
            case 'GIF':
            case 'PNG':
                return(
                    <div className="text-center">
                        <img alt = '' className="rounded img-responsive" src = { item.url } style={{width:'60%', height:'60%'}}/>
                    </div>
                )
            case 'MP4':
                return(
                    <video className = 'w-100 text-align-last-center' controls>
                        <source src = { item.url } type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                )
            case 'XML':
                return(
                    <div className="xml-view">
                        <FileXMLViewer xml={this.xml(item.url)}/>
                    </div>
                )
            default:
                return(
                    <div id = "descarga" className = "btn btn-hover p-2 rounded pdfview d-flex align-items-center justify-content-center mx-auto" 
                        onClick = { () => { this.downloadFile(item) } } >
                        <div>
                            <i className={"fas fa-file m-0 kt-font-boldest text-primary"}></i>
                            <br />
                            <Small className="text-center" color="gold"> Descarga </Small>
                        </div>
                    </div>
                )
        }
        
    }
    
    render(){
        return(
            <div>
                {
                    this.printSelectiveFile()
                }
            </div>
        )
    }
}