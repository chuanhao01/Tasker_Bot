# Backend

## Requirements

1. Basic/Advanced Insert API
2. Basic/Advanced Query API

## Notes

-   Refer to individual problem statements for the API schema.
-   You are allowed to create other APIs to support the operations of other components.
-   You are to connect to PostgreSql

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

### Running the server  
Assumming you have set up the `.env` file correctly, you can start the server using `npm start`.  

### Running unit test  
Again if you have set up the `.env` file correctly, you can run the unit test with `npm run unit`.
