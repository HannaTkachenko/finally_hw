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

const getFullName = (user) => `${user.firstName}${user.lastName}`;

const createCard = (user) => {
  const h2 = createElement(
    "h2",
    { classNames: ["fullName"] },
    document.createTextNode(getFullName(user) || "No Name")
  );

  return createElement(
    "article",
    { classNames: ["card"] },
    // createCardWrapper(user),
    h2,
    createLinkWrapper(user),
  );
};

const createLink = (element) => {
  const url = new URL(element);
  const link = document.createElement("a");
  link.classList.add("fa-brands");
  link.classList.add(mapSocialClass.get(url.hostname));
  link.setAttribute("href", element);
  link.setAttribute("target", "_blank");

  return link;
};

const createLinkWrapper = (user) => {
  const linkWrapper = document.createElement("ul");
  linkWrapper.classList.add("social-networks");

  const { contacts } = user;
  contacts.forEach((element) => {
    linkWrapper.append(createLink(element));
  });

  return linkWrapper;

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

fetch("./data.json")
  .then((response) => response.json())
  .then((users) => {
    const cards = users.map((user) => createCard(user));
    root.append(...cards);
  })
  .catch((error) => {
    document.body.prepend(document.createTextNode("500"));
    if (error instanceof TypeError) {
      console.error("Ошибка соединения: ", error);
    } else if (error instanceof SyntaxError) {
      console.error("Проверь запятые: ", error);
    } else {
      console.error(error);
    }
  });
