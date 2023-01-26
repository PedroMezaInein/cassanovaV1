import React, {useState, useEffect} from 'react'
import Layout from '../../components/layout/layout'
import { connect } from 'react-redux'
import { AreasForm } from '../../components/forms'
import { URL_DEV, AREAS_COLUMNS, AREAS_COMPRAS_COLUMNS, AREAS_GASTOS_COLUMNS, PUSHER_OBJECT } from '../../constants'
import { Modal } from '../../components/singles'
import axios from 'axios'
import Swal from 'sweetalert2'
import { AreaCard } from '../../components/cards'
import NewTableServerRender from '../../components/tables/NewTableServerRender'
import { waitAlert, errorAlert, printResponseErrorAlert, doneAlert, customInputAlert, deleteAlert } from '../../functions/alert'
import { setOptions, setTextTableReactDom, setTagLabelAreaReactDom, setTextTable } from '../../functions/setters'
import { Tabs, Tab } from 'react-bootstrap'
import { Update } from '../../components/Lottie'
import { InputGray, DoubleSelectSearchGray, SelectSearchGray } from '../../components/form-components'
import { printSwalHeader } from '../../functions/printers'
import Echo from 'laravel-echo';
import { setSingleHeader } from '../../functions/routers'
import $ from "jquery";
import { renderToString } from 'react-dom/server'
import MiModal from 'react-bootstrap/Modal'
import { EdithSubArea } from '../../components/cards/Catalogos/EdithSubArea'

import TablaGeneral from '../../components/NewTables/TablaGeneral/TablaGeneral'
import { intersectRanges } from '@fullcalendar/core'
import ModalAgregar from '../../components/forms/catalogos/Areas/Modales-Gastos/ModalAgregar'
import {ModalEditarSub} from '../../components/forms/catalogos/Areas/Modales-Gastos/ModalEditarSub'
import useOptionsArea from '../../hooks/useOptionsArea'

export default function Areas2(){






    return(
        <>
        </>
    )
}