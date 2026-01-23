// UserInfo.js
export default class UserInfo {
  constructor({
    userNameSelector,
    userDescriptionSelector,
    userAvatarSelector,
  }) {
    this._userNameElement = document.querySelector(userNameSelector);
    this._userDescriptionElement = document.querySelector(
      userDescriptionSelector,
    );
    this._userAvatarElement = document.querySelector(userAvatarSelector);
  }

  getUserInfo() {
    return {
      name: this._userNameElement.textContent,
      description: this._userDescriptionElement.textContent,
      avatar: this._userAvatarElement ? this._userAvatarElement.src : null,
    };
  }

  setUserInfo({ name, description, avatar }) {
    if (name) this._userNameElement.textContent = name;
    if (description) this._userDescriptionElement.textContent = description;
    if (avatar && this._userAvatarElement) this._userAvatarElement.src = avatar;
  }

  setUserAvatar(avatar) {
    if (avatar && this._userAvatarElement) {
      this._userAvatarElement.src = avatar;
    }
  }
}
