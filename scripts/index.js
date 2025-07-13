import Card from "./Card.js";
import { initialCards } from "./utils.js";
const profileName = document.querySelector(".header__name");
const profileDescription = document.querySelector(".header__description");
const editButton = document.querySelector(".header__edit-button");
const popupEditProfile = document.querySelector("#popup-edit-profile");
const popupEditProfileCloseButtons =
  document.querySelectorAll(".popup__close-icon");
const inputName = document.querySelector("#inputName");
const inputDescription = document.querySelector("#inputDescription");
const formProfileInformation = document.querySelector("#form-edit-profile");
const galleryTemplate = document.querySelector("#gallery-template");
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

function handleOpenPopup() {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  popupEditProfile.classList.add("popup_opened");
}

function handleCloseClick() {
  closePopup();
}

function closePopup() {
  popupEditProfile.classList.remove("popup_opened");
  popupCreateCards.classList.remove("popup_opened");
}

/*Código popup para agrandar imagen*/
function openImagePopup(imageUrl, captionText) {
  const popupImageElement = popupImage.querySelector(".popup__image");
  const popupCaptionElement = popupImage.querySelector(".popup__image-caption");

  popupImageElement.src = imageUrl;
  popupImageElement.alt = captionText;
  popupCaptionElement.textContent = captionText;

  popupImage.classList.add("popup_opened");
}

function handleChangeInformation(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closePopup();
}

initialCards.forEach((item) => {
  const card = createGallery(item.name, item.link);
  galleryCardsContainer.append(card);
});

popupImageCloseButtons.forEach((button) => {
  button.addEventListener("click", function () {
    popupImage.classList.remove("popup_opened");
  });
});

function createGallery(name, link) {
  const galleryCard = galleryTemplate
    .cloneNode(true)
    .content.querySelector(".gallery__photo");

  const galleryImage = galleryCard.querySelector(".gallery__about-places");
  const galleryText = galleryCard.querySelector(".gallery__name-place");

  const likeOff = galleryCard.querySelector(".gallery__like-button-off");
  const likeOn = galleryCard.querySelector(".gallery__like-button-on");

  galleryImage.src = link;
  galleryText.textContent = name;
  galleryCardsContainer.prepend(galleryCard);

  galleryImage.addEventListener("click", () => {
    openImagePopup(link, name);
  });

  // Evento de click para alternar el botón de like
  likeOff.addEventListener("click", () => {
    likeOff.style.display = "none";
    likeOn.style.display = "inline";
  });

  likeOn.addEventListener("click", () => {
    likeOn.style.display = "none";
    likeOff.style.display = "inline";
  });

  const trashButton = galleryCard.querySelectorAll(".gallery__trash-button");
  trashButton.forEach((btn) => {
    btn.addEventListener("click", () => {
      galleryCard.remove();
    });
  });

  return galleryCard;
}

editButton.addEventListener("click", handleOpenPopup);
formProfileInformation.addEventListener("submit", handleChangeInformation);

popupEditProfileCloseButtons.forEach(function (button) {
  button.addEventListener("click", handleCloseClick);
});

galleryAddButton.forEach((button) => {
  button.addEventListener("click", function () {
    popupCreateCards.classList.toggle("popup_opened");
  });
});

formCreateCard.addEventListener("submit", function (evt) {
  evt.preventDefault();
  createGallery(inputCardTitle.value, inputCardImage.value);
  formCreateCard.reset();
  closePopup();
});

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
