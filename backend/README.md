# Backend

## Requirements

1. APIs
   1. Basic
      1. GET /basic/data
      2. GET /basic/result
      3. POST /basic/insert
   2. Advanced
      1. GET /advance/data
      2. GET /advance/result
      3. POST /advance/insert
2. Persistent database
   1. ElephantSQL (PostgreSQL)
3. CORS
4. Deployment

## Notes

- Code documentation is in the code base
  - Refer to our [Code style](../worksheets/code_style.md) document for more details
- `test` folder holds the automated tests used
  - We used mocha and npm to run these tests
  - Check the `package.json` file to see what the script is really like
- Make sure the `.env` file and environment variables are set properly  
  - Refer to the `.env.sample` file to create your own `.env` file
- Backend Server overview
  - Methodology
    - We abstract each layer of the backend stack into its own folder and files
        - This allows us to build up each functionality individually
        - This also allows us to test and set up configs for each section easily
    - The main logic of the API is handled by the controller
      - This is to take advantage of the modularity of the stack
      - Each controller only calls what it needs
      - High level overview of control
  - File Structure brief explaination
    - `algo`
      - Contains the files related to any of the algorithms/computation required
    - `controllers`
      - Contains all the controllers used by the Backend server with their respective API endpoints
    - `db`
      - Contains the database models, used to abstract the connection and querying of the PostgreSQL database
    - `utils`
      - Contains utility modules, such as parsing data or validation
      - Contains anything that does not qualify for a folder, but does not fit in any of the folders
    - `scripts`
      - Contains usual scripts used by the server or the PostgreSQL database
    - `test`
      - Contains all the tests for the Backend server
      - Built on `Mocha` and `Chai`
      - Ran using `Mocha` and `npm`

## Relevant documents

1. [API documentation](../worksheets/api.md)
2. [Database schema (PostgreSQL)](../worksheets/schema.md)
3. [Example of SQL statements used](../worksheets/statements.md)
4. [Code Style](../worksheets/code_style.md)

## Setting up the envs

Refer to the `.env.sample` to create a local `.env` file and set up accordingly.  
Some notes:  
1. NODE_ENV has to be set appropriately in order for test to run, so as to make sure other dbs are not accidently overwritten.
2. PG_URL has to be set to the appropriate pg db either locally or elephantsql

How the `.env` should look like:
Taken from the `.env.sample`
```
NODE_ENV=
PG_URL=
```

## How to run the code  

We assumed you have set up the `.env` file correctly.

### Running the server  

`npm start`
Runs the server using `node.js`

### Running unit test  

`npm run unit`
Runs the unit tests using Mocha

### Running integration test  

`npm run int`
Runs the integration tests using Mocha

### Running server in dev mode

`npm run dev`
Runs the server in development mode
