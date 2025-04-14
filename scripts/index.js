const profileName = document.querySelector(".header__name");
const profileDescription = document.querySelector(".header__description");
const editButton = document.querySelector(".header__edit-button");
const popup = document.querySelector(".popup");
const popupCloseButtons = document.querySelectorAll(".popup__close-icon");
const inputName = document.querySelector("#inputName");
const inputDescription = document.querySelector("#inputDescription");
const formProfileInformation = document.querySelector(".form");

function handleOpenPopup() {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
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

function handleCloseClick() {
  closePopup();
}

popupCloseButtons.forEach(function (button) {
  button.addEventListener("click", handleCloseClick);
});
