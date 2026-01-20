import Section from "../components/Section.js";
import Popup from "../components/Popup.js";
import PopupWithImage from "../components/PopupWithImage.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import {
  initialCards,
  handleOpenPopup,
  closePopup,
  handleCloseClick,
  openImagePopup,
  handleChangeInformation,
} from "../utils/constants.js";
const profileName = document.querySelector(".header__name");
const profileDescription = document.querySelector(".header__description");
const editButton = document.querySelector(".header__edit-button");
const popupEditProfile = document.querySelector("#popup-edit-profile");
const popupCloseButtons = document.querySelectorAll(".popup__close-icon");
const inputName = document.querySelector("#inputName");
const inputDescription = document.querySelector("#inputDescription");
const formProfileInformation = document.querySelector("#form-edit-profile");
const galleryCardsContainer = document.querySelector(".gallery");
const popupCreateCards = document.querySelector("#popup-create-cards");
const galleryAddButton = document.querySelectorAll(".header__create-button");
const inputCardTitle = document.querySelector("#input-card-title");
const inputCardImage = document.querySelector("#input-card-image");
const formCreateCard = document.querySelector("#form-create-card");
const popupImage = document.querySelector(".popup-image");
const popupImageCloseButtons =
  popupImage.querySelectorAll(".popup__close-icon");
const popupSuperpositions = document.querySelectorAll(".popup");

//Código para renderizar la clase Section
const gallerySection = new Section(
  {
    items: initialCards,
    renderer: (item) => {
      //AQUÍ va mi lógica real de creación de tarjeta
      const cardElement = createGallery(item.name, item.link);

      gallerySection.addItem(cardElement);
    },
  },
  ".gallery__photos",
);

gallerySection.renderItems();

/*initialCards.forEach((item) => {
  const cardElement = createGallery(item.name, item.link);
  galleryCardsContainer.querySelector(".gallery__photos").append(cardElement);
});*/

//Instancias de Popup
const editProfilePopup = new Popup("#popup-edit-profile");
const createCardPopup = new Popup("#popup-create-cards");
const imagePopup = new PopupWithImage(".popup-image");

//Activar Listeners
editProfilePopup.setEventListeners();
createCardPopup.setEventListeners();
imagePopup.setEventListeners();

//Código que pertenece a la clase Popup
/*popupImageCloseButtons.forEach((button) => {
  button.addEventListener("click", function () {
    popupImage.classList.remove("popup_opened");
  });
});*/

//Función para abrir y cerrar imágenes.
//La modificaré abajo para usar Esc
/*function createGallery(name, link) {
  //const card = new Card(name, link, "#gallery-template", openImagePopup);
  const card = new Card(name, link, "#gallery-template", (url, caption) =>
    openImagePopup(url, caption, popupImage),
  );

  return card.generateCard();
}*/

//Función que cierra las imágenes y hace que funcione Esc
/*function createGallery(name, link) {
  //const card = new Card(name, link, "#gallery-template", openImagePopup);
  const card = new Card(name, link, "#gallery-template", (url, caption) => {
    const popupImageElement = popupImage.querySelector(".popup__image");
    const popupCaptionElement = popupImage.querySelector(
      ".popup__image-caption",
    );

    popupImageElement.src = url;
    popupImageElement.alt = caption;
    popupCaptionElement.textContent = caption;

    imagePopup.open();
  });

  return card.generateCard();
}*/

function createGallery(name, link) {
  const card = new Card(name, link, "#gallery-template", (url, caption) => {
    imagePopup.open(url, caption);
  });

  return card.generateCard();
}

editButton.addEventListener("click", () =>
  handleOpenPopup(
    profileName,
    profileDescription,
    inputName,
    inputDescription,
    popupEditProfile,
  ),
);

popupCloseButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    handleCloseClick(() => closePopup(popup));
  });
});

formProfileInformation.addEventListener("submit", (evt) =>
  handleChangeInformation(
    evt,
    profileName,
    profileDescription,
    inputName,
    inputDescription,
    () => closePopup(popupEditProfile),
  ),
);

galleryAddButton.forEach((button) => {
  button.addEventListener("click", () =>
    popupCreateCards.classList.toggle("popup_opened"),
  );
});

formCreateCard.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const newCard = createGallery(inputCardTitle.value, inputCardImage.value);
  galleryCardsContainer.querySelector(".gallery__photos").prepend(newCard);
  formCreateCard.reset();
  closePopup(popupCreateCards);
});

/*Validación de formularios*/
const validationConfig = {
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__submit",
  inactiveButtonClass: "popup__button_inactive",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__input-error_active",
};

const formEditValidator = new FormValidator(
  validationConfig,
  formProfileInformation,
);
formEditValidator.enableValidation();

const formCreateValidator = new FormValidator(validationConfig, formCreateCard);
formCreateValidator.enableValidation();

/*Código para las superposiciones*/
//Código que pertenece a la clase Popup
/*popupSuperpositions.forEach(function (superposition) {
  superposition.addEventListener("click", function (event) {
    if (event.target === superposition) {
      superposition.classList.remove("popup_opened");
    }
  });
});*/

/*Código para cerrar con Escape*/
//Código que pertenece a la clase Popup
/*document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const popup = document.querySelector(".popup_opened");
    popup.classList.remove("popup_opened");
  }
});*/
