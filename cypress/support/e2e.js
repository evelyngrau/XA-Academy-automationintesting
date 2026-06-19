// =============================================================================
// e2e.js — Global Cypress Support File
// =============================================================================

import './commands';

// Suppress only the known React #418 error documented as BUG-032.
// Do not use cy.log() inside Cypress.on().
Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('Minified React error #418')) {
    console.warn('BUG-032 suppressed: Minified React error #418');
    return false;
  }

  return true;
});