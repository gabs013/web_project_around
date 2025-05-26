const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  configForm
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(configForm.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(configForm.errorClass);
};

const hideInputError = (formElement, inputElement, configForm) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(configForm.inputErrorClass);
  errorElement.classList.remove(configForm.errorClass);
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement, configForm) => {
  if (!inputElement.validity.valid) {
    showInputError(
      formElement,
      inputElement,
      inputElement.validationMessage,
      configForm
    );
  } else {
    hideInputError(formElement, inputElement, configForm);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElements, configForm) => {
  const invalid = hasInvalidInput(inputList);
  buttonElements.forEach((buttonElement) => {
    if (invalid) {
      buttonElement.classList.add(configForm.inactiveButtonClass);
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove(configForm.inactiveButtonClass);
      buttonElement.disabled = false;
    }
  });
};

const setEventListeners = (formElement, configForm) => {
  /*Me quedé en esta línea de código. Se supone está bien hecha.*/
  const inputList = Array.from(
    formElement.querySelectorAll(configForm.inputSelector)
  );
  const submitButtons = Array.from(
    formElement.querySelectorAll(configForm.submitButtonSelector)
  );
  /*Prueba: Validar estado inicial del botón.*/
  toggleButtonState(inputList, submitButtons, configForm);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement, configForm);
      toggleButtonState(inputList, submitButtons, configForm);
    });
  });
};

const enableValidation = (configForm) => {
  const formList = Array.from(
    document.querySelectorAll(configForm.formSelector)
  );
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement, configForm);
  });
};

const configForm = {
  formSelector: ".form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__submit",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

enableValidation(configForm);
