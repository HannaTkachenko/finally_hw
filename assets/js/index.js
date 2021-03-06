"use strict";
const root = document.getElementById("root");

const mapSocialClass = new Map();
mapSocialClass.set("www.facebook.com", "fa-facebook");
mapSocialClass.set("twitter.com", "fa-twitter");
mapSocialClass.set("www.instagram.com", "fa-instagram");

/**
 *
 * @param {string} tag
 * @param {object} options
 * @param {string[]} options.classNames
 * @param {objects} children
 * @returns
 */
const createElement = (
  tag = "div",
  { classNames = [], attributes = {}, events = {} },
  ...children
) => {
  const element = document.createElement(tag);
  if (classNames.length) {
    element.classList.add(...classNames);
  }
  for (const [nameAttr, valueAttr] of Object.entries(attributes)) {
    element.setAttribute(nameAttr, valueAttr);
  }
  for (const [typeEvent, handlerEvent] of Object.entries(events)) {
    element.addEventListener(typeEvent, handlerEvent);
  }

  element.append(...children);
  return element;
};

const getFullName = (user) => `${user.firstName} ${user.lastName}`;

const createCard = (user) => {
  return createElement(
    "article",
    { classNames: ["card"], events: { click: chooseHandler } },
    createCardWrapper(user),
    createUserName(user),
    createLinkWrapper(user)
  );
};

const createUserName = (user) => {
  const userName = createElement(
    "h2",
    { classNames: ["fullName"] },
    document.createTextNode(getFullName(user) || "No Name")
  );
  return userName;
};

const createLink = (element) => {
  const url = new URL(element);
  const link = createElement("a", {
    classNames: ["fa-brands", mapSocialClass.get(url.hostname)],
    attributes: { href: element, target: "_blank" },
  });
  return link;
};

const createLinkWrapper = (user) => {
  const linkWrapper = createElement("ul", { classNames: "social-networks" });
  const { contacts } = user;
  contacts.forEach((element) => {
    linkWrapper.append(createLink(element));
  });
  return linkWrapper;
};

const createImage = ({ id, profilePicture, firstName }) => {
  const img = createElement("img", {
    classNames: ["card-photo"],
    attributes: { src: profilePicture, alt: firstName, id: `wrapper-${id}` },
    events: { error: photoErrorHandler, load: photoLoadHandler },
  });
  return img;
};

const createInitials = (user) => {
  const { firstName, lastName } = user;

  const initials = createElement("div", {
    classNames: ["card-initials"],
  });
  initials.append(document.createTextNode(firstName[0] + lastName[0] || "NN"));
  initials.style.backgroundColor = stringToColour(firstName);
  return initials;
};

const createCardWrapper = (user) => {
  const { id } = user;
  const photoWrapper = createElement("div", {
    classNames: ["card-photo-wrapper"],
    attributes: { id: `wrapper-${id}` },
  });
  photoWrapper.append(createInitials(user));
  createImage(user);
  return photoWrapper;
};

const photoLoadHandler = ({ target }) => {
  const parent = document.getElementById(target.id);
  parent.append(target);
};

const photoErrorHandler = ({ target }) => {
  target.remove();
  return;
};

const stringToColour = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let colour = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).slice(-2);
  }
  return colour;
};

const createErrorSection = () => {
  return createElement(
    "section",
    { classNames: ["error"] },
    document.createTextNode("Sorry, we have some trouble")
  );
};

fetch("./data.json")
  .then((response) => response.json())
  .then((users) => {
    const cards = users
      .filter(({ firstName, lastName }) => firstName && lastName)
      .map((user) => createCard(user));
    root.append(...cards);
  })
  .catch((error) => {
    document.body.prepend(createErrorSection());

    if (error instanceof TypeError) {
      console.error("???????????? ????????????????????: ", error);
    } else if (error instanceof SyntaxError) {
      console.error("?????????????? ??????????????: ", error);
    } else {
      console.error(error);
    }
  });

const stateSet = new Set();
const state = [];
const choosed = document.getElementById("choosed");

const chooseHandler = (e) => {
  e.preventDefault();
  const choosedUserName = e.target.innerText;

  if (!state.includes(choosedUserName)) {
    state.push(choosedUserName);
    choosed.append(createList(choosedUserName));
  }
};
const createList = (choosedUserName) => {
  return createElement(
    "li",
    { classNames: ["selected-card"] },
    document.createTextNode(choosedUserName)
  );
};
