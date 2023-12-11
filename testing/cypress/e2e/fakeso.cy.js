// Template test file. Change the file to add more tests.


describe.skip('Create Account/ Login/ Logout ', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

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
      cy.get('.question-list .question').should('have.length', 5);
    });

    it('should find the text: Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Cloud Computing Basics');
});

it('should find the title of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h3.postTitle').contains('Cloud Computing Basics');
});

it('should find the body text of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h4.postBody').contains('What are the basics everyone should know about cloud computing?');
});

it('should find the user who asked the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-post-details.lastActivity span').contains('UserThree asked');
});

it('should find the tags of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-tags .tag').contains('javascript');
  cy.get('.question-tags .tag').contains('python');
});

it('should find the score of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-score').contains('Score: 5');
});

it('should find the views and answers of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-stats.postStats span').contains('10 views');
  cy.get('.question-stats.postStats span').contains('2 answers');
});


  });





    describe.skip('Registered Home Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

        
        cy.visit('http://localhost:3000');


        // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');

        cy.get('button[type="submit"]').contains('Login').click();

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
      cy.get('.question-list .question').should('have.length', 5);
    });

    it('should find the text: Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.contains('Cloud Computing Basics');
});

it('should find the title of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h3.postTitle').contains('Cloud Computing Basics');
});

it('should find the body text of question Cloud Computing Basics', () => {
  cy.visit('http://localhost:3000');
  cy.get('h4.postBody').contains('What are the basics everyone should know about cloud computing?');
});

it('should find the user who asked the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-post-details.lastActivity span').contains('UserThree asked');
});

it('should find the tags of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-tags .tag').contains('javascript');
  cy.get('.question-tags .tag').contains('python');
});

it('should find the score of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-score').contains('Score: 5');
});

it('should find the views and answers of the question', () => {
  cy.visit('http://localhost:3000');
  cy.get('.question-stats.postStats span').contains('10 views');
  cy.get('.question-stats.postStats span').contains('2 answers');
});

it('should find the Ask a Question button', () => {
  cy.visit('http://localhost:3000');
  cy.get('button.ask-new-question').should('exist');
});

it('should find the welcome message and reputation', () => {
  cy.visit('http://localhost:3000');
  cy.get('span').contains('Welcome, UserOne! (Reputation: 50)');
});

it('should find the Profile button', () => {
  cy.visit('http://localhost:3000');
  cy.get('button').contains('Profile').should('exist');
});




});


    describe.skip('Search', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

      });

      afterEach(() => {
        // Clear the database after each test
       cy.exec('node  ../server/destroy.js');
      });


      
  it('should find the question "CSS Grid vs Flexbox"', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('CSS grid{enter}');
    cy.get('h3.postTitle').contains('CSS Grid vs Flexbox');
  });

  it('should find the question "Effective use of Hooks in React & Database Optimization Strategies"', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('effective{enter}');
    cy.get('h3.postTitle').contains('Effective use of Hooks in React');
    cy.get('h3.postTitle').contains('Database Optimization Strategies');

  });

  it('should find the question "Understanding Async Programming in JavaScript"', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('Understanding{enter}');
    cy.get('h3.postTitle').contains('Understanding Async Programming in JavaScript');
  });


    it('should find the question "Angular Performance Tips" when searching for [reactjs]', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[reactjs]{enter}');
    cy.get('h3.postTitle').contains('Angular Performance Tips');
  });

  it('should find the question "Securing Web Applications" when searching for [java]', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[java]{enter}');
    cy.get('h3.postTitle').contains('Securing Web Applications');
  });

  it('should find the question "Cloud Computing Basics" when searching for [nodejs]', () => {
    cy.visit('http://localhost:3000');
    cy.get('#searchBar').type('[nodejs]{enter}');
    cy.get('h3.postTitle').contains('Cloud Computing Basics');
  });


});



describe.skip('tags', () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');

    cy.visit('http://localhost:3000');
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec('node  ../server/destroy.js');
  });

it('should navigate to the tags page and find 10 tags', () => {
  cy.get('button').contains('Tags').click();
  cy.get('h2').contains('10 Tags'); 
});

  it('should display 10 tags', () => {
    cy.get('button').contains('Tags').click();
    cy.get('h2').contains('10 Tags');
  });

  const tags = [
    { name: 'javascript', count: 3 },
    { name: 'python', count: 3 },
    { name: 'csharp', count: 4 },
  ];

  tags.forEach((tag) => {
    it(`should display correct question count for ${tag.name}`, () => {
      cy.get('button').contains('Tags').click();
      cy.get('.tagNode').contains(tag.name).click();
      cy.get('span').contains(`${tag.count} questions`);
    });
  });
});



describe('un-registered Answer Page tests', () => {
  beforeEach(() => {
    // Seed the database before each test
    cy.exec('node ../server/init.js');

    cy.visit('http://localhost:3000');
    cy.get('h3.postTitle').contains('Understanding Async Programming in JavaScript').click();
  });

  afterEach(() => {
    // Clear the database after each test
    cy.exec('node  ../server/destroy.js');
  });

  it('should find the pagination buttons for comments', () => {
    cy.get('button').contains('Previous').should('exist');
    cy.get('button').contains('Next').should('exist');
  });

  it('should find the answer pagination controls', () => {
    cy.get('.pagination-controls').should('exist');
    cy.get('.pagination-controls button').contains('Previous');
    cy.get('.pagination-controls button').contains('Next');
  });

  it('should find the views count', () => {
    cy.get('span').contains('11 views').should('exist');
  });

  it('should find the question body', () => {
    cy.get('p').contains('Can someone explain how async programming works in JavaScript?').should('exist');
  });

  it('should find the answer text', () => {
  cy.get('p.answerText').should('exist');
  });
  
  it('should find the user who asked the question', () => {
  cy.get('small').contains('UserTwo asked');
  });

  it('should find the UserThree who commented three times on the question', () => {
  cy.get('small').contains('UserThree commented');
  });

});



      describe.skip('Registered Answer Page tests', () => {
    beforeEach(() => {
        // Seed the database before each test
        cy.exec('node ../server/init.js');

        
        cy.visit('http://localhost:3000');


            // Click the "Login" button
        cy.get('button').contains('Login').click();

        // Fill out the login form
        cy.get('input[type="email"]').type('userone@example.com');
        cy.get('input[type="password"]').type('password1');
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







