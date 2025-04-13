let profileName = document.querySelector(".header__name");
let profileDescription = document.querySelector(".header__description");
let editButton = document.querySelector(".header__edit-button");
let popup = document.querySelector(".popup");
let popupCloseButton = document.querySelector(".popup__close-icon");
let inputName = document.querySelector("#inputName");
let inputDescription = document.querySelector("#inputDescription");
let formProfileInformation = document.querySelector(".form");

function handleOpenPopup() {
  popup.classList.add("popup_opened");
}

function closePopup() {
  popup.classList.remove("popup_opened");
}

function handleChangeInformation(evt) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closePopup();
}

editButton.addEventListener("click", handleOpenPopup);
formProfileInformation.addEventListener("submit", handleChangeInformation);
popupCloseButton.addEventListener("click", function () {
  closePopup();
});
