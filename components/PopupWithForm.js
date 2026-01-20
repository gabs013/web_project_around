import Popup from "./Popup.js";

export default class PopupWithForm extends Popup {
  constructor(popupSelector, handleFormSubmit) {
    super(popupSelector);
    this._handleFormSubmit = handleFormSubmit;
    this._form = this._popup.querySelector("form");
    this._inputList = this._form.querySelectorAll(".popup__input");
    this._submitButton = this._form.querySelector(".popup__submit");
  }

  _getInputValues() {
    const inputValues = {};
    this._inputList.forEach((input) => {
      inputValues[input.name] = input.value;
    });
    return inputValues;
  }

  setEventListeners() {
    super.setEventListeners();

    this._form.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this._handleFormSubmit(this._getInputValues());
      this.close();
    });
  }

  // **MÉTODO MEJORADO: También llama al reset de validación**
  close() {
    super.close();
    this._form.reset();
  }

  // **NUEVO MÉTODO: Para pasar el validador desde index.js**
  setFormValidator(validator) {
    this._formValidator = validator;
  }

  // **MÉTODO MEJORADO: Sobrescribe el open() para resetear validación si existe**
  open() {
    super.open();
    if (this._formValidator) {
      this._formValidator.resetValidation();
    }
  }
}
