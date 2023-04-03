/// <reference types = 'cypress'/>

declare namespace Cypress {
    interface Chainable {
        openForm(form): Chainable<string>;
        fillForm(dropdownField, inputField, text): Chainable<string>;
        filllogin(): Chainable<string>;
    }
}
 