// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (username, password) => {
    cy.session(
        username,
        () => {
            cy.visit('/log_in')
            cy.get('input[id=email]').type(username)
            cy.get('input[id=password]').type(`${password}{enter}`, { log: false })
            cy.url().should('include', '/organizer')
            cy.contains('Profile')
        },
        {
            validate: () => {
                let token = window.localStorage.getItem('user')
                expect(token).to.exist
            },
        }
    )
    cy.visit('/organizer/my_events')
})

Cypress.Commands.add('logout', () => {
    //cy.get('a:contains(Log out)').click()
    cy.contains('a','Log out').click()
    cy.contains('a','Log out').should('not.exist')
    cy.url().should('eq', Cypress.config('baseUrl'))
    cy.contains('a','Log in')
    cy.visit('/')
})

Cypress.Commands.add('saveValue', { prevSubject: true }, (subject, alias) => {
    cy.wrap(subject).as(alias);
});