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
createElement = (
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

fullName = (user) => `${user.firstName}${user.lastName}`;

 createCard = (user)=>{
  const url = new URL(user.contacts[0]);
  const a = document.createElement('a');
  a.classList.add(mapSocialClass.get(url.hostname));
  
  return createElement('article',{}, document.createTextNode(user.fullName()) );
}

 stringToColour= (str) => {
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
}


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
