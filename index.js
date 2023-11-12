const COHORT = "2308-ACC-ET-WEB-PT";
const API = "https://fsa-crud-2aa9294fe819.herokuapp.com/api/" + COHORT;

const state = {
  events: [],
  event: null,
  guests: [],
  rsvps: [],
};

// The $ prefix is used here to denote variables that reference DOM elements
const $eventList = document.querySelector("#eventList");
const $eventDetails = document.querySelector("#eventDetails");
const $guests = document.querySelector("#guests");
const $guestList = document.querySelector("#guestList");

window.addEventListener("hashchange", selectEvent);

/**
 * Update state with data from the API and the DOM to reflect current state
 */
async function render() {
  await getEvents();
  await getGuests();
  await getRsvps();

  renderEvents();
  selectEvent();
}

render();

/**
 * Show details about the currently selected event
 */
function selectEvent() {
  getEventFromHash();
  renderEventDetails();
}

/**
 * Find the event that matches the current hash to update state
 */
function getEventFromHash() {
  // We need to slice the # off
  const id = window.location.hash.slice(1);
  state.event = state.events.find((event) => event.id === +id);
}

/**
 * GET the list of guests from the API to update state
 */
async function getGuests() {
  // TODO
}

/**
 * Render the list of guests for the currently selected event
 */
function renderGuests() {
  $guests.hidden = false;

  // TODO: Render the list of guests for the currently selected event
  $guestList.innerHTML = "<li>No guests yet!</li>";
}

// === No need to edit anything below this line! ===

/**
 * GET the list of events from the API to update state
 */
async function getEvents() {
  try {
    const response = await fetch(API + "/events");
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * GET the list of rsvps from the API to update state
 */
async function getRsvps() {
  try {
    const response = await fetch(API + "/rsvps");
    const json = await response.json();
    state.rsvps = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Update `$eventList` to reflect the current state
 */
function renderEvents() {
  const events = state.events.map(renderEvent);
  $eventList.replaceChildren(...events);
}

/**
 * @param {Event} event the event to render
 * @returns {HTMLElement} an article element representing the event
 */
function renderEvent(event) {
  const article = document.createElement("article");
  const date = event.date.slice(0, 10);

  article.innerHTML = `
    <h3><a href="#${event.id}">${event.name} #${event.id}</a></h3>
    <time datetime="${date}">${date}</time>
    <address>${event.location}</address>
  `;

  return article;
}

/**
 * Render details about the currently selected event
 */
function renderEventDetails() {
  if (!state.event) {
    $eventDetails.innerHTML = "<p>Select a event to see more.</p>";
    $guests.hidden = true;
    return;
  }

  const date = state.event.date.slice(0, 10);

  $eventDetails.innerHTML = `
    <h2>${state.event.name} #${state.event.id}</h2>
    <time datetime="${date}">${date}</time>
    <address>${state.event.location}</address>
    <p>${state.event.description}</p>
  `;

  renderGuests();
}
