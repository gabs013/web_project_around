// UserInfo.js
export default class UserInfo {
  constructor({ userNameSelector, userDescriptionSelector }) {
    this._userNameElement = document.querySelector(userNameSelector);
    this._userDescriptionElement = document.querySelector(
      userDescriptionSelector,
    );
  }

  getUserInfo() {
    return {
      name: this._userNameElement.textContent,
      description: this._userDescriptionElement.textContent,
    };
  }

  setUserInfo({ name, description }) {
    if (name) this._userNameElement.textContent = name;
    if (description) this._userDescriptionElement.textContent = description;
  }
}
