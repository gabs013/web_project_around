export default class Popup {
  constructor(popupSelector) {
    this._popup = document.querySelector(popupSelector);

    //Bind se usa para que "this" no se pierda cuando se use como callback
    this._handleEscClose = this._handleEscClose.bind(this);
  }

  //Abrir popup
  open() {
    this._popup.classList.add("popup_opened");
    document.addEventListener("keydown", this._handleEscClose);
  }

  //Cerrar popup
  close() {
    this._popup.classList.remove("popup_opened");
    document.removeEventListener("keydown", this._handleEscClose);
  }

  //Cerrar con Escape
  _handleEscClose(event) {
    if (event.key === "Escape") {
      this.close();
    }
  }

  //Listeners comunes a todos los popups
  setEventListeners() {
    //Cerrar al hacer click en el overlay
    this._popup.addEventListener("mousedown", (event) => {
      if (
        event.target.classList.contains("popup") ||
        event.target.classList.contains("popup__close-icon")
      ) {
        this.close();
      }
    });
  }
}
