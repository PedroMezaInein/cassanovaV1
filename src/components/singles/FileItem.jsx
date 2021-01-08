import React, { Component } from 'react'
import { Extension } from 'typescript';

class FileItem extends Component{

    getIcon = () => {
        const { item } = this.props
        let exten = item.name.split('.');
        if(exten.length === 0)
            return 'fas fa-file';
        exten = exten[exten.length - 1]
        switch(exten.toUpperCase()){
            case 'PDF':
                return 'fas fa-file-pdf'
            case 'XLSX': case 'XLSM': case 'XLSB': case 'XLTX': case 'XLTM': case 'XLS':
            case 'XLT': case 'XLAM': case 'XLA': case 'XLW': case 'XLR': case 'CSV':
                return 'fas fa-file-excel'
            case 'DOC': case 'DOCX': case 'DOCM': case 'DOT': case 'DOTM': case 'DOTX':
                return 'fas fa-file-word'
            case 'PPTX': case 'PPTM': case 'PPT': case 'POTX': case 'PPSX': case 'PPSM': case 'PPS':
                return 'fas fa-file-powerpoint'
            case 'MP3': case 'MID': case 'MIDI': case 'WAV': case 'WMA': case 'CDA': 
            case 'AAC': case 'AC3': case 'FLAC':
                return 'fas fa-file-audio'
            case 'M1V': case 'MP2V': case 'MP4': case 'MPA': case 'MPE': case 'MPEG': case 'mpg': case 'MPV2':
            case 'MOV': case 'QT': case 'QTL': case 'WM': case 'WMV': case 'AVI':
                return 'fas fa-file-video'
            case 'BMP': case 'GIF': case 'JPEG': case 'JPG': case 'PNG': case 'PSD': case 'AI':
            case 'CDR': case 'DWG': case 'SVG': case 'RAW': case 'NEF':
                return 'fas fa-file-image'
            default:
                return 'fas fa-file';
        }
    }
    
    render(){
        const { item, onClickDelete } = this.props
        return(
            <div className = 'text-center folder border' >
                <div className = 'd-flex justify-content-center'>
                    <div>
                        <span className='btn btn-icon btn-s text-danger text-hover-danger my-2' onClick = { (e) => { e.preventDefault(); onClickDelete(item) } } >
                            <i className="fas fa-trash icon-xs text-danger" />
                        </span>
                    </div>
                </div>
                <div className = 'position-relative d-flex justify-content-center'>
                    <a href = { item.url } target = '_blank'>
                        <i className = {`${this.getIcon()} text-primary hover-primary text-hover-primary font-xxx-large text-hover`} />
                    </a>
                </div>
                <div className = 'mt-2'>
                    <a href = { item.url } className = 'text-transform-none' target = '_blank'>
                        {item.name}
                    </a>
                </div>
            </div>
        )
    }
}

export default FileItem