# API Documentation

This document allows you to define your API schema.

Each API should include

1. HTTP Method
2. Endpoint
3. Request body/Parameters
4. Response body
5. Error Body
6. Sample Request
7. Sample Response
8. Sample Error

> Errors and it's corresponding code can be defined by yourself. You need not follow HTTP errors.

# Table of Contents
- [API Documentation](#api-documentation)
- [Table of Contents](#table-of-contents)
- [Custom Datatypes](#custom-datatypes)
- [Basic problem API endpoints](#basic-problem-api-endpoints)
  - [Basic GET data API](#basic-get-data-api)
  - [Basic Bulk Insert Data](#basic-bulk-insert-data)
  - [Basic GET Result API](#basic-get-result-api)
- [Advanced problem API endpoints](#advanced-problem-api-endpoints)
  - [Advacned Get data API](#advacned-get-data-api)
  - [Advance Bulk Insert Data](#advance-bulk-insert-data)
  - [Advanced GET Result API](#advanced-get-result-api)

# Custom Datatypes
| Datatype Name | Description | Example                    | Remarks | 
|-----------|-------------------------------------------------|----------------------------|----------|
| `TIME` | `String` with the format (HHMM) | `"2359", "0000", "1421"` | "2400" and larger times are not accepted| 
| `DATE` | `String` with the format (YYYY/MM/DD) | `"2020/01/13", "1912/12/29"` | NIL | 
| `IDENTIFIER`| 10 digit `Number` | `0, 9999999999, 123` | Decimals are not accepted (`23.1, 0.0, 1.0`). Also note that this is used as a unique identifier, duplicates will be rejected. Note the difference in the remarks when used in the APIs| 
| HOUR| `Number` of hours in 3d.p. | `3.123, 0.12, 123, 4.0` | Note the difference in the remarks when used in the APIs | 

# Basic problem API endpoints
Below will be the API endpoints related to the basic problem statement.

## Basic GET data API 

This is the API endpoint used to get the data to display on the basic data viewer front-end.
The results returned by the API will depends on the supplied optional querys.  

This endpoint will return the requested `data` with the `lastPage` number.  

| attribute   | value                |
| ----------- | -----------          |
| HTTP Method | GET                  |
| Endpoint    | /basic/data          |

As this is a GET API endpoint, no request body is expected and only optional query parameters are expected.

### Query parameters

As a brief overview, `projectId` and `duration` act as filters, with `sortBy` acting as the order for the results, `page` acting as the page number to be requested and the `pageNum` acting as the size of the page.  

| Parameter | Datatype                                          | Example                    | Optional | Default Behaviour |
|-----------|---------------------------------------------------|----------------------------|----------|-------------------|
| projectId | `IDENTIFIER`                                      | `projectId[>=]=123456789`  | Yes      | NIL               |
| duration  | `HOUR`                                            | `duration[<]=10`           | Yes      | NIL               |
| sortBy    | A `String` in the format of `attribute.order,...` | `sortBy=projectId.asc,...` | Yes      | NIL               |
| page      | Positive `Number` Integer greater than 0          | `page=10`                  | Yes      | `page=1`          |
| pageNum   | Positive `Number` Integer greater than 0          | `pageNum=5`                | Yes      | `pageNum=10`      |

### Errors

| HTTP Error Code | Error Description             | Remarks |
|-----------------|-------------------------------|---------|
| 400             | Wrong syntax for query Params | NIL     |
| 500             | Server Error/Database error   | NIL     |

### Response Body

```json
{
    "result": {
        "data": [
            {
                "projectId": IDENTIFIER,
                "taskId": IDENTIFIER,
                "dueDate": String,
                "dueTime": String,
                "duration": Number 
            },
            ...
        ],
        "lastPage": Number
    }
}
```

### Error Body

```json
{
	"error": String,
	"code": Number 
}
```

### Sample Request

```http
GET /basic/data?projectId[>]=1&duration[<=]=10&sortBy=projectId.asc,taskId.asc&page=2&pageNum=3
```

### Sample Response

```json
{
    "result": {
        "data": [
            {
                "taskId": 1234567890,
                "projectId": 1234567890,
                "dueDate": "2020/01/13",
                "dueTime": "2200",
                "duration": 1.01,
            }
        ],
        "lastPage": 2
    }
}
```

### Sample Error

```json
{
	"error": "Database Error",
	"code": 500
}
```

## Basic Bulk Insert Data

This API endpoint based on the required Bulk Insert API endpoint of the assignment.

Short desc

| attribute   | value         |
| ----------- | ------------- |
| HTTP Method | POST          |
| Endpoint    | /basic/insert |

For this request, as it is a post request, there are no optional query parameters and only a request body is expected

### Request body

| Parameter | Datatype         | Example                                         | Optional | Default Behaviour |
|-----------|------------------|-------------------------------------------------|----------|-------------------|
| data      | Array of objects | {taskId, projectId, dueDate, dueTime, duration} | No       | NIL               |

Table for insert (`data`) object  

| Parameter | Datatype    | Example    | Optional | Default Behaviour | Remarks                                               |
|-----------|-------------|------------|----------|-------------------|-------------------------------------------------------|
| taskId    | `INDENTIFIER` | 1          | No       | NIL               | Inserted IDENTIFIER can also be a string, i.e. '1'    |
| projectId | `INDENTIFIER` | 1          | No       | NIL               | Inserted IDENTIFIER can also be a string, i.e. '1'    |
| dueDate   | `DATE`        | 1980/01/01 | No       | NIL               | NIL                                                   |
| dueTime   | `TIME`        | 2211       | No       | NIL               | NIL                                                   |
| duration  | `HOURS`       | 20.1       | No       | NIL               | Inserted IDENTIFIER can also be a string, i.e. '20.1' |

### Errors

| HTTP Error Code | Error Description           | Remarks                                                                        |
|-----------------|-----------------------------|--------------------------------------------------------------------------------|
| 400             | Invalid data format         | NIL                                                                            |
| 409             | Duplicate entries           | Most likely due to duplicate `taskId` either in the request or in the database |
| 500             | Database Error/Server Error | NIL                                                                            |

### Response Body

```json
{
    "result": "success"
}
```

### Error Body

```json
{
	"error": String,
	"code": Number
}
```

### Sample Request

Sample endpoint
```http
POST /basic/insert
```

Sample request body
```json
{
    "data": [
        {
            "taskId": 1234567890,
            "projectId": 1234567890,
            "dueDate": "2020/01/13",
            "dueTime": "2200",
            "duration": 1,
        },
        {
            "taskId": 1234567891,
            "projectId": 1234567890,
            "dueDate": "2020/01/13",
            "dueTime": "2300",
            "duration": 1,
        }
    ]
}

```

### Sample Response

```json
{
    "result": "success"
}
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```

## Basic GET Result API

This is the API endpoint to get the result for the basic problem statement

| attribute   | value         |
| ----------- | -----------   |
| HTTP Method | GET           |
| Endpoint    | /basic/result |

### Query parameters

| Parameter | Datatype   | Example                   | Optional | Default Behaviour |
|-----------|------------|---------------------------|----------|-------------------|
| projectId | `IDENTIFIER` | `projectId[>=]=123456789` | No       | NIL               |
| startDate | `DATE`       | `startDate=1980/01/01`    | No       | NIL               |
| startTime | `TIME`       | `startTime=2211`          | No       | NIL               |

### Errors  

| HTTP Error Code | Error Description             | Remarks |
|-----------------|-------------------------------|---------|
| 400             | Wrong syntax for query Params | NIL     |
| 404             | ProjectId not found           | NIL     |
| 500             | Database Error/Server Error   | NIL     |

### Response Body

For the `result` attribute in the response body:  

| parameter     | datatype         | example                                                | Remarks                                                                 |
|---------------|------------------|--------------------------------------------------------|-------------------------------------------------------------------------|
| result        | Array of objects | {taskId, fromDate, fromTime, toDate, toTime, lateness} | Refer below to description of the attributes                            |
| totalLateness | `HOUR`             | 1, 0.012, 1.123, 0                                     | Calculated total minimum lateness of all the tasks given in the project |

For the attributes in the `data`:  

| Parameter    | Datatype   | Example            | Remarks                                                                                                                    |
|--------------|------------|--------------------|----------------------------------------------------------------------------------------------------------------------------|
| taskId       | `IDENTIFIER` | 1                  | Refer to POST /basic/insert or GET /basic/data for more information                                                        |
| deadlineDate | `DATE`       | 1980/01/01         | The original deadline given in task data                                                                                   |
| deadlineTime | `TIME`       | 2211               | The original deadline given in task data                                                                                   |
| fromDate     | `DATE`       | 1980/01/01         | Refer to POST /basic/insert or GET /basic/data for more information                                                        |
| fromTime     | `TIME`       | 2211               | Refer to POST /basic/insert or GET /basic/data for more information                                                        |
| toDate       | `DATE`       | 1980/01/01         | Refer to POST /basic/insert or GET /basic/data for more information                                                        |
| toTime       | `TIME`       | 2211               | Refer to POST /basic/insert or GET /basic/data for more information                                                        |
| lateness     | `HOUR`       | 1, 0.012, 1.123, 0 | Minimum number of hours of lateness (rounded to 3dp) of the tasks completion compared to the given startTime and startDate |

```json
{
    "result": [
        {
            "taskId": IDENTIFIER, 
            "fromDate": DATE,
            "fromTime": TIME, 
            "toDate": DATE,
            "toTime": TIME, 
            "lateness": HOUR
        },
        ...
    ],
    "totalLateness": HOUR
}
```

### Error body

```json
{
	"error": String,
	"code": Number
}
```

### Sample Request

```http
GET /basic/result?projectId=1234567890&startDate=2020/01/13&startTime=2130
```

### Sample Response

```json
{
    "result": [
        {
            "taskId": 1234567890, 
            "fromDate": "2020/01/13",
            "fromTime": "2130", 
            "toDate": "2020/01/13",
            "toTime": "2230",
            "lateness": 0.5
        },
        {
            "taskId": 1234567891, 
            "fromDate": "2020/01/13",
            "fromTime": "2230", 
            "toDate": "2020/01/13",
            "toTime": "2330",
            "lateness": 0.5
        }
    ],
    "totalLateness": 1
}

```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```

# Advanced problem API endpoints
Below will be the API endpoints related to the advanced problem statement.

## Advacned Get data API
This is the API endpoint used to get the data to display on the advanced data viewer front-end.
The results returned by the API will depends on the supplied optional querys.  

This endpoint will return the requested `data` with the `lastPage` number.  

| attribute   | value                |
| ----------- | -----------          |
| HTTP Method | GET                  |
| Endpoint    | /advance/data        |

As this is a GET API endpoint, no request body is expected and only optional query parameters are expected.

### Query parameters

As a breif overview, `projectId` and `duration` act as filters, with `sortBy` acting as the order for the results, `page` acting as the page number to be requested and the `pageNum` acting as the size of the page.  

| Parameter | Datatype                                          | Example                    | Optional | Default Behaviour |
|-----------|---------------------------------------------------|----------------------------|----------|-------------------|
| projectId | `IDENTIFIER`                                      | `projectId[>=]=123456789`  | Yes      | NIL               |
| duration  | `HOUR` | `duration[<]=10`           | Yes      | NIL               |
| sortBy    | A `String` in the format of `attribute.order,...` | `sortBy=projectId.asc,...` | Yes      | NIL               |
| page      | Positive `Number` Integer greater than 0          | `page=10`                  | Yes      | `page=1`          |
| pageNum   | Positive `Number` Integer greater than 0          | `pageNum=5`                | Yes      | `pageNum=10`      |

### Errors

| HTTP Error Code | Error Description             | Remarks |
|-----------------|-------------------------------|---------|
| 400             | Wrong syntax for query Params | NIL     |
| 500             | Server Error/Database error   | NIL     |

### Response Body

```json
{
    "result": {
        "data": [
            {
                "projectId": IDENTIFIER,
                "taskId": IDENTIFIER,
                "duration": HOUR
            },
            ...
        ],
        "lastPage": HOUR
    }
}
```

### Error Body

```json
{
	"error": String,
	"code": Number
}
```

### Sample Request

```http
GET /advance/data?projectId[>]=1&duration[<=]=10&sortBy=projectId.asc,taskId.asc&page=2&pageNum=3
```

### Sample Response

```json
{
    "result": {
        "data": [
            {
                "taskId": 1234567890,
                "projectId": 1234567890,
                "duration": 1,
            }
        ],
        "lastPage": 2
    }
}
```

### Sample Error

```json
{
	"error": "Database Error",
	"code": 500
}
```

## Advance Bulk Insert Data

This API endpoint based on the required Bulk Insert API endpoint of the assignment.

Short desc

| attribute   | value           |
| ----------- | --------------- |
| HTTP Method | POST            |
| Endpoint    | /advance/insert |

For this request, as it is a post request, there are no optional query parameters and only a request body is expected

### Request body

| parameter | datatype         | example                                         | Optional | Default Behaviour |
|-----------|------------------|-------------------------------------------------|----------|-------------------|
| data      | Array of objects | {taskId, projectId, duration} | No       | NIL               |

Table for insert(`data`) objects  

| Parameter | Datatype     | Example | Optional | Default Behaviour |
|-----------|--------------|---------|----------|-------------------|
| taskId    | `IDENTIFIER` | 1       | No       | NIL               |
| projectId | `IDENTIFIER` | 1       | No       | NIL               |
| duration  | `HOUR`       | 20      | No       | NIL               |

### Errors

| HTTP Error Code | Error Description           | Remarks                                                                        |
|-----------------|-----------------------------|--------------------------------------------------------------------------------|
| 400             | Invalid data format         | NIL                                                                            |
| 409             | Duplicate entries           | Most likely due to duplicate `taskId` either in the request or in the database |
| 500             | Database Error/Server Error | NIL                                                                            |

### Response Body

```json
{
    "result": "success"
}
```

### Error

```json
{
	"error": String,
	"code": Number 
}
```

### Sample Request

Sample endpoint
```http
POST /basic/insert
```

Sample body
```json
{
    "data": [
        {
            "taskId": 1234567890,
            "projectId": 1234567890,
            "duration": 1,
        },
        {
            "taskId": 1234567891,
            "projectId": 1234567890,
            "duration": 100,
        }
    ]
}

```

### Sample Response

```json
{
    "result": "success"
}
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```

## Advanced GET Result API

This is the API endpoint to get the result for the advance problem statement

| attribute   | value           |
| ----------- | -------------   |
| HTTP Method | GET             |
| Endpoint    | /advance/result |

### Query parameters

| Parameter | Datatype     | Example                   | Optional | Default Behaviour |
|-----------|--------------|---------------------------|----------|-------------------|
| projectId | `IDENTIFIER` | `projectId[>=]=123456789` | No       | NIL               |

### Errors  

| HTTP Error Code | Error Description                                              | Remarks |
|-----------------|----------------------------------------------------------------|---------|
| 400             | Wrong syntax for query Params                                  | NIL     |
| 404             | ProjectId not found                                            | NIL     |
| 500             | Database Error/Server Error/Project contains tasks with floats | NIL     |

### Response Body

For the `result` attribute in the response body:  

| parameter | datatype                           | example              | Remarks                                      |
|-----------|------------------------------------|----------------------|----------------------------------------------|
| result    | Array of 2 Arrays containing tasks | `[[task1, ...], [task2, ...]]` | Refer below to description of the attributes |

For the attributes in the each `task`:  

| Parameter | Datatype     | Example | Remarks                                                                                            |
|-----------|--------------|---------|----------------------------------------------------------------------------------------------------|
| taskId    | `IDENTIFIER` | 1       | Refer to GET /advance/data  for more information                                                   |
| projectId | `IDENTIFIER` | 1       | Refer to GET /advance/data for more information                                                    |
| duration  | `HOURS`      | 1       | Refer to GET /advance/data for more information, only project with int duration will be calculated |

```json
{
    "result": [
        [
            {
                "taskId": IDENTIFIER,
                "projectId": IDENTIFIER,
                "duration": HOURS
            },
            ...
        ],
        [
            {
                "taskId": IDENTIFIER,
                "projectId": IDENTIFIER,
                "duration": HOURS
            },
            ...
        ]
    ]
}
```

### Error body

```json
{
	"error": String,
	"code": Number
}
```

### Sample Request

```http
GET /advance/result?projectId=1234567890
```

### Sample Response

```json
{
    "result": [
        [
            {
                "projectId": 101,
                "taskId": 102,
                "duration": 3
            },
            {
                "projectId": 101,
                "taskId": 103,
                "duration": 3
            }
        ],
        [
            {
                "projectId": 101,
                "taskId": 101,
                "duration": 3
            }
        ]
    ]
}
```

### Sample Error

```json
{
    "error": "Project contain tasks with float duration",
    "code": 500
}
```