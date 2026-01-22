export default class Card {
  constructor(
    name,
    link,
    templateSelector,
    handleImageClick,
    cardId, // ID de la tarjeta
    userId, // ID del usuario actual
    ownerId, // ID del dueño de la tarjeta
    likes = [], // Array de likes
    api, // Instancia de API
    handleDeleteClick, // Callback para eliminar
  ) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
    this._cardId = cardId;
    this._userId = userId;
    this._ownerId = ownerId;
    this._likes = likes;
    this._api = api;
    this._handleDeleteClick = handleDeleteClick; // Guardar callback
    this._isLiked = this._checkIfLiked();
  }

  // Verificar si el usuario actual dio like
  _checkIfLiked() {
    return this._likes.some((like) => like._id === this._userId);
  }

  // Método para obtener y clonar el Template
  _getTemplate() {
    const galleryTemplate = document
      .querySelector(this._templateSelector)
      .content.querySelector(".gallery__photo")
      .cloneNode(true);

    return galleryTemplate;
  }

  // Método para eliminar tarjeta (fallback si no hay callback)
  _remove() {
    this._api
      .deleteCard(this._cardId)
      .then(() => {
        this._element.remove();
      })
      .catch((err) => console.error(`Error al eliminar tarjeta: ${err}`));
  }

  // Alternar like (ahora llama a la API)
  _toggleLike() {
    if (this._isLiked) {
      // Quitar like
      this._api
        .removeLike(this._cardId)
        .then((updatedCard) => {
          this._likeButton.classList.remove("gallery__like-button--active");
          this._isLiked = false;
          this._updateLikeCount(updatedCard.likes.length);
        })
        .catch((err) => console.error(`Error al quitar like: ${err}`));
    } else {
      // Dar like
      this._api
        .addLike(this._cardId)
        .then((updatedCard) => {
          this._likeButton.classList.add("gallery__like-button--active");
          this._isLiked = true;
          this._updateLikeCount(updatedCard.likes.length);
        })
        .catch((err) => console.error(`Error al dar like: ${err}`));
    }
  }

  // Actualizar contador de likes
  _updateLikeCount(count) {
    if (this._likeCountElement) {
      this._likeCountElement.textContent = count;
    }
  }

  _clickCard() {
    this._handleImageClick(this._link, this._name);
  }

  _setEventListeners() {
    // Botones de like
    this._likeButton.addEventListener("click", () => this._toggleLike());

    // Eliminar carta (solo si es del usuario actual) - ¡CORREGIDO!
    if (this._ownerId === this._userId) {
      this._trashButton.addEventListener("click", () => {
        // USAR el callback handleDeleteClick en lugar de _remove()
        if (this._handleDeleteClick) {
          this._handleDeleteClick(this._cardId, this._element);
        } else {
          // Fallback si por alguna razón no hay callback
          this._remove();
        }
      });
    } else {
      // Ocultar botón de basura si no es del usuario
      this._trashButton.style.display = "none";
    }

    // Hacer grande la imagen
    this._imageElement.addEventListener("click", () => {
      this._clickCard();
    });
  }

  generateCard() {
    this._element = this._getTemplate();

    this._imageElement = this._element.querySelector(".gallery__about-places");
    this._textElement = this._element.querySelector(".gallery__name-place");
    this._likeButton = this._element.querySelector(".gallery__like-button");
    this._trashButton = this._element.querySelector(".gallery__trash-button");

    // Crear elemento para contador de likes (si no existe)
    if (!this._element.querySelector(".gallery__like-count")) {
      const likeCount = document.createElement("span");
      likeCount.className = "gallery__like-count";
      this._likeButton.parentNode.insertBefore(
        likeCount,
        this._likeButton.nextSibling,
      );
      this._likeCountElement = likeCount;
    } else {
      this._likeCountElement = this._element.querySelector(
        ".gallery__like-count",
      );
    }

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._textElement.textContent = this._name;

    // Establecer estado inicial del like
    if (this._isLiked) {
      this._likeButton.classList.add("gallery__like-button--active");
    }

    // Mostrar contador de likes
    this._updateLikeCount(this._likes.length);

    this._setEventListeners();

    return this._element;
  }
}
