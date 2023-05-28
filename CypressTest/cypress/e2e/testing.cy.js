beforeEach(() => {
  cy.visit('/')
  const { username, password } = {username:'lvb57003@nezid.com',password:'lvb57003'}
  cy.login(username, password)
})

describe('test logged user functionality', () => {
  const eventVal = 'Cypress'
  it('creating new event', function () {
    cy.get('div').contains('New event').click()
    cy.get('input[id=title]').type(eventVal)
    cy.get('input[id=startTime]').type('2023-12-11T10:00')
    cy.get('input[id=endTime]').type('2023-12-13T10:00')
    cy.get('input[id=categories]').type('test, e2e')
    cy.get('textarea[id=description]').type('e2e tests')
    cy.get('input[id=freePlaces]').type('111')
    cy.fixture('placeSchema.png').then(fileContent => {
      cy.get('input[type="file"]').attachFile({
        fileContent: fileContent.toString(),
        fileName: 'placeSchema.png',
        mimeType: 'image/png'
      });
    });
    cy.get('input[id=latitude]').type('23')
    cy.get('input[id=longitude]').type('55')
    let submitB = cy.get('button[id=submit]')
    submitB.should('contain.text', 'Create')
    cy.intercept('POST', '/events').as('postEvent')
    submitB.click()
    submitB.should('contain.text', 'Saving')
    cy.wait('@postEvent')
  })

  it('seeing details of new created event and deleting event', function () {
    cy.intercept('/events/*').as('getEvents')
    cy.intercept('DELETE', '/events/*').as('deleteEvent')

    cy.wait('@getEvents')
    cy.get('div.bg-black-gradient').should("have.length", "2")
        .eq(1)
        .click()
    cy.get('input[name=all]').should('be.checked')
    cy.get('input[name=inFuture]').click()
    cy.wait(1000)
    cy.contains('div',eventVal).click()
    cy.contains('div',eventVal).within(($ev) => {
      cy.contains('div.text-black','Description').should('contains.text','e2e test')
      cy.get('svg[data-icon=trash]').click()
    })
    cy.get('.bg-red-500').within( ($ev) => {
      cy.get('span').should('have.text', 'Are you sure you want to delete ' + eventVal + '?NoYes')
      cy.get('span').contains('Yes').click()
    })
    cy.wait('@deleteEvent')
    cy.wait('@getEvents')
    cy.contains('div',eventVal).within(($ev) => {
      cy.contains('div','Status').should('contain.text','Cancelled')
      cy.get('svg[data-icon=trash]').should('have.class','text-gray-500')
    })
    cy.get('input[name=inFuture]').should('not.be.checked')
    cy.get('input[name=cancelled]').click()
    cy.wait(1000)
    cy.get('div.null').parent().should('contain.text',eventVal)
  })

  it('changing organizer profile name', function () {
    cy.intercept('GET', '/organizer').as('organizerData')
    cy.intercept('PATCH', '/organizer/*').as('postOrganizerData')
    cy.get('div').contains('Profile').click()
    cy.wait('@organizerData')
    cy.get('svg[data-icon=user]').should('exist')
    cy.get('input').should('not.exist')
    cy.contains('div','Name:').should('exist')
    cy.contains('div','Email:').should('contain.text','lvb57003@nezid.com')
    cy.contains('div','Edit profile').click()
    cy.get('svg[data-icon=user-pen]').should('exist')

    let val = cy.get('input[type=text]').invoke('val').saveValue('name');
    cy.get('@name').then((val) => {
      let in1 = cy.get('input[type=text]')
      if (val.toString() === 'LVB2') {
        in1.clear()
        in1.type('LVB')
      } else if (val.toString() === 'LVB') {
        in1.clear()
        in1.type('LVB2')
      } else {
        console.error()
      }
    })
    cy.contains('button','Save').should('be.disabled')
    cy.get('input[type=password]').clear().type('lvb57003')
    cy.contains('button','Save').should('not.be.disabled').click()
    cy.wait('@postOrganizerData')

    cy.get('svg[data-icon=user]').should('exist')
    cy.get('input').should('not.exist')
    cy.contains('div','Name:').should('contain.text','LVB')

    cy.get('@name').then((val) => {
      cy.get('span.text-lg').eq(0).invoke('text').should('not.eq',val)
    })
  })

  it('logging out', function () {
    cy.logout()
  })
})