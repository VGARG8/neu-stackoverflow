// Template test file. Change the file to add more tests.
describe.skip('Create Account/ Login/ Logout ', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
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

    cy.wait(1000); 

  });

  it('should not allow creating an account with an email or username that already exists', () => {
  // Visit the main page
  cy.visit('http://localhost:3000');

  // Click the "Register" button
  cy.get('button').contains('Register').click();

  // Fill out the registration form with an existing user's details
  cy.get('input[name="username"]').type('UserOne');
  cy.get('input[name="email"]').type('userone@example.com');
  cy.get('input[name="password"]').type('password1');

  // Submit the form
  cy.get('form').submit();

  // Check for an error message indicating the username or email already exists
  cy.get('.error-message').should('contain', 'Registration failed');
});

  it('should log in an existing user', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

    // Fill out the login form
    cy.get('input[type="email"]').type('userone@example.com');
    cy.get('input[type="password"]').type('password1');

    // Submit the form
    cy.get('form').find('button[type="submit"]').click()
    cy.wait(100)


    // Check that a welcome message is displayed
    cy.contains('Welcome, UserOne!');
  });

  it('should add test questions and answers after login', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

  // Fill out the login form
    cy.get('input[type="email"]').type('userone@example.com');
    cy.get('input[type="password"]').type('password1');

    // Submit the form
    cy.get('form').submit();

    // Check that a welcome message is displayed
    cy.contains('Welcome, UserOne!');

    // Add 10 questions and answers
    for (let i = 1; i <= 5; i++) {
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


   it('displays the question list header correctly', () => {
    cy.visit('http://localhost:3000');
    cy.get('.question-list-header').should('exist');
 
  });

  it('shows the correct number of questions and sorting options', () => {
    cy.visit('http://localhost:3000');

    cy.get('.question-list-subheader').should('exist');
    cy.get('button').contains('Newest').should('exist');
    cy.get('button').contains('Active').should('exist');
    cy.get('button').contains('Unanswered').should('exist');
  });

  it('displays each question with details', () => {
    cy.visit('http://localhost:3000');

    cy.get('.question').each(($question) => {
      cy.wrap($question).find('.question-stats').should('exist');
      cy.wrap($question).find('.question-title').should('exist');
      cy.wrap($question).find('.question-post-details').should('exist');
      cy.wrap($question).find('.question-tags').should('exist');
    });
  });


  // check logout at the end:   
  it('should log out an existing user', () => {
    // Visit the main page
    cy.visit('http://localhost:3000');

    // Click the "Login" button
    cy.get('button').contains('Login').click();

  // Fill out the login form
    cy.get('input[type="email"]').type('userone@example.com');
    cy.get('input[type="password"]').type('password1');

    // Submit the form
    cy.get('form').submit();

    // Check that a welcome message is displayed
    cy.contains('Welcome, UserOne!');

    // Click the "Logout" button
    cy.get('button').contains('Logout').click();

    // Wait for a short period to allow the state update to complete
    cy.wait(1000); // Adjust the delay as needed

    // Check that the "Logout" button is no longer present
    cy.get('button').contains('Logout').should('not.exist');

    // Check that the "Login" button is present
    cy.get('button').contains('Login').should('exist');

  });


});  




  describe.skip('Un-registered Home Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list').children().should('have.length', 8);
    });
  });





    describe.skip('Registered Home Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list').children().should('have.length', 8);
    });
  });

// must be logged in 

  // it('displays the question list header correctly', () => {
  //   cy.visit('http://localhost:3000');
  //   cy.get('.question-list-header').should('exist');
  //   cy.get('.ask-new-question').should('exist');
  // });



    describe.skip('Search', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list').children().should('have.length', 8);
    });
  });



      describe.skip('tags', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list').children().should('have.length', 8);
    });
  });


      describe.skip('un-registered Answer Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list').children().should('have.length', 8);
    });
  });

      describe.skip('Registered Answer Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');
        cy.wait(1000)
      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });

    it('navigates between pages correctly', () => {
      cy.visit('http://localhost:3000');
      cy.get('.pagination-controls').should('exist');
      cy.get('button').contains('Previous').should('exist');
      cy.get('button').contains('Next').should('exist');
    });

    it('should display only 5 questions at a time', () => {
      cy.visit('http://localhost:3000');
      cy.get('.question-list').children().should('have.length', 8);
    });
  });
describe('User Profile Input Tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');


        cy.visit('http://localhost:3000');


        // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');
        cy.get('form').submit();
        cy.wait(1000)
    });

    afterEach(() => {
        // Clear the database after each test
        cy.exec('node  ../server/destroy.js');
    });
    it('should display the Profile button on the homepage when  logged in', () => {
        cy.visit('http://localhost:3000');
        cy.contains('Welcome, UserOne!');
        cy.contains('Profile').should('exist');

    });

    it('should navigate to the user profile page when Profile button is clicked', () => {
        cy.visit('http://localhost:3000');
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .click(); // Click the button
            cy.wait(1000);
        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
    });

    it('in user profile should find user name', () => {
        cy.visit('http://localhost:3000');
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.contains("UserOne").should('exist');
    });
    it('in user profile should find reputation', () => {
        cy.visit('http://localhost:3000');


        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.contains("Reputation").should('exist');
    });

    it('in user profile should find Tag Link', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('button').contains("Tag").should('exist');
    });
    it('in user profile should find Question link', () => {
        cy.visit('http://localhost:3000');
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').get('button').contains("Questions").should('exist');
    });
    it('in user profile should find Answer Link', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('button').contains("Answers").should('exist');
    });

    it('in user profile click on Question links', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
    });
    it('in user profile questions have pagination', () => {
        cy.visit('http://localhost:3000');

        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile')
            .click(); // Click the button // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
        cy.get('.user-profile').find('button').contains("Next").should('exist').click();
        cy.get('.user-profile').find('button').contains("Prev").should('exist').click();
    });

    it('in user profile questions check all the questions for user are present or not', () => {
        cy.visit('http://localhost:3000');

        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('testuser@example.com');
        cy.get('input[type="password"]').type('testpassword');

        // Submit the form
        cy.get('form').submit();

        cy.wait(2000)
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .should('exist') // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Questions").should('exist').click();
        let count = 0;
        for(let i =15;i>0;i--){
            count++;
            const questionText = `Test Question ${i}`;



            cy.get('.userQuestionList').contains(questionText).should('exist');
            if(count===5){
                cy.get('.user-profile').find('button').contains("Next").should('exist').click();
                count =0;
            }
        }
    });
    it('in user profile questions check all the answers for user are present or not', () => {
        cy.visit('http://localhost:3000');

        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('testuser@example.com');
        cy.get('input[type="password"]').type('testpassword');

        // Submit the form
        cy.get('form').submit();

        cy.wait(2000)
        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .should('exist') // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Answers").should('exist').click();
        let count = 0;
        for(let i =15;i>0;i--){
            count++;
            const answerText = `Answer Question ${i}`;



            cy.get('.useAnswerList').contains(answerText).should('exist');
            if(count===5){
                cy.get('.user-profile').find('button').contains("Next").should('exist').click();
                count =0;
            }
        }
    });
    it('in user profile questions check all the answers for user are present or not', () => {
        cy.visit('http://localhost:3000');


        // Click the Profile button
        cy
            .get('button') // Find the button inside that div
            .contains('Profile') // Look for the button with text 'Profile'
            .should('exist') // Ensure the button exists
            .click(); // Click the button

        // Assert that the 'User Profile' text exists on the page
        cy.contains('User Profile').should('exist');
        cy.get('.user-profile').find('button').contains("Tags").should('exist').click();
        cy.contains("JavaScript").should('exist');

    });



});






