const ModalBig = (props) => {
  return (
    <div className="bi-c-modal">
      <div className="bi-c-modal__bigContent">
        <div className="modal-body bi-u-spacer-mb-bigger">
          <h3 className="bi-u-text-headS">
            {props.title}
          </h3>
          <div>
            {props.body}
          </div>
        </div>
        <div className="modal-footer">
          {props.buttons}
        </div>
      </div>
      <div className="bi-c-modal-background"></div>
    </div>  
  );
}

export default ModalBig;