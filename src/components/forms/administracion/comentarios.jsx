import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Swal from 'sweetalert2';
import { apiPostForm, apiGet } from '../../../functions/api';
import { Modal, Table, Button, Form } from 'react-bootstrap';
import Style from './NuevaRequisicion.module.css';
import './../../../styles/_nuevaRequisicion.scss';

export default function Comentarios(props) {
  const { data, handleClose, reload, opciones, estatusCompras } = props;
  const user = useSelector((state) => state.authUser);
  const [selectedItem1, setSelectedItem1] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleSeleccionTabla1 = (item) => {
    setSelectedItem1(item);
  };

  useEffect(() => {
    // Fetch comments data
    apiGet(`requisicion/comentario/${data.id}`, user.access_token)
      .then((res) => {
        if (Array.isArray(res.data.data)) {
          setComments(res.data.data);
        } else {
          console.error('API response for comments is not an array:', res.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  }, [data.id, user.access_token]);

  const handleAddComment = () => {
    // Add new comment to the API and update the comments state
    apiPostForm('requisicion/comentario', { requisitionId: data.id, comment: newComment }, user.access_token)
      .then((res) => {
        // console.log(res.data.data)
        setComments([...comments, res.data.data]); // Update comments state with the new comment
        setNewComment(''); // Clear the new comment input
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
      });
  };

  const formatDate = (dateTimeString) => {
    const dateObject = new Date(dateTimeString);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('es-ES', options).format(dateObject);
  };

  return (
    <>
      <div className="container">
        <div style={{ marginLeft: '2.5rem' }}>
        {/* <Form> */}
              <Form.Group controlId="formComment">
                <Form.Label>Add Comment</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleAddComment}>
                Agregar Comentario
              </Button>
            {/* </Form> */}
         

          {/* Comments table and form */}
          <div className="tabla2">
            <h5>Comentario</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Comentario</th>
                  <th>Usuario</th>
                  <th>Fecha</th>

                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.comentario}</td>
                    <td>{comment.usuario ? comment.usuario.name : 'Unknown User'}</td>
                    <td>{comment.created_at ? formatDate(comment.created_at) : 'Unknown Date'}</td>

                  </tr>
                ))}
              </tbody>
            </Table>
           
          </div>
        </div>
      </div>
    </>
  );
}
