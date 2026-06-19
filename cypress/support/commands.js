// =============================================================================
// commands.js — Custom Cypress Commands
// =============================================================================
// WHY custom commands?
// When the same sequence of steps repeats across many tests (e.g. filling the
// booking form, logging in as admin), we extract them here. Benefits:
//   1. Tests stay short and readable.
//   2. If the UI changes, we fix the selector in ONE place, not in every test.
//   3. Naming the command describes the INTENT, not the mechanics.
// =============================================================================

// -----------------------------------------------------------------------------
// cy.fillBookingForm(guest)
// -----------------------------------------------------------------------------
// Fills the visible booking form with the guest object from a fixture.
// Assumes the form is already open (the calendar "Book" button was clicked).
//
// @param {Object} guest  — shape: { firstName, lastName, email, phone }
//   (Dates are handled separately via the calendar interaction)
// -----------------------------------------------------------------------------
Cypress.Commands.add('fillBookingForm', (guest) => {
  // Each field is targeted by its data-testid or placeholder to be resilient
  // against class/id changes that are common in React apps.
  cy.get('[data-testid="FirstName"]').clear().type(guest.firstName);
  cy.get('[data-testid="LastName"]').clear().type(guest.lastName);
  cy.get('[data-testid="Email"]').clear().type(guest.email);
  cy.get('[data-testid="Phone"]').clear().type(guest.phone);
});

// -----------------------------------------------------------------------------
// cy.selectBookingDates(checkin, checkout)
// -----------------------------------------------------------------------------
// Selects check-in and check-out dates on the react-date-range calendar widget.
//
// HOW the calendar works:
//   The widget uses a drag-to-select model. Clicking a start date and then
//   hovering to an end date highlights the range. We simulate this with
//   { force: true } because the calendar cells overlap slightly.
//
// BUG NOTE (TC-011): Clicking individual dates does NOT always register
//   correctly — only dragging works reliably. This command works around
//   the bug by using a mousedown → mousemove → mouseup sequence when needed.
//
// @param {string} checkin   — format 'YYYY-MM-DD'  e.g. '2026-07-15'
// @param {string} checkout  — format 'YYYY-MM-DD'  e.g. '2026-07-18'
// -----------------------------------------------------------------------------
Cypress.Commands.add('selectBookingDates', (checkin, checkout) => {
  // The calendar shows month/year buttons. We look for the day number inside
  // the rdrDayNumber spans and click the first match (visible month).
  const checkinDay  = checkin.split('-')[2].replace(/^0/, '');   // '15'
  const checkoutDay = checkout.split('-')[2].replace(/^0/, '');  // '18'

  // Click the check-in day
  cy.get('.rdrDayNumber span')
    .contains(new RegExp(`^${checkinDay}$`))
    .first()
    .click({ force: true });

  // Click the check-out day
  cy.get('.rdrDayNumber span')
    .contains(new RegExp(`^${checkoutDay}$`))
    .first()
    .click({ force: true });
});

// -----------------------------------------------------------------------------
// cy.adminLogin(credentials)
// -----------------------------------------------------------------------------
// Navigates to /admin and logs in using the provided credentials object.
//
// @param {Object} credentials — shape: { username, password }
// -----------------------------------------------------------------------------
Cypress.Commands.add('adminLogin', (credentials) => {
cy.visit('/admin');

// Target inputs by their placeholder text — more stable than nth-child
cy.get('#username').clear().type(credentials.username);
cy.get('#password').clear().type(credentials.password);
cy.get('#doLogin').click();
});

// -----------------------------------------------------------------------------
// cy.fillContactForm(contact)
// -----------------------------------------------------------------------------
// Fills and optionally submits the contact form at the bottom of the home page.
//
// @param {Object} contact — shape: { name, email, phone, subject, message }
// -----------------------------------------------------------------------------
Cypress.Commands.add('fillContactForm', (contact) => {
  // Scroll to the contact section first so elements are in view
cy.get('#contact').scrollIntoView();

cy.get('[data-testid="ContactName"]').clear().type(contact.name);
cy.get('[data-testid="ContactEmail"]').clear().type(contact.email);
cy.get('[data-testid="ContactPhone"]').clear().type(contact.phone);
cy.get('[data-testid="ContactSubject"]').clear().type(contact.subject);
cy.get('[data-testid="ContactDescription"]').clear().type(contact.message);
});