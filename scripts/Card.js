/*Carta del profesor Sebastián*/
const galleryTemplate = document.querySelector("#gallery-template");
export default class Card {
  constructor(name, link, templateSelector) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
  }

  cloneTemplate() {
    return galleryTemplate
      .cloneNode(true)
      .content.querySelector(".gallery__photo");
  }

  generateCard() {
    this.card = this.cloneTemplate();
    this.cardImage = this.card.querySelector(".gallery__about-places");
    this.cardText = this.card.querySelector(".gallery__name-place");

    this.cardImage.src = this._link;
    this.cardText.textContent = this._name;

    return this.card();
  }

  getHtmlCard() {
    return this.generateCard();
  }
}

/*Carta del profesor Christian

  export default class Card {
  constructor(name, link, templateSelector) {
    this._name = name;
    this._link = link;
    this._templateSelector = templateSelector;
  }

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
