import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import UserInfo from "../components/UserInfo.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import Api from "../components/Api.js";
import { initialCards } from "../utils/constants.js";

// Elementos del DOM
const editButton = document.querySelector(".header__edit-button");
const formProfileInformation = document.querySelector("#form-edit-profile");
const galleryAddButton = document.querySelectorAll(".header__create-button");
const formCreateCard = document.querySelector("#form-create-card");

// Instancia de UserInfo
const userInfo = new UserInfo({
  userNameSelector: ".header__name",
  userDescriptionSelector: ".header__description",
});

// Instancia de PopupWithImage
const imagePopup = new PopupWithImage(".popup-image");

// Función para crear tarjetas
function createGallery(name, link) {
  const card = new Card(name, link, "#gallery-template", (url, caption) => {
    imagePopup.open(url, caption);
  });
  return card.generateCard();
}

// Instancia de Section para renderizar tarjetas iniciales
const gallerySection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      const cardElement = createGallery(item.name, item.link);
      gallerySection.addItem(cardElement);
    },
  },
  ".gallery__photos",
);

// Renderizar tarjetas iniciales
gallerySection.renderItems();

// Instancia del popup para editar perfil
const editProfileFormPopup = new PopupWithForm(
  "#popup-edit-profile",
  (inputValues) => {
    // Actualizar información del usuario
    userInfo.setUserInfo({
      name: inputValues.name,
      description: inputValues.about, //Coincide con el atributo "name" del input
    });
  },
);

// Instancia del popup para crear nuevas tarjetas
const createCardFormPopup = new PopupWithForm(
  "#popup-create-cards",
  (inputValues) => {
    const newCard = createGallery(inputValues.title, inputValues.link);
    //gallerySection.addItem(newCard);
    gallerySection.addItemAtBeginning(newCard);
  },
);

//Activar los event listeners de todos los popups**
imagePopup.setEventListeners();
editProfileFormPopup.setEventListeners();
createCardFormPopup.setEventListeners();

// Event Listeners para abrir popups
editButton.addEventListener("click", () => {
  // Obtener información actual del usuario
  const currentUserInfo = userInfo.getUserInfo();

  // Llenar el formulario con los datos actuales
  const form = document.querySelector("#form-edit-profile");
  form.querySelector("#inputName").value = currentUserInfo.name;
  form.querySelector("#inputDescription").value = currentUserInfo.description;

  formEditValidator.resetValidation();

  // Abrir popup
  editProfileFormPopup.open();
});

// Event Listeners para botones de agregar tarjeta
galleryAddButton.forEach((button) => {
  button.addEventListener("click", () => {
    createCardFormPopup.open();
  });
});

// Activar validación de formularios
const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__submit",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

// Validación para formulario de editar perfil
const formEditValidator = new FormValidator(
  validationConfig,
  formProfileInformation,
);
formEditValidator.enableValidation();

// Validación para formulario de crear tarjeta
const formCreateValidator = new FormValidator(validationConfig, formCreateCard);
formCreateValidator.enableValidation();

// Conecta los validadores con los popups
editProfileFormPopup.setFormValidator(formEditValidator);
createCardFormPopup.setFormValidator(formCreateValidator);
