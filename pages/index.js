import Section from "../components/Section.js";
import PopupWithImage from "../components/PopupWithImage.js";
import PopupWithForm from "../components/PopupWithForm.js";
import PopupWithConfirmation from "../components/PopupWithConfirmation.js";
import UserInfo from "../components/UserInfo.js";
import Card from "../components/Card.js";
import FormValidator from "../components/FormValidator.js";
import { api } from "../components/Api.js";

// Elementos del DOM
const editButton = document.querySelector(".header__edit-button");
const formProfileInformation = document.querySelector("#form-edit-profile");
const galleryAddButton = document.querySelectorAll(".header__create-button");
const formCreateCard = document.querySelector("#form-create-card");

// Elementos del avatar
const avatarEditButton = document.querySelector(".header__image-container");
const formEditAvatar = document.querySelector("#form-edit-avatar");

// Variable global para guardar el ID del usuario
let userId;

// Instancia de UserInfo (Actualizada con avatarSelector)
const userInfo = new UserInfo({
  userNameSelector: ".header__name",
  userDescriptionSelector: ".header__description",
  userAvatarSelector: ".header__image",
});

// Instancia de PopupWithImage
const imagePopup = new PopupWithImage(".popup-image");

// Función para crear tarjetas
function createCard(cardData) {
  const cardId = cardData._id;

  console.log("ID DE TARJETA DESDE EL SERVIDOR:", cardId);

  if (!cardId) {
    console.error("ERROR: la tarjeta no tiene _id", cardData);
    return;
  }

  const card = new Card(
    cardData.name,
    cardData.link,
    "#gallery-template",
    (url, caption) => {
      imagePopup.open(url, caption);
    },
    cardId,
    userId,
    typeof cardData.owner === "object" ? cardData.owner._id : cardData.owner,
    [],
    api,
    (cardId, cardElement) => {
      deleteConfirmPopup.open(cardId, cardElement);
    },
    cardData.isLiked || false,
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

// Parte donde se cargan los datos iniciales del servidor
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cardsData]) => {
    console.log("👤 DATOS DEL USUARIO:", userData);

    //Rellena el perfil del usuario
    userInfo.setUserInfo({
      name: userData.name,
      description: userData.about,
      avatar: userData.avatar, //Actualizar el avatar desde el servidor
    });

    // Guarda el ID del usuario
    userId = userData._id;
    console.log("🆔 MI USER ID:", userId);

    // 2. Verifica cada tarjeta que viene del servidor
    console.log("📦 TOTAL TARJETAS RECIBIDAS:", cardsData.length);

    cardsData.forEach((card, index) => {
      console.log(`\n📊 TARJETA ${index}:`);
      console.log("   ID:", card._id);
      console.log("   NOMBRE:", card.name);
      console.log("   LIKES:", card.likes);
      console.log("   isLiked:", card.isLiked);
      console.log("   OWNER ID:", card.owner);
    });

    console.log("\n✅ DATOS LISTOS - Renderizando tarjetas...");

    // 3. Renderiza las tarjetas
    gallerySection.setItems(cardsData);
    gallerySection.renderItems();
  })
  .catch((err) => {
    console.error(`❌ ERROR al cargar los datos iniciales: ${err}`);
  });

// Instancia del popup para editar perfil
const editProfileFormPopup = new PopupWithForm(
  "#popup-edit-profile",
  (inputValues) => {
    const submitButton = formProfileInformation.querySelector(".popup__submit");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Guardando...";

    api
      .editUserInfo({
        name: inputValues.name,
        about: inputValues.about,
      })
      .then((userData) => {
        userInfo.setUserInfo({
          name: userData.name,
          description: userData.about,
        });
        editProfileFormPopup.close();
      })
      .catch((err) => console.error(`Error al editar perfil: ${err}`))
      .finally(() => {
        submitButton.textContent = originalText;
      });
  },
);

//Instancia del popup para editar avatar
const editAvatarFormPopup = new PopupWithForm(
  "#popup-edit-avatar",
  (inputValues) => {
    const submitButton = formEditAvatar.querySelector(".popup__submit");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Guardando...";

    api
      .updateUserAvatar({
        avatar: inputValues.avatar,
      })
      .then((userData) => {
        // Actualiza solo el avatar en la página
        userInfo.setUserAvatar(userData.avatar);
        editAvatarFormPopup.close();
      })
      .catch((err) => {
        console.error(`Error al actualizar avatar: ${err}`);
        alert(
          "Error al actualizar el avatar. Verifica que el enlace sea válido.",
        );
      })
      .finally(() => {
        submitButton.textContent = originalText;
      });
  },
);

// Instancia del popup para crear nuevas tarjetas
const createCardFormPopup = new PopupWithForm(
  "#popup-create-cards",
  (inputValues) => {
    const submitButton = formCreateCard.querySelector(".popup__submit");
    const originalText = submitButton.textContent;

    submitButton.textContent = "Guardando...";

    api
      .addNewCard({
        name: inputValues.title,
        link: inputValues.link,
      })
      .then((newCard) => {
        const cardElement = createCard(newCard);
        gallerySection.addItemAtBeginning(cardElement);
        createCardFormPopup.close();
      })
      .catch((err) => console.error(`Error al crear tarjeta: ${err}`))
      .finally(() => {
        submitButton.textContent = originalText;
      });
  },
);

// Instancia del popup de confirmación para eliminar tarjetas
const deleteConfirmPopup = new PopupWithConfirmation(
  "#popup-confirm-delete",
  (cardId, cardElement) => {
    api
      .deleteCard(cardId)
      .then(() => {
        cardElement.remove();
        deleteConfirmPopup.close();
      })
      .catch((err) => console.error(`Error al eliminar tarjeta: ${err}`));
  },
);

// Configura botón "No" para cerrar el popup de confirmación
const cancelButton = document.querySelector(
  "#popup-confirm-delete .popup__cancel",
);
if (cancelButton) {
  cancelButton.addEventListener("click", () => {
    deleteConfirmPopup.close();
  });
}

// Activa los event listeners de todos los popups
imagePopup.setEventListeners();
editProfileFormPopup.setEventListeners();
editAvatarFormPopup.setEventListeners();
createCardFormPopup.setEventListeners();
deleteConfirmPopup.setEventListeners();

// Event Listeners para abrir popups
editButton.addEventListener("click", () => {
  const currentUserInfo = userInfo.getUserInfo();
  const form = document.querySelector("#form-edit-profile");
  form.querySelector("#inputName").value = currentUserInfo.name;
  form.querySelector("#inputDescription").value = currentUserInfo.description;

  formEditValidator.resetValidation();
  editProfileFormPopup.open();
});

//Event Listener para abrir popup de avatar
avatarEditButton.addEventListener("click", () => {
  editAvatarFormPopup.open();
});

// Event Listeners para botones de agregar tarjeta
galleryAddButton.forEach((button) => {
  button.addEventListener("click", () => {
    createCardFormPopup.open();
  });
});

// Activa validación de formularios
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

//Validación para formulario de editar avatar
const formAvatarValidator = new FormValidator(validationConfig, formEditAvatar);
formAvatarValidator.enableValidation();

// Conecta los validadores con los popups
editProfileFormPopup.setFormValidator(formEditValidator);
createCardFormPopup.setFormValidator(formCreateValidator);
editAvatarFormPopup.setFormValidator(formAvatarValidator);
