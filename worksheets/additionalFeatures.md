# Table of Contents
- [Table of Contents](#table-of-contents)
- [Additional Features](#additional-features)
  - [Automated testing](#automated-testing)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Workflow](#workflow)
    - [Advantages & Disadvantages of automated testing](#advantages--disadvantages-of-automated-testing)
      - [Advantages](#advantages)
      - [Disadvantages](#disadvantages)
  - [Travis CI/CD](#travis-cicd)
    - [Workflow](#workflow-1)
    - [Importance of having automated CI/CD](#importance-of-having-automated-cicd)

# Additional Features

1) Automated testing
2) Travis CI/CD

## Automated testing

Libraries used:
* Cypress
* Mocha

### Frontend

Using Cypress, automatically test the frontend to ensure that:

(a) The backend is called correctly ( ajax url is correct )
(b) Data returned from the backend is displayed correctly

### Backend

Write something here..

### Workflow

1. Studying the needed APIs
2. Designing specific test suites and test cases
3. Test case sheet

### Advantages & Disadvantages of automated testing

#### Advantages

* Reliable
* Comprehensive
* Fast
* Reusable

#### Disadvantages

* Comprehensiveness depends on the test suites and test cases designed
* Difficult to maintain
* Unable to test frontend UI/UX design, only the functionality

## Travis CI/CD

Services used:
* Travis
* Heroku
* Github pages

### Workflow

1. Learn to use Github actions, Travis CI and Heroku CI
2. Test migration and creation of new tests for CI/CD
3. Continuous improvement and addition to tests as more features are developed

### Importance of having automated CI/CD

1. Overall time save in catching of bugs
2. Prevents the deployment of broken code