import React, { Component } from 'react'
import { Small} from '../texts'

export class ShowFile extends Component {

    downloadFile = item => {
        const url = item.url;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', item.name);
        document.body.appendChild(link);
        link.click();
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
                    <div className="w-100 pb-2">
                        <iframe title = { item.name} src = { item.url} className="pdfview" />
                    </div>
                )
            case 'JPG':
            case 'JPEG':
            case 'GIF':
            case 'PNG':
                return(
                    <img alt = '' className="p-2 rounded pdfview-img" src = { item.url } style={{ width: "100", height: "100" }} />
                )
            case 'MP4':
                return(
                    <video className = 'w-100' controls>
                        <source src = { item.url } type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
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