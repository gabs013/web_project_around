const profileName = document.querySelector(".header__name");
const profileDescription = document.querySelector(".header__description");
const editButton = document.querySelector(".header__edit-button");
const popupEditProfile = document.querySelector("#popup-edit-profile");
const popupEditProfileCloseButtons =
  document.querySelectorAll(".popup__close-icon");
const inputName = document.querySelector("#inputName");
const inputDescription = document.querySelector("#inputDescription");
const formProfileInformation = document.querySelector(".form");
/*Nuevo código*/
const galleryTemplate = document.querySelector("#gallery-template");
const galleryCardsContainer = document.querySelector(".gallery");
const popupCreateCards = document.querySelector("#popup-create-cards");
const galleryAddButton = document.querySelectorAll(".header__create-button");

function handleOpenPopup() {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  popupEditProfile.classList.add("popup_opened");
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
  galleryCardsContainer.append(galleryCard);
}

createGallery();

editButton.addEventListener("click", handleOpenPopup);
formProfileInformation.addEventListener("submit", handleChangeInformation);

function handleCloseClick() {
  closePopup();
}

popupEditProfileCloseButtons.forEach(function (button) {
  button.addEventListener("click", handleCloseClick);
});

/*galleryAddButtons.forEach((button) => {
  button.addEventListener("click", function () {
    popupCreateCards.classList.add("popup_opened");
  }); código de CHAT GPT
});*/

galleryAddButton.addEventListener("click", function () {
  popupCreateCards.classList.add("popup_opened");
});

/*function closePopup() {
  popupCreateCards.classList.remove("popup_opened");
}*/
