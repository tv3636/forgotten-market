describe("Book of Lore Wizard 0 opens", () => {
  it("successfully loads", () => {
    cy.visit("/lore/wizards/0/0");
  });
  it("can go next", () => {
    cy.get(".css-1kqcko6-NextPageContainer > a > div > img").click();
    cy.get(".css-lvys6w-BookOfLorePageWrapper").should("be.visible");
  });
});
