# 1. Table of Contents
- [1. Table of Contents](#1-table-of-contents)
- [2. Additional Features](#2-additional-features)
  - [2.1. Automated testing](#21-automated-testing)
    - [2.1.1. What is something about this feature you can demo?](#211-what-is-something-about-this-feature-you-can-demo)
    - [2.1.2. What is something about this feature you can talk about? (I.e. cannot be shown with just code/demo)](#212-what-is-something-about-this-feature-you-can-talk-about-ie-cannot-be-shown-with-just-codedemo)
    - [2.1.3. What are the things you need to do to make this feature work? How much time will you need for each task?](#213-what-are-the-things-you-need-to-do-to-make-this-feature-work-how-much-time-will-you-need-for-each-task)
    - [2.1.4. Which components will be involved?](#214-which-components-will-be-involved)
    - [2.1.5. Details of the additional feature](#215-details-of-the-additional-feature)
      - [2.1.5.1. Frontend](#2151-frontend)
      - [2.1.5.2. Backend](#2152-backend)
      - [2.1.5.3. Workflow](#2153-workflow)
    - [2.1.6. Advantages & Disadvantages of automated testing](#216-advantages--disadvantages-of-automated-testing)
      - [2.1.6.1. Advantages](#2161-advantages)
      - [2.1.6.2. Disadvantages](#2162-disadvantages)
  - [2.2. Travis CI/CD](#22-travis-cicd)
    - [2.2.1. Workflow](#221-workflow)
    - [2.2.2. Importance of having automated CI/CD](#222-importance-of-having-automated-cicd)

# 2. Additional Features

1) Automated testing
2) Travis CI/CD

## 2.1. Automated testing

This additional feature would allow us to write, run and test our code easily using libraries and npm scripts

### 2.1.1. What is something about this feature you can demo? 

We can show how we would use the automated infrastructure to test code as we would develop features.  

- Backend
  - Unit test
  - Integration Test
- Frontend
  - Unit test
  - Integration Test

### 2.1.2. What is something about this feature you can talk about? (I.e. cannot be shown with just code/demo) 

- How it helped streamline the process of development (BBD)
  - Thinking and writing the tests before developing the feature
- Helped us gain confidence that our code works and is robust
  - With the test in place, it made sure any new code would not break the old code

### 2.1.3. What are the things you need to do to make this feature work? How much time will you need for each task? 

- We would need to deign our servers to be able to interface with our testing libraries

Total hours required : >4 Hours

### 2.1.4. Which components will be involved? 

- Backend
- Frontend

### 2.1.5. Details of the additional feature

Libraries used:
* Cypress
* Mocha

#### 2.1.5.1. Frontend

Using Cypress, automatically test the frontend to ensure that:

(a) The backend is called correctly ( ajax url is correct )
(b) Data returned from the backend is displayed correctly

#### 2.1.5.2. Backend

The tests were written in `Mocha` with `Chai` as the assertion library.  

- Unit tests were written to mainly ensure each function and module worked as intended
- Integration tests were written to mainly ensure the backend server from an API interface stand point worked correctly.

#### 2.1.5.3. Workflow

1. Planning out the functionality and feature
2. Planning the test cases based on the feature
3. Documenting them down on google sheets
4. Coding out the tests and feature
5. Running them for each commit/change and update the google sheet respectively

### 2.1.6. Advantages & Disadvantages of automated testing

#### 2.1.6.1. Advantages

* Reliable
* Comprehensive
* Fast
* Reusable

#### 2.1.6.2. Disadvantages

* Comprehensiveness depends on the test suites and test cases designed
* More Difficult to maintain
* Unable to test frontend UI/UX design, only the functionality

## 2.2. Travis CI/CD

Services used:
* Travis
* Heroku
* Github pages

### 2.2.1. Workflow

1. Learn to use Github actions, Travis CI and Heroku CI
2. Test migration and creation of new tests for CI/CD
3. Continuous improvement and addition to tests as more features are developed

### 2.2.2. Importance of having automated CI/CD

1. Overall time save in catching of bugs
2. Prevents the deployment of broken code