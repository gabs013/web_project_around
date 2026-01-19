// handleImageClick es una función que se ejecuta al hacer clic en la imagen
export default class Card {
  constructor(name, link, templateSelector, handleImageClick) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
    this._handleImageClick = handleImageClick;
  }

  //Método para obtener y clonar el Template
  _getTemplate() {
    const galleryTemplate = document
      .querySelector(this._templateSelector)
      .content.querySelector(".gallery__photo")
      .cloneNode(true);

    return galleryTemplate;
  }

  _remove() {
    this._element.remove();
  }

  _toggleLike() {
    this._likeButton.classList.toggle("gallery__like-button--active");
  }

  _clickCard() {
    this._handleImageClick(this._link, this._name);
  }

  _setEventListeners() {
    //Botones de like
    this._likeButton.addEventListener("click", () => this._toggleLike());

    //Eliminar carta
    this._trashButton.addEventListener("click", () => {
      this._remove();
    });

    //Hacer grande la imagen
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

    this._imageElement.src = this._link;
    this._imageElement.alt = this._name;
    this._textElement.textContent = this._name;

    this._setEventListeners();

    return this._element;
  }
}
