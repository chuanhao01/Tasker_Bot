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