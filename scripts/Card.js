/*Corrección de la clase Card*/
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
    /*Botones de like*/
    this._likeButton.addEventListener("click", () => this._toggleLike());

    /*Eliminar carta*/
    this._trashButton.addEventListener("click", () => {
      this._remove();
    });

    /*Hacer grande la imagen*/
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
//const cardImage = this._galleryCard.querySelector(".gallery__about-places");
//const cardLike = this._galleryCard.querySelector(".gallery__like");
//const cardTrash = this._galleryCard.querySelector(".gallery__trash");

//cardImage.addEventListener("click", () => {
//this.clickCard();
//});

//cardLike.addEventListener("click", () => {
//this.toggleLike();
//});

//cardTrash.addEventListener("click", () => {
//this.remove();
//});

/*Carta del profesor Christian

export default class Card {
  constructor(name, link, templateSelector) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
  }

  //Método para obtener y clonar el Template
  _getTemplate() {
    const galleryTemplate = document.querySelector(this._templateSelector);
    this._galleryCard = galleryTemplate
      .cloneNode(true)
      .content.querySelector(".gallery__photo");

    const galleryImage = this._galleryCard.querySelector(
      ".gallery__about-places"
    );
    const galleryText = this._galleryCard.querySelector(".gallery__name-place");

    galleryImage.src = this._link;
    galleryText.textContent = this._name;
    galleryCardsContainer.prepend(galleryCard);
  }

  remove() {}

  toggleLike() {}

  clickCard() {}

  _setEventListener() {
    const cardImage = this._galleryCard.querySelector(".gallery__about-places");
    const cardLike = this._galleryCard.querySelector(".gallery__like");
    const cardTrash = this._galleryCard.querySelector(".gallery__trash");

    cardImage.addEventListener("click", () => {
      this.clickCard();
    });

    cardLike.addEventListener("click", () => {
      this.toggleLike();
    });

    cardTrash.addEventListener("click", () => {
      this.remove();
    });
  }
}*/
