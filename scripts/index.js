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

const initialCards = [
  {
    name: "Porcupine Mountains",
    link: "https://images.unsplash.com/photo-1601227956428-6536f5e30920?q=80&w=1378&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Cataratas Redrock",
    link: "https://images.unsplash.com/photo-1736633920290-199df87d7836?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Sequoia National Park",
    link: "https://images.unsplash.com/photo-1516213240617-f50eaeda237e?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Monte Rainier",
    link: "https://images.unsplash.com/photo-1726601806471-e5c02426657e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Gran Fuente Prismática",
    link: "https://images.unsplash.com/photo-1612390388573-45904a65dd0f?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },

  {
    name: "Valle de Yosemite",
    link: "https://images.unsplash.com/photo-1488441770602-aed21fc49bd5?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

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
