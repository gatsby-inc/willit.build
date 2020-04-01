describe("Footer", () => {
  beforeEach(() => {
    // Just go on an page that has the header
    cy.visit("/")
  })

  it("should some internal navigation links", () => {
    cy.get("[data-cy=footer]").within(() => {
      cy.get('[href="/methodology-faq"]').should("be.visible")
      cy.get('[href="/api-playground"]').should("be.visible")
      cy.get('[href="/calculator"]').should("be.visible")
    })
  })

  it("should own some information about the project", () => {
    cy.get("[data-cy=footer-note__content").should("be.visible")
  })

  it("should own some external links", () => {
    cy.get("[data-cy=footer]").within(() => {
      cy.get('[href="https://www.gatsbyjs.com/get-started"]').should(
        "be.visible"
      )
      cy.get('[href="https://github.com/gatsbyjs/gatsby"]').should("be.visible")
      cy.get('[href="https://twitter.com/gatsbyjs"]').should("be.visible")
      cy.get('[href="https://www.gatsbyjs.com/contact-us/"]').should(
        "be.visible"
      )
    })
  })
})