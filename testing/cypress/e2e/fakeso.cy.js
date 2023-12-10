// Template test file. Change the file to add more tests.
describe('Fake SO Test Suite', () => {
    beforeEach(() => {
        // Seed the database before each test
        //cy.exec('node ../server/populate_db.js');
        //cy.wait(2000)
      });

      afterEach(() => {
        // Clear the database after each test
       // cy.exec('node  ../../server/destroy.js');
      });
    it('successfully shows All Questions string', () => {
        cy.visit('http://localhost:3000');
        cy.contains('All Questions');
    });

    it('should create a new account', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Register" button
    cy.get('button').contains('Register').click();

    // Fill out the registration form
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="password"]').type('testpassword');

    // Submit the form
    cy.get('form').submit();

    // Check that a success message is displayed
    cy.get('.success-message').should('contain', 'Registration successful!');


  });

  it('should log in an existing user', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

    // Fill out the login form
    cy.get('input[type="email"]').type('testuser@example.com');
    cy.get('input[type="password"]').type('testpassword');

    // Submit the form
    cy.get('form').submit();

    cy.wait(2000)


    // Check that a welcome message is displayed
    cy.contains('Welcome, testuser!');
  });

  it('should add test questions and answers after login', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

    // Fill out the login form
    cy.get('input[type="email"]').type('testuser@example.com');
    cy.get('input[type="password"]').type('testpassword');

    // Submit the form
    cy.get('form').submit();

    // Check that a welcome message is displayed
    cy.contains('Welcome, testuser!');

    // Add 10 questions and answers
    for (let i = 1; i <= 10; i++) {
        // Add a question
        cy.contains('Ask a Question').click();
        cy.get('#formTitleInput').type(`Test Question ${i}`);
        cy.get('#formTextInput').type(`Test Question ${i} Text`);
        cy.get('#formTagInput').type('javascript');
        cy.contains('Post Question').click();

        // Add an answer to the question
        cy.contains(`Test Question ${i}`).click();
        cy.contains('Answer Question').click();
        cy.get('#answerTextInput').type(`Answer Question ${i}`);
        cy.contains('Post Answer').click();

        // Go back to the main page to add the next question
        cy.visit('http://localhost:3000');
    }
});

  it('should display a menu with options to view all questions, view all tags, and a search box', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Questions').should('exist');
    cy.get('button').contains('Tags').should('exist');
    cy.contains('All Questions').should('exist');
    cy.get('.search-bar').should('exist');
  });



  it('should display next and prev buttons', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Next').should('exist');
    cy.get('button').contains('Prev').should('exist');
  });

  it('should navigate to next 5 questions when next button is clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Next').click();
    // Add assertions to check that the next 5 questions are displayed
  });

  it('should navigate to previous 5 questions when prev button is clicked', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Next').click();
    cy.get('button').contains('Prev').click();
    // Add assertions to check that the previous 5 questions are displayed
  });

  it('should disable prev button when first 5 questions are displayed', () => {
    cy.visit('http://localhost:3000');
    cy.get('button').contains('Prev').should('be.disabled');
  });






















// more tests
// after questions have been populated

//     it('should display question details correctly', () => {
//     cy.visit('http://localhost:3000');
//     cy.get('.question-list').children().first().within(() => {
//       cy.get('.question-title').should('exist');
//       cy.get('.question-tags').should('exist');
//       cy.get('.question-stats').should('exist'); // This checks for views and answers
//       cy.get('.question-vote-buttons').should('exist'); // This checks for voting buttons
//       cy.get('.question-score').should('exist'); // This checks for votes
//       cy.get('.question-post-details').should('exist'); // This checks for author and date
//       cy.get('.authorEmail').should('exist'); // This checks for author email
//     });
//   });


//   it('should display only 5 questions at a time', () => {
//     cy.visit('http://localhost:3000');
//     cy.get('.question-list').children().should('have.length', 5);
//   });




//   it('should display next and prev buttons', () => {
//     cy.visit('http://localhost:3000');
//     cy.get('button').contains('Next').should('exist');
//     cy.get('button').contains('Prev').should('exist');
//   });


//   it('should navigate to first 5 questions when next button is clicked on the last page', () => {
//     cy.visit('http://localhost:3000');
//     // Navigate to the last page
//     // ...

//     cy.get('button').contains('Next').click();
//   });





// check logout at the end:   
  it('should log out an existing user', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

    // Fill out the login form
    cy.get('input[type="email"]').type('testuser@example.com');
    cy.get('input[type="password"]').type('testpassword');

    // Submit the form
    cy.get('form').submit();

    // Check that a welcome message is displayed
    cy.contains('Welcome, testuser!');

    // Click the "Logout" button
    cy.get('button').contains('Logout').click();

    // Wait for a short period to allow the state update to complete
    cy.wait(1000); // Adjust the delay as needed

    // Check that the "Logout" button is no longer present
    cy.get('button').contains('Logout').should('not.exist');

    // Check that the "Login" button is present
    cy.get('button').contains('Login').should('exist');

  });



  //User profile tests
    it('should display the Profile button on the homepage when logged in', () => {
        cy.get('button').contains('Profile').should('exist');
    });

    it('should navigate to the user profile page when Profile button is clicked', () => {
        cy.get('button').contains('Profile').click();
        // cy.url().should('include', '/user-profile'); // Adjust the URL if it differs
        cy.get('.user-profile').should('exist');
        cy.contains('User Profile').should('exist');

    });
});



