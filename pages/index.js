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

// NUEVO: Elementos para el avatar
const avatarEditButton = document.querySelector(".header__image-container");
const formEditAvatar = document.querySelector("#form-edit-avatar");

// Variable global para guardar el ID del usuario
let userId;

// Instancia de UserInfo (ACTUALIZADA con avatarSelector)
const userInfo = new UserInfo({
  userNameSelector: ".header__name",
  userDescriptionSelector: ".header__description",
  userAvatarSelector: ".header__image", // NUEVO
});

// Instancia de PopupWithImage
const imagePopup = new PopupWithImage(".popup-image");

// Función para crear tarjetas
function createCard(cardData) {
  const cardId = cardData._id;

  console.log("ID DE TARJETA DESDE EL SERVIDOR:", cardId);

  if (!cardId) {
    console.error("❌ ERROR: la tarjeta no tiene _id", cardData);
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
    //cardData.owner?._id,
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

    // Guardar el ID del usuario (IMPORTANTE)
    userId = userData._id;
    console.log("🆔 MI USER ID:", userId);

    // 2. Verificar cada tarjeta que viene del servidor
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

    // 3. Renderizar las tarjetas
    gallerySection.setItems(cardsData);
    gallerySection.renderItems();
  })
  .catch((err) => {
    console.error(`❌ ERROR al cargar los datos iniciales: ${err}`);
  });
// ==================== FIN DE CARGA DE DATOS ====================

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

// NUEVO: Instancia del popup para editar avatar
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
        // Actualizar solo el avatar en la página
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
editAvatarFormPopup.setEventListeners(); // NUEVO
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

// NUEVO: Event Listener para abrir popup de avatar
avatarEditButton.addEventListener("click", () => {
  editAvatarFormPopup.open();
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

// NUEVO: Validación para formulario de editar avatar
const formAvatarValidator = new FormValidator(validationConfig, formEditAvatar);
formAvatarValidator.enableValidation();

// Conecta los validadores con los popups
editProfileFormPopup.setFormValidator(formEditValidator);
createCardFormPopup.setFormValidator(formCreateValidator);
editAvatarFormPopup.setFormValidator(formAvatarValidator); // NUEVO

/*import Section from "../components/Section.js";
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

// Variable global para guardar el ID del usuario
let userId;

// Instancia de UserInfo
const userInfo = new UserInfo({
  userNameSelector: ".header__name",
  userDescriptionSelector: ".header__description",
});

// Instancia de PopupWithImage
const imagePopup = new PopupWithImage(".popup-image");

// Función para crear tarjetas
function createCard(cardData) {
  const cardId = cardData._id;

  console.log("ID DE TARJETA DESDE EL SERVIDOR:", cardId);

  if (!cardId) {
    console.error("❌ ERROR: la tarjeta no tiene _id", cardData);
    return;
  }

  // ✅ CAMBIO IMPORTANTE: El servidor usa isLiked, no likes array
  // Si isLiked es true, significa que el usuario actual ya dio like
  // Pero como no tenemos array de likes, usamos un array vacío
  // y determinamos isLiked desde cardData.isLiked

  const card = new Card(
    cardData.name,
    cardData.link,
    "#gallery-template",
    (url, caption) => {
      imagePopup.open(url, caption);
    },
    cardId,
    userId,
    cardData.owner?._id,
    [], // ← Array VACÍO porque el servidor no devuelve likes array
    api,
    (cardId, cardElement) => {
      deleteConfirmPopup.open(cardId, cardElement);
    },
    // ✅ NUEVO: pasar isLiked directamente
    cardData.isLiked || false, // Valor por defecto false si no existe
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

// ==================== CARGAR DATOS INICIALES DEL SERVIDOR ====================
Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cardsData]) => {
    console.log("👤 DATOS DEL USUARIO:", userData);

    // 1. Rellenar el perfil del usuario
    userInfo.setUserInfo({
      name: userData.name,
      description: userData.about,
    });

    // Actualizar avatar
    const profileAvatar = document.querySelector(".header__image");
    if (profileAvatar) {
      profileAvatar.src = userData.avatar;
    }

    // Guardar el ID del usuario (IMPORTANTE)
    userId = userData._id;
    console.log("🆔 MI USER ID:", userId);

    // 2. Verificar cada tarjeta que viene del servidor
    console.log("📦 TOTAL TARJETAS RECIBIDAS:", cardsData.length);

    cardsData.forEach((card, index) => {
      console.log(`\n📊 TARJETA ${index}:`);
      console.log("   ID:", card._id);
      console.log("   NOMBRE:", card.name);
      console.log("   LIKES:", card.likes);
      console.log("   isLiked:", card.isLiked);
      console.log("   OWNER ID:", card.owner);

      // Verificar estructura de likes
      if (card.likes && Array.isArray(card.likes)) {
        console.log("   NÚMERO DE LIKES:", card.likes.length);
        if (card.likes.length > 0) {
          console.log("   PRIMER LIKE:", card.likes[0]);
          console.log("   TIPO DEL PRIMER LIKE:", typeof card.likes[0]);

          // Verificar si el like contiene mi userId
          const userGaveLike = card.likes.some((like) => {
            if (typeof like === "string") {
              return like === userId;
            } else if (like && typeof like === "object") {
              return like._id === userId;
            }
            return false;
          });
          console.log("   ¿YO DI LIKE?:", userGaveLike);
        }
      }
    });

    console.log("\n✅ DATOS LISTOS - Renderizando tarjetas...");

    // 3. Renderizar las tarjetas
    gallerySection.setItems(cardsData);
    gallerySection.renderItems();
  })
  .catch((err) => {
    console.error(`❌ ERROR al cargar los datos iniciales: ${err}`);
  });
// ==================== FIN DE CARGA DE DATOS ====================

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
  const currentUserInfo = userInfo.getUserInfo();
  const form = document.querySelector("#form-edit-profile");
  form.querySelector("#inputName").value = currentUserInfo.name;
  form.querySelector("#inputDescription").value = currentUserInfo.description;

  formEditValidator.resetValidation();
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
createCardFormPopup.setFormValidator(formCreateValidator);*/
