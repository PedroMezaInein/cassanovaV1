import React, { Component } from 'react'
import SVG from "react-inlinesvg";
import { toAbsoluteUrl } from "../../functions/routers"
import { dayDMY } from '../../functions/setters'
class FileItem extends Component {

    getIcon = () => {
        const { item } = this.props
        let exten = item.name.split('.');
        if (exten.length === 0)
            return 'fas fa-file';
        exten = exten[exten.length - 1]
        switch (exten.toUpperCase()) {
            case 'PDF':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/PDF.svg')} />;
            case 'CSV':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/CSV.svg')} />;
            case 'XLS':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/XLS.svg')} />;
            case 'JPG':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/JPG.svg')} />;
            case 'PNG':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/PNG.svg')} />;
            case 'GIF':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/GIF.svg')} />;
            case 'SVG':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/SVG.svg')} />;
            case 'MOV':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/MOV.svg')} />;
            case 'WAV':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/WAV.svg')} />;
            case 'PSD':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/PSD.svg')} />;
            case 'WMV':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/WMV.svg')} />;
            case 'DWG':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/DWG.svg')} />;
            case 'AI':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/AI.svg')} />;
            case 'AVI':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/AVI.svg')} />;
            case 'DOC': case 'DOCX': case 'DOCM': case 'DOT': case 'DOTM': case 'DOTX':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/DOC.svg')} />;
            case 'XLSX': case 'XLSM': case 'XLSB': case 'XLTX': case 'XLTM':
            case 'XLT': case 'XLAM': case 'XLA': case 'XLW': case 'XLR':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/XLS.svg')} />;
            case 'PPTX': case 'PPTM': case 'PPT': case 'POTX': case 'PPSX': case 'PPSM': case 'PPS':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/PPT.svg')} />;
            case 'MP3': case 'MID': case 'MIDI': case 'WMA': case 'CDA':
            case 'AAC': case 'AC3': case 'FLAC':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/MP3.svg')} />;
            case 'M1V': case 'MP2V': case 'MP4': case 'MPA': case 'MPE': case 'MPEG': case 'mpg': case 'MPV2':
            case 'QT': case 'QTL': case 'WM':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/MP4.svg')} />;
            case 'BMP': case 'JPEG': case 'CDR': case 'RAW': case 'NEF':
                return <SVG src={toAbsoluteUrl('/images/svg/Files/JPG.svg')} />;
            default:
                return <SVG src={toAbsoluteUrl('/images/svg/Files/FILE.svg')} />;
        }
    }

    render() {
        const { item, onClickDelete, anotherDate, secondDate } = this.props
        return (<tr>
            <td className="pl-1">
                <a href={item.url} target='_blank' rel="noopener noreferrer">
                    <div className="row mx-0 row-paddingless">
                        <div className="col-auto svg-icon svg-icon-3x mr-3">
                            {this.getIcon()}
                        </div>
                        <div className="col text-dark-75 font-weight-bolder text-hover-primary font-size-lg align-self-center">{item.name}</div>
                    </div>
                </a>
            </td>
            <td className="text-center">
                <span className="text-muted font-weight-bold">
                    {dayDMY(item.created_at)}
                </span>
            </td>
            {
                secondDate ?
                    anotherDate.length === 0 ?
                        <td className="text-center">
                            <span className="text-muted font-weight-bold">
                                -
                            </span>
                        </td>
                        :
                        <td className="text-center">
                            <span className="text-muted font-weight-bold">
                                {dayDMY(anotherDate)}
                            </span>
                        </td>
                    : ''
            }
            {onClickDelete && (<td className="pr-0 text-right">
                <span className='btn btn-icon btn-s text-danger text-hover-danger my-2' onClick={(e) => { e.preventDefault(); onClickDelete(item) }} >
                    <i className="fas fa-trash icon-md text-muted text-hover-danger"></i>
                </span>
            </td>)}
        </tr>
        )
    }
}

export default FileItem