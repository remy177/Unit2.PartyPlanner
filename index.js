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
const $form = document.querySelector('form');
const $name = document.querySelector('#eventName');
const $desc = document.querySelector('#eventDesc');
const $date = document.querySelector('#eventDate');
const $location = document.querySelector('#eventLocation');
const $addBtn = document.querySelector('#addBtn');


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

async function addEvent(e) {
  // disable page refresh when form submit
  e.preventDefault();
  const name = $name.value;
  const desc = $desc.value;
  const date = $date.value;
  const location = $location.value;
  
  // reset form and do nothing if not all info entered
  if (!name || !desc || !date || !location) return;

  // to-do: fetch post add event via api
  try {
    const response = await fetch(API + "/events", {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        name: name,
        description: desc,
        date: new Date(date),
        location: location,
      })
    });
    const json = await response.json();
    console.log('event added... ' + json.data.name);
  } catch (error) {
    console.error(error);
  }

  // clear the value
  $name.value = $desc.value = $date.value = $location.value = '';

  // refresh page with new data
  render();
}

$form.addEventListener('submit', addEvent);

async function deleteEvent(e) {
  if (e.target.matches('button')) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`${API}/events/${id}`,{method: 'DELETE'});
      console.log('event('+id+') deleted... status:' + response.status);
    } catch (error) {
      console.error(error);
    }
  }
  // refresh page with new data
  render();
}

$eventList.addEventListener('click', deleteEvent);

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
  try {
    const response = await fetch(API + "/guests");
    const json = await response.json();
    state.guests = json.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Render the list of guests for the currently selected event
 */
function renderGuests() {
  $guests.hidden = false;

  // TODO: Render the list of guests for the currently selected event
  // Get guests for the current party
  const rsvps = state.rsvps.filter(
    (rsvp) => rsvp.eventId === state.event.id
  );
  const guestIds = rsvps.map((rsvp) => rsvp.guestId);
  const guests = state.guests.filter((guest) => guestIds.includes(guest.id));

  if (!guests.length) {
    $guestList.innerHTML = "<li>No guests yet!</li>";
    return;
  }

  const guestList = guests.map((guest) => {
    const guestInfo = document.createElement("li");
    guestInfo.innerHTML = `
      <span>${guest.name}</span>
      <span>${guest.email}</span>
      <span>${guest.phone}</span>
    `;
    return guestInfo;
  });

  $guestList.replaceChildren(...guestList);
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
    <section><h3><a href="#${event.id}">${event.name} #${event.id}</a></h3>
    <div class="row">
    <div class="col-sm-7">
    <time datetime="${date}">${date}</time>
    <address>${event.location}</address>
    </div>
    <div class="col-sm">
    <button data-id="${event.id}"class="btn btn-light">Delete Event</button>
    </div>
    </div>
    </section>
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
