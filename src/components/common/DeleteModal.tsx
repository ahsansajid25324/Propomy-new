import { Modal, Button, Spinner } from "react-bootstrap";

interface DeleteModalProps {
  show: boolean;
  onHide: () => void;
  onConfirm: () => void;
  loading?: boolean;

  propertyAddress?: string;
}

const DeleteModal = ({
  show,
  onHide,
  onConfirm,
  loading = false,
  propertyAddress,
}: DeleteModalProps) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the property{" "}
        <strong>{propertyAddress}</strong>?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Deleting...
            </>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteModal;
