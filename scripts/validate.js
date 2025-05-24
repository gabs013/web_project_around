const showInputError = (formElement, inputElement, errorMessage) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add("popup__input_type_error");
  errorElement.textContent = errorMessage;
  errorElement.classList.add("popup__input-error_active");
};

const hideInputError = (formElement, inputElement) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove("popup__input_type_error");
  errorElement.classList.remove("popup__input-error_active");
  errorElement.textContent = "";
};

const checkInputValidity = (formElement, inputElement) => {
  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, inputElement.validationMessage);
  } else {
    hideInputError(formElement, inputElement);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonElements) => {
  const invalid = hasInvalidInput(inputList);
  buttonElements.forEach((buttonElement) => {
    if (invalid) {
      buttonElement.classList.add("button_inactive");
      buttonElement.disabled = true;
    } else {
      buttonElement.classList.remove("button_inactive");
      buttonElement.disabled = false;
    }
  });
};

const setEventListeners = (formElement) => {
  /*Me quedé en esta línea de código. Se supone está bien hecha.*/
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  const submitButtons = Array.from(
    formElement.querySelectorAll(".popup__submit")
  );
  /*Prueba: Validar estado inicial del botón.*/
  toggleButtonState(inputList, submitButtons);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", function () {
      checkInputValidity(formElement, inputElement);
      toggleButtonState(inputList, submitButtons);
    });
  });
};

const enableValidation = () => {
  const formList = Array.from(document.querySelectorAll(".form"));
  formList.forEach((formElement) => {
    formElement.addEventListener("submit", function (evt) {
      evt.preventDefault();
    });

    setEventListeners(formElement);
  });
};

enableValidation();
