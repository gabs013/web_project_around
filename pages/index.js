import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
/*import Api from "../components/Api.js";*/
import { api } from "../components/Api.js";
/*import { initialCards } from "../utils/constants.js";*/

// Elementos del DOM
const editButton = document.querySelector(".header__edit-button");
const formProfileInformation = document.querySelector("#form-edit-profile");
const galleryAddButton = document.querySelectorAll(".header__create-button");
const formCreateCard = document.querySelector("#form-create-card");

// Variable global para guardar el ID del usuario
//Para cargar datos del servidor
let userId;

// Instancia de UserInfo
const userInfo = new UserInfo({
  userNameSelector: ".header__name",
  userDescriptionSelector: ".header__description",
});

// Instancia de PopupWithImage
const imagePopup = new PopupWithImage(".popup-image");

// Función para crear tarjetas (MODIFICADA para usar datos del servidor y popup de confirmación)
function createCard(cardData) {
  const card = new Card(
    cardData.name,
    cardData.link,
    "#gallery-template",
    (url, caption) => {
      imagePopup.open(url, caption);
    },
    cardData._id, // Pasar el ID de la tarjeta
    userId, // Pasar el ID del usuario
    /*cardData.owner._id, // Pasar el ID del dueño*/
    cardData.owner._id || cardData.owner,
    cardData.likes || [], // Pasar los likes
    api, // Pasar la instancia de API
    // NUEVO: callback para eliminar (abre popup de confirmación)
    (cardId, cardElement) => {
      deleteConfirmPopup.open(cardId, cardElement);
    },
  );
  return card.generateCard();
}

// Instancia de Section para renderizar tarjetas
const gallerySection = new Section(
  {
    items: [],
    renderer: (item) => {
      const cardElement = createCard(item);
      gallerySection.addItem(cardElement);
    },
  },
  ".gallery__photos",
);

// CARGAR DATOS INICIALES DEL SERVIDOR
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cardsData]) => {
    // 1. Rellenar el perfil del usuario
    userInfo.setUserInfo({
      name: userData.name,
      description: userData.about,
    });

    // Actualizar avatar si tienes un elemento para ello
    const profileAvatar = document.querySelector(".header__image");
    if (profileAvatar) {
      profileAvatar.src = userData.avatar;
    }

    // Guardar el ID del usuario (IMPORTANTE)
    userId = userData._id;

    // 2. Renderizar las tarjetas desde el servidor
    gallerySection.setItems(cardsData);
    gallerySection.renderItems();
  })
  .catch((err) => {
    console.error(`Error al cargar los datos iniciales: ${err}`);
  });

// Instancia del popup para editar perfil (MODIFICADA con "Guardando...")
const editProfileFormPopup = new PopupWithForm(
  "#popup-edit-profile",
  (inputValues) => {
    const submitButton = formProfileInformation.querySelector(".popup__submit");
    const originalText = submitButton.textContent;

    // Cambiar texto a "Guardando..."
    submitButton.textContent = "Guardando...";

    api
      .editUserInfo({
        name: inputValues.name,
        about: inputValues.about,
      })
      .then((userData) => {
        // Actualizar información del usuario
        userInfo.setUserInfo({
          name: userData.name,
          description: userData.about,
        });
        editProfileFormPopup.close();
      })
      .catch((err) => console.error(`Error al editar perfil: ${err}`))
      .finally(() => {
        // Restaurar texto original
        submitButton.textContent = originalText;
      });
  },
);

// Instancia del popup para crear nuevas tarjetas (MODIFICADA con "Guardando...")
const createCardFormPopup = new PopupWithForm(
  "#popup-create-cards",
  (inputValues) => {
    const submitButton = formCreateCard.querySelector(".popup__submit");
    const originalText = submitButton.textContent;

    // Cambiar texto a "Guardando..."
    submitButton.textContent = "Guardando...";

    api
      .addNewCard({
        name: inputValues.title,
        link: inputValues.link,
      })
      .then((newCard) => {
        // Crear y añadir la nueva tarjeta
        const cardElement = createCard(newCard);
        gallerySection.addItemAtBeginning(cardElement);
        createCardFormPopup.close();
      })
      .catch((err) => console.error(`Error al crear tarjeta: ${err}`))
      .finally(() => {
        // Restaurar texto original
        submitButton.textContent = originalText;
      });
  },
);

// Instancia del popup de confirmación para eliminar tarjetas
const deleteConfirmPopup = new PopupWithConfirmation(
  "#popup-confirm-delete",
  (cardId, cardElement) => {
    // Esto se ejecuta cuando el usuario hace clic en "Sí"
    api
      .deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        deleteConfirmPopup.close();
      })
      .catch((err) => console.error(`Error al eliminar tarjeta: ${err}`));
  },
);

// Configurar botón "No" para cerrar el popup de confirmación
const cancelButton = document.querySelector(
  "#popup-confirm-delete .popup__cancel",
);
if (cancelButton) {
  cancelButton.addEventListener("click", () => {
    deleteConfirmPopup.close();
  });
}

// Activar los event listeners de todos los popups
imagePopup.setEventListeners();
editProfileFormPopup.setEventListeners();
createCardFormPopup.setEventListeners();
deleteConfirmPopup.setEventListeners();

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
