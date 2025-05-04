// ConfirmDeleteModal.jsx
import React from 'react';
import { Modal, Button, Alert } from 'react-bootstrap';

const ConfirmDeleteModal = ({ show, onHide, onConfirm, errorMessage }) => {

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirmation</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        Voulez-vous vraiment supprimer cet ingrédient ?
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Annuler</Button>
        <Button variant="danger" onClick={onConfirm}>Supprimer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmDeleteModal;
