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

## Table of Contents
- [API Documentation](#api-documentation)
  - [Table of Contents](#table-of-contents)
  - [Basic GET data API](#basic-get-data-api)
    - [Query parameters](#query-parameters)
    - [Response Body](#response-body)
    - [Error](#error)
    - [Sample Request](#sample-request)
    - [Sample Response](#sample-response)
    - [Sample Error](#sample-error)
  - [Basic GET data API endpoint for the lastpage number](#basic-get-data-api-endpoint-for-the-lastpage-number)
    - [Query parameters](#query-parameters-1)
    - [Response Body](#response-body-1)
    - [Error](#error-1)
    - [Sample Request](#sample-request-1)
    - [Sample Response](#sample-response-1)
    - [Sample Error](#sample-error-1)
  - [Basic Bulk Insert Data](#basic-bulk-insert-data)
    - [Request body](#request-body)
    - [Response Body](#response-body-2)
    - [Error](#error-2)
    - [Sample Request](#sample-request-2)
    - [Sample Response](#sample-response-2)
    - [Sample Error](#sample-error-2)

## Basic GET data API 

This is the API endpoint used to get the data to display on the basic data viewer front-end.
The results returned by the API will depends on the supplied optional querys.  

| attribute   | value                |
| ----------- | -----------          |
| HTTP Method | GET                  |
| Endpoint    | /basic/data/lastpage |

As this is a GET API endpoint, no request body is expected and only optional query parameters are expected.

### Query parameters

As a breif overview, `projectId` and `duration` act as filters, with `sortBy` acting as the order for the results, `page` acting as the page number to be requested and the `pageNum` acting as the size of the page.  

| parameter | datatype                                        | example                    | Optional | Default Behaviour |
|-----------|-------------------------------------------------|----------------------------|----------|-------------------|
| projectId | 10 digit number                                 | `projectId[>=]=123456789`  | Yes      | NIL               |
| duration  | Positive Integer greater than 0                 | `duration[<]=10`           | Yes      | NIL               |
| sortBy    | A string in the format of `attribute.order,...` | `sortBy=projectId.asc,...` | Yes      | NIL               |
| page      | Positive Integer greater than 0                 | `page=10`                  | Yes      | `page=1`          |
| pageNum   | Positive Integer greater than 0                 | `pageNum=5`                | Yes      | `pageNum=10`      |


### Response Body

```json
{
    "result": "success"
    "data": [
        {
            "projectId": number,
            "taskId": number,
            "dueDate": string,
            "dueTime": number,
            "duration": number
        },
        ...
    ],
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /basic/data?projectId[>]=1&duration[<=]=10&sortBy=projectId.asc,taskId.asc&page=2&pageNum=3
```

### Sample Response

```json
{
    "result": "successful",
    "data": [
        {
            "taskId": 1234567890,
            "projectId": 1234567890,
            "dueDate": "2020/01/13",
            "dueTime": "2200",
            "duration": 1,
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Database Error",
	"code": 500
}
```

## Basic GET data API endpoint for the lastpage number

This is the API endpoint used in conjunction with the basic GET data endpoint for the basic data viewer.  
This endpoint will supply the number of the last page given the same optional query parameters.

| attribute   | value                |
| ----------- | -----------          |
| HTTP Method | GET                  |
| Endpoint    | /basic/data/lastpage |

As this is a GET API endpoint, no request body is expected and only optional query parameters are expected.

### Query parameters

As a breif overview, `projectId` and `duration` act as filters, with `sortBy` acting as the order for the results, `page` acting as the page number to be requested and the `pageNum` acting as the size of the page.  

| parameter | datatype                                        | example                    | Optional | Default Behaviour |
|-----------|-------------------------------------------------|----------------------------|----------|-------------------|
| projectId | 10 digit number                                 | `projectId[>=]=123456789`  | Yes      | NIL               |
| duration  | Positive Integer greater than 0                 | `duration[<]=10`           | Yes      | NIL               |
| sortBy    | A string in the format of `attribute.order,...` | `sortBy=projectId.asc,...` | Yes      | NIL               |
| page      | Positive Integer greater than 0                 | `page=10`                  | Yes      | `page=1`          |
| pageNum   | Positive Integer greater than 0                 | `pageNum=5`                | Yes      | `pageNum=10`      |

### Response Body

```json
{
    "result": "success",
    "data": {
        "lastPage": number
    }
}
```

### Error

```json
{
	"error": string,
	"code": number
}
```

### Sample Request

```http
GET /basic/data/lastpage?projectId[>]=1&duration[<=]=10&sortBy=projectId.asc,taskId.asc&page=2&pageNum=3
```

### Sample Response

```json
{
    "result": "successful",
    "data": {
        "lastPage": "1"
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

| parameter | datatype         | example                                         | Optional | Default Behaviour |
|-----------|------------------|-------------------------------------------------|----------|-------------------|
| data      | Array of objects | {taskId, projectId, dueDate, dueTime, duration} | No       | NIL               |


Table for insert objects  
| parameter | datatype                                    | example    | Optional | Default Behaviour |
|-----------|---------------------------------------------|------------|----------|-------------------|
| taskId    | 10 digit number (int)                       | 0000000001 | No       | NIL               |
| projectId | 10 digit number (int)                       | 0000000001 | No       | NIL               |
| dueDate   | a date in the format oe yyyy/mm/dd (string) | 1980/01/01 | No       | NIL               |
| dueTime   | a 24H time in the format of HHMM (string)   | 2211       | No       | NIL               |
| duration  | an integer(maximum of 10 digits) (int)      | 20         | No       | NIL               |



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
	"code": Int
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
