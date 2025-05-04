const profileName = document.querySelector(".header__name");
const profileDescription = document.querySelector(".header__description");
const editButton = document.querySelector(".header__edit-button");
const popupEditProfile = document.querySelector("#popup-edit-profile");
const popupEditProfileCloseButtons =
  document.querySelectorAll(".popup__close-icon");
const inputName = document.querySelector("#inputName");
const inputDescription = document.querySelector("#inputDescription");
const formProfileInformation = document.querySelector("#form-edit-profile");
/*Nuevo código*/
const galleryTemplate = document.querySelector("#gallery-template");
const galleryCardsContainer = document.querySelector(".gallery");
const popupCreateCards = document.querySelector("#popup-create-cards");
const galleryAddButton = document.querySelectorAll(".header__create-button");
const inputCardTitle = document.querySelector("#input-card-title");
const inputCardImage = document.querySelector("#input-card-image");
const formCreateCard = document.querySelector("#form-create-card");

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

function handleChangeInformation(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closePopup();
}

/*Nuevas funciones*/
function createGallery(name, link) {
  const galleryCard = galleryTemplate
    .cloneNode(true)
    .content.querySelector(".gallery__photo");

  const galleryImage = galleryCard.querySelector(".gallery__about-places");
  const galleryText = galleryCard.querySelector(".gallery__name-place");

  galleryImage.src = link;
  galleryText.textContent = name;
  galleryCardsContainer.prepend(galleryCard);

  return galleryCard;
}

createGallery();

/*código del sprint 7 */
editButton.addEventListener("click", handleOpenPopup);
formProfileInformation.addEventListener("submit", handleChangeInformation);

/*Aquí estaba la función handle popup*/

popupEditProfileCloseButtons.forEach(function (button) {
  button.addEventListener("click", handleCloseClick);
});
/*Final del código sprint 7 */

/*Nuevo código*/
galleryAddButton.forEach((button) => {
  button.addEventListener("click", function () {
    popupCreateCards.classList.toggle("popup_opened");
  });
});

/*Va primero*/
formCreateCard.addEventListener("submit", function (evt) {
  evt.preventDefault();
  createGallery(inputCardTitle.value, inputCardImage.value);
  formCreateCard.reset();
  closePopup();
});
