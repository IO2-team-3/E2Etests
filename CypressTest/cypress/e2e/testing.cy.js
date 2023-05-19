beforeEach(() => {
  cy.visit('/')
  const { username, password } = {username:'lvb57003@nezid.com',password:'lvb57003'}
  cy.login(username, password)
})

//after(() => cy.logout())

describe('test1', () => {
  it('test log working', function () {
    cy.get('div').should('contain', `Organizer's panel`)
    // ...rest of test
  })

  it('test log out working', function () {
    cy.logout()
    //let token = window.localStorage.getItem('user')
    //expect(token).to.be.null
    // ...rest of test
  })
})