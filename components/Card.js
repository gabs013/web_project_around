export default class Card {
  constructor(
    name,
    link,
    templateSelector,
    handleImageClick,
    cardId,
    userId,
    ownerId,
    likes = [], // El servidor no usa esto
    api,
    handleDeleteClick,
    isLikedFromServer = false, // ✅ NUEVO PARÁMETRO
  ) {
    console.log("🔍 CONSTRUCTOR Card - cardId recibido:", cardId);
    console.log("🔍 CONSTRUCTOR Card - isLikedFromServer:", isLikedFromServer);

    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
    this._cardId = cardId;
    this._userId = userId;
    this._ownerId = ownerId;
    this._likes = []; // ← Array vacío porque el servidor no lo usa
    this._api = api;
    this._handleDeleteClick = handleDeleteClick;

    // ✅ CLAVE: Usar isLikedFromServer directamente
    this._isLiked = Boolean(isLikedFromServer);

    console.log("🔍 Card - isLiked inicial:", this._isLiked);
  }

  // ✅ ELIMINA el método _checkIfLiked (ya no lo necesitamos)
  // Porque el servidor nos dice directamente isLiked

  // Verificar si el usuario actual dio like
  /*_checkIfLiked() {
    return this._likes.some((like) => {
      if (typeof like === "string") {
        return like === this._userId;
      }
      return like._id === this._userId;
    });
  }*/
  //Antigui código del de arriba

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
    console.log("🔄 TOGGLE LIKE - Estado actual isLiked:", this._isLiked);
    console.log("🔄 TOGGLE LIKE - cardId a enviar:", this._cardId);

    // Validación del ID
    if (!this._cardId || this._cardId.length < 10) {
      console.error("❌ ERROR: cardId inválido:", this._cardId);
      return;
    }

    // Guardar estado anterior
    const wasLiked = this._isLiked;

    // Cambiar visualmente inmediatamente (mejor UX)
    this._likeButton.classList.toggle("gallery__like-button--active");
    this._isLiked = !wasLiked;

    // Actualizar contador visualmente
    const currentLikeCount = this._likes.length;
    const newLikeCount = wasLiked
      ? Math.max(0, currentLikeCount - 1)
      : currentLikeCount + 1;
    this._updateLikeCount(newLikeCount);

    // Determinar qué acción tomar
    const apiCall = wasLiked
      ? this._api.removeLike(this._cardId)
      : this._api.addLike(this._cardId);

    apiCall
      .then((updatedCard) => {
        console.log("✅ Respuesta del servidor:", updatedCard);

        // ✅ CLAVE: El servidor devuelve isLiked, no likes
        if (typeof updatedCard.isLiked === "boolean") {
          this._isLiked = updatedCard.isLiked;
          console.log("📊 isLiked actualizado desde servidor:", this._isLiked);
        }

        // También podría devolver likes count
        if (updatedCard.likes !== undefined) {
          this._likes = Array.isArray(updatedCard.likes)
            ? updatedCard.likes
            : [];
        }

        // Sincronizar el botón con el estado REAL del servidor
        if (this._isLiked) {
          this._likeButton.classList.add("gallery__like-button--active");
        } else {
          this._likeButton.classList.remove("gallery__like-button--active");
        }

        // Actualizar contador (si el servidor devolvió datos)
        if (updatedCard.likes && Array.isArray(updatedCard.likes)) {
          this._updateLikeCount(updatedCard.likes.length);
        } else {
          // Si no, mantener nuestro cálculo estimado
          this._updateLikeCount(newLikeCount);
        }
      })
      .catch((error) => {
        console.error("❌ Error en la petición de like:", error);

        // Revertir cambios visuales si falla
        this._isLiked = wasLiked;
        this._likeButton.classList.toggle("gallery__like-button--active");
        this._updateLikeCount(currentLikeCount);
      });
  }
  /*_toggleLike() {
    if (this._isLiked) {
      this._api.removeLike(this._cardId).then((updatedCard) => {
        this._likes = updatedCard.likes; // 🔴 CLAVE
        this._isLiked = false;
        this._likeButton.classList.remove("gallery__like-button--active");
        this._updateLikeCount(this._likes.length);
      });
    } else {
      this._api.addLike(this._cardId).then((updatedCard) => {
        this._likes = updatedCard.likes || []; // ← ESTA ES LA LÍNEA CLAVE
        this._isLiked = true;
        this._likeButton.classList.add("gallery__like-button--active");
        this._updateLikeCount(this._likes.length);
      });
    }
  }*/
  /*_toggleLike() {
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
  }*/

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

    // Crear elemento para contador de likes
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

    // ✅ NO llamar a _checkIfLiked() - usar el valor que ya tenemos
    // this._isLiked ya fue establecido en el constructor con isLikedFromServer

    // Establecer estado inicial del like
    if (this._isLiked) {
      this._likeButton.classList.add("gallery__like-button--active");
      this._updateLikeCount(1); // Si isLiked es true, al menos hay 1 like (el tuyo)
    } else {
      this._likeButton.classList.remove("gallery__like-button--active");
      this._updateLikeCount(0);
    }

    this._setEventListeners();

    return this._element;
  }
}
