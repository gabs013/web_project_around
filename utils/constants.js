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

//Función para abrir los popups de edición con los datos precargados
function handleOpenPopup(
  profileName,
  profileDescription,
  inputName,
  inputDescription,
  popupElement
) {
  inputName.value = profileName.textContent;
  inputDescription.value = profileDescription.textContent;
  popupElement.classList.add("popup_opened");
}

//Función para cerrar todos los popups
function closePopup(...popups) {
  popups.forEach((popup) => popup.classList.remove("popup_opened"));
}

//Controlador para el click en cerrar el popup
function handleCloseClick(closeFunction) {
  closeFunction();
}

//Función para abrir el popup de imagen
function openImagePopup(imageUrl, captionText, popupElement) {
  const popupImageElement = popupElement.querySelector(".popup__image");
  const popupCaptionElement = popupElement.querySelector(
    ".popup__image-caption"
  );

  popupImageElement.src = imageUrl;
  popupImageElement.alt = captionText;
  popupCaptionElement.textContent = captionText;

  popupElement.classList.add("popup_opened");
}

//Función para cambiar la información del perfil
function handleChangeInformation(
  evt,
  profileName,
  profileDescription,
  inputName,
  inputDescription,
  closeFunction
) {
  evt.preventDefault();
  profileName.textContent = inputName.value;
  profileDescription.textContent = inputDescription.value;
  closeFunction();
}

export {
  initialCards,
  handleOpenPopup,
  closePopup,
  handleCloseClick,
  openImagePopup,
  handleChangeInformation,
};
