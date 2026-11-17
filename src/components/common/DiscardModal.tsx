import { Button, Modal } from "react-bootstrap";

interface DiscardModalProps {
  showCancelModal: boolean;
  closeModal: () => void;
  confirmCancel: () => void;
}
const DiscardModal = ({
  showCancelModal,
  closeModal,
  confirmCancel,
}: DiscardModalProps) => {
  return (
    <div>
      {" "}
      <Modal show={showCancelModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Discard Changes?</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to discard all changes?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            No, Keep Editing
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Yes, Discard
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DiscardModal;
