import Card from "./Card.js";
import FormValidator from "./FormValidator.js";
import {
  initialCards,
  handleOpenPopup,
  closePopup,
  handleCloseClick,
  openImagePopup,
  handleChangeInformation,
} from "./utils.js";
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

initialCards.forEach((item) => {
  const cardElement = createGallery(item.name, item.link);
  galleryCardsContainer.querySelector(".gallery__photos").append(cardElement);
});

popupImageCloseButtons.forEach((button) => {
  button.addEventListener("click", function () {
    popupImage.classList.remove("popup_opened");
  });
});

function createGallery(name, link) {
  const card = new Card(name, link, "#gallery-template", openImagePopup);

  return card.generateCard();
}

editButton.addEventListener("click", () =>
  handleOpenPopup(
    profileName,
    profileDescription,
    inputName,
    inputDescription,
    popupEditProfile
  )
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
    () => closePopup(popupEditProfile)
  )
);

galleryAddButton.forEach((button) => {
  button.addEventListener("click", () =>
    popupCreateCards.classList.toggle("popup_opened")
  );
});

formCreateCard.addEventListener("submit", function (evt) {
  evt.preventDefault();
  const newCard = createGallery(inputCardTitle.value, inputCardImage.value);
  galleryCardsContainer.querySelector(".gallery__photos").prepend(newCard);
  formCreateCard.reset();
  closePopup();
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
  formProfileInformation
);
formEditValidator.enableValidation();

const formCreateValidator = new FormValidator(validationConfig, formCreateCard);
formCreateValidator.enableValidation();

/*Código para las superposiciones*/
popupSuperpositions.forEach(function (superposition) {
  superposition.addEventListener("click", function (event) {
    if (event.target === superposition) {
      superposition.classList.remove("popup_opened");
    }
  });
});

/*Código para cerrar con Escape*/

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const popup = document.querySelector(".popup_opened");
    popup.classList.remove("popup_opened");
  }
});
