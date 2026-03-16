describe('TODO App', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/');
  });

  it('should add a TODO when typing a title and pressing Enter', () => {
    cy.dataCy('todo-input').type('Buy milk{enter}');

    cy.dataCy('todo-list').should('exist');
    cy.get('.q-item').should('have.length', 1);
    cy.get('.q-item').first().should('contain.text', 'Buy milk');
  });

  it('should display all TODOs after adding multiple items', () => {
    cy.dataCy('todo-input').type('Buy milk{enter}');
    cy.dataCy('todo-input').type('Walk the dog{enter}');
    cy.dataCy('todo-input').type('Read a book{enter}');

    cy.get('.q-item').should('have.length', 3);
  });

  it('should mark a TODO as completed when the checkbox is clicked', () => {
    cy.dataCy('todo-input').type('Buy milk{enter}');

    cy.get('.q-item').first().find('.q-checkbox').click();

    cy.get('.todo-completed').should('exist');
    cy.dataCy('remaining-count').should('contain.text', '0');
  });

  it('should update a TODO title when using the edit button', () => {
    cy.dataCy('todo-input').type('Buy milk{enter}');

    cy.get('.q-item').first().find('[data-cy^="todo-edit-"]').click();
    // Clear existing text and type new title
    cy.get('.q-item').first().find('input[data-cy^="todo-edit-input-"]').clear().type('Buy cheese{enter}');

    cy.get('.q-item').first().should('contain.text', 'Buy cheese');
    cy.get('.q-item').first().should('not.contain.text', 'Buy milk');
  });

  it('should cancel an edit when Escape is pressed', () => {
    cy.dataCy('todo-input').type('Buy milk{enter}');

    cy.get('.q-item').first().find('[data-cy^="todo-edit-"]').click();
    cy.get('.q-item').first().find('input[data-cy^="todo-edit-input-"]').clear().type('Changed{esc}');

    cy.get('.q-item').first().should('contain.text', 'Buy milk');
  });

  it('should remove a TODO when the delete button is clicked', () => {
    cy.dataCy('todo-input').type('Buy milk{enter}');
    cy.dataCy('todo-input').type('Walk the dog{enter}');

    cy.get('.q-item').first().find('[data-cy^="todo-delete-"]').click();

    cy.get('.q-item').should('have.length', 1);
    cy.get('.q-item').first().should('contain.text', 'Walk the dog');
  });

  it('should filter TODOs by All, Active, and Completed', () => {
    cy.dataCy('todo-input').type('Active todo{enter}');
    cy.dataCy('todo-input').type('Completed todo{enter}');

    // Complete the second todo
    cy.get('.q-item').eq(1).find('.q-checkbox').click();

    // Filter: Active
    cy.dataCy('filter-active').click();
    cy.get('.q-item').should('have.length', 1);
    cy.get('.q-item').first().should('contain.text', 'Active todo');

    // Filter: Completed
    cy.dataCy('filter-completed').click();
    cy.get('.q-item').should('have.length', 1);
    cy.get('.q-item').first().should('contain.text', 'Completed todo');

    // Filter: All
    cy.dataCy('filter-all').click();
    cy.get('.q-item').should('have.length', 2);
  });

  it('should clear completed TODOs', () => {
    cy.dataCy('todo-input').type('Active todo{enter}');
    cy.dataCy('todo-input').type('Completed todo{enter}');

    cy.get('.q-item').eq(1).find('.q-checkbox').click();
    cy.dataCy('clear-completed').click();

    cy.get('.q-item').should('have.length', 1);
    cy.get('.q-item').first().should('contain.text', 'Active todo');
  });

  it('should persist TODOs across page reloads', () => {
    cy.dataCy('todo-input').type('Persistent todo{enter}');

    cy.reload();

    cy.get('.q-item').should('have.length', 1);
    cy.get('.q-item').first().should('contain.text', 'Persistent todo');
  });

  it('should not add a TODO when the input is empty', () => {
    cy.dataCy('todo-input').type('{enter}');

    cy.dataCy('empty-state').should('exist');
    cy.dataCy('todo-list').should('not.exist');
  });
});
