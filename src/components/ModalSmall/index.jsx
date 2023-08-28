const ModalSmall = (props) => {
  return (
    <div className="bi-c-modal">
      <div className="bi-c-modal__smallContent">
        <div className="modal-body bi-u-spacer-mb-bigger">
          <h3 className="bi-u-text-headS">
            {props.message}
          </h3>
        </div>
        <div className="modal-footer">
          {props.buttons}
        </div>
      </div>
      <div className="bi-c-modal-background"></div>
    </div>  
  );
}

export default ModalSmall;