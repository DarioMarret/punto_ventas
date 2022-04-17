import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    CardHeader,
    CardBody,
    NavItem,
    NavLink,
    Nav,
    Progress,
    Table,
    Container,
    Row,
    Col,
} from "reactstrap";
// layout for this page
import Admin from "layouts/Admin.js";
import Header from "components/Headers/Header.js";
import axios from 'axios'
import TextField from "@material-ui/core/TextField"
import { TablePaging } from 'table-page-search';
import { getDatosUsuario } from '../../../function/localstore/storeUsuario';
import moment from 'moment';
import Modal from 'react-modal';
import { ESTADO, FORMAPAGO } from '../../../function/util/global';


const headerConfig = {
    key: "id",
    itemsPerPage: 8,
    defaultSort: "lastName",
    sortDescending: true,
    columns: [
        { fieldForSort: "secuencia", columnLabel: "Secuencia", headerCellStyle: { width: 80 }, disableCellClick: true },
        { fieldForSort: "forma_pago", columnLabel: "Forma Pago", disableCellClick: false },
        { fieldForSort: "total", columnLabel: "Total", disableCellClick: true },
        { fieldForSort: "fecha_creacion", columnLabel: "Fecha", disableCellClick: true },
        { fieldForSort: "empresa", columnLabel: "Empresa", disableCellClick: true },
        { fieldForSort: "estado", columnLabel: "Estado" },
    ]
};
const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};


function reporteventa(props) {
    const [loading, setloading] = useState(true);
    const [filterText, setfilterText] = useState(false);
    const [modalIsOpen, setIsOpen] = useState(false)
    const [removeStyling, setremoveStyling] = useState(true);
    const [editar, seteditar] = useState({
        secuencia: null,
        forma_pago: null,
        total: null,
        fecha_creacion: null,
        estado: null,
        empresa: null,
    });
    const [venta, setventa] = useState([]);

    function openModal(row) {
        seteditar(row)
        setIsOpen(true);
    }

    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        subtitle.style.color = '#f00';
    }

    function closeModal() {
        setIsOpen(false);
    }

    useEffect(async() => {
        await CargarListaReporte()
        setTimeout(() => {
            setloading(false);
        }, 1000)
    }, []);
    const CargarListaReporte=async()=>{
        let empresa = getDatosUsuario().data.empresa
        let fecha = moment().format('DD/MM/YYYY')
        const { data } = await axios.get(`/api/reporte?empresa=${empresa}&fecha=${fecha}`)
        if(data.success){
            setventa(data.data)
        }
    }
    const handleChange = (value) => {
        console.log(value);
        setfilterText(value);
    };
    const handleChangeEstado = async (e) => {
        const { data } = await axios.put(`/api/reporte`,{editar, [e.target.name]:e.target.value})
        await CargarListaReporte()
    }
    return (
        <>
            <Header />
            {/* <div style={{padding:'60px'}}/> */}
            <Card className="shadow">
                <div style={{ display: "flex" }}>
                    <h4 style={{ marginLeft: 20 }}>
                        Reporte Venta 
                    </h4>
                    <TextField
                        label="Buscador"
                        style={{ marginLeft: 40 }}
                        vaule={filterText}
                        onChange={(e) => handleChange(e.target.value)}
                    />
                </div>
                <TablePaging
                    loading={loading}
                    dataList={venta}
                    headerConfig={headerConfig}
                    filterText={filterText}
                    onRowClick={(row)=>openModal(row)}
                    tableStyleName={removeStyling ? "" : "stripe-table"}
                    useMaterialUiPaging={true} />
            </Card>
            <Modal
                isOpen={modalIsOpen}
                // onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <p style={{
                    fontSize: '20px',
                    fontWeight: "bold",
                }}
                >
                Secuencia:{editar.secuencia}<br></br> 
                Total: ${editar.total} <br></br>
                Forma de Pago: {editar.forma_pago} <br></br>
                Estado: {editar.estado}</p>
                {/* <input /> */}
                <select name="forma_pago" id="" className="form-control" onChange={(e) =>handleChangeEstado(e)}>
                    {
                        FORMAPAGO.map((iten,index)=>(
                            editar.forma_pago == iten.E ?
                            <option key={index} value={iten.M} selectd >{iten.E}</option>  
                            : <option key={index} value={iten.M} selectd >{iten.E}</option>
                        ))
                    }
                </select>
                <select name="estado" id="" className="form-control" onChange={(e) =>handleChangeEstado(e)}>
                    {
                        ESTADO.map((iten,index)=>(
                            editar.estado == iten.E ?
                            <option key={index} value={iten.M} selected >{iten.E}</option>  
                            : <option key={index} value={iten.M} selected >{iten.E}</option>
                        ))
                    }
                </select>
            </Modal>
        </>
    );
}

reporteventa.layout = Admin;
export default reporteventa;