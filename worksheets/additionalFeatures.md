# 1. Table of Contents
- [1. Table of Contents](#1-table-of-contents)
- [2. Additional Features](#2-additional-features)
  - [2.1. Automated testing](#21-automated-testing)
    - [2.1.1. What is something about this feature you can demo?](#211-what-is-something-about-this-feature-you-can-demo)
    - [What is something about this feature you can talk about? (I.e. cannot be shown with just code/demo)](#what-is-something-about-this-feature-you-can-talk-about-ie-cannot-be-shown-with-just-codedemo)
    - [2.1.2. Frontend](#212-frontend)
    - [2.1.3. Backend](#213-backend)
    - [2.1.4. Workflow](#214-workflow)
    - [2.1.5. Advantages & Disadvantages of automated testing](#215-advantages--disadvantages-of-automated-testing)
      - [2.1.5.1. Advantages](#2151-advantages)
      - [2.1.5.2. Disadvantages](#2152-disadvantages)
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

### What is something about this feature you can talk about? (I.e. cannot be shown with just code/demo) 

- How it helped streamline the process of development (BBD)
- 

What are the things you need to do to make this feature work? How much time will you need for each task? 

Total hours required 

Which components will be involved? 

Libraries used:
* Cypress
* Mocha

### 2.1.2. Frontend

Using Cypress, automatically test the frontend to ensure that:

(a) The backend is called correctly ( ajax url is correct )
(b) Data returned from the backend is displayed correctly

### 2.1.3. Backend

Write something here..

### 2.1.4. Workflow

1. Studying the needed APIs
2. Designing specific test suites and test cases
3. Test case sheet

### 2.1.5. Advantages & Disadvantages of automated testing

#### 2.1.5.1. Advantages

* Reliable
* Comprehensive
* Fast
* Reusable

#### 2.1.5.2. Disadvantages

* Comprehensiveness depends on the test suites and test cases designed
* Difficult to maintain
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