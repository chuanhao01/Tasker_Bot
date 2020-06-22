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
  - [Basic Bulk Insert Data](#basic-bulk-insert-data)
    - [Request body](#request-body)
    - [Response Body](#response-body-1)
    - [Error](#error-1)
    - [Sample Request](#sample-request-1)
    - [Sample Response](#sample-response-1)
    - [Sample Error](#sample-error-1)
  - [Basic GET Result API](#basic-get-result-api)
- [Note need to rmb to check this after update from tcher](#note-need-to-rmb-to-check-this-after-update-from-tcher)
    - [Query parameters](#query-parameters-1)
    - [Response Body](#response-body-2)
    - [Error](#error-2)
    - [Sample Request](#sample-request-2)
    - [Sample Response](#sample-response-2)
    - [Sample Error](#sample-error-2)

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
    "result": {
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

## Basic GET Result API

# Note need to rmb to check this after update from tcher

This is the API endpoint to get the result for the basic problem statement

| attribute   | value         |
| ----------- | -----------   |
| HTTP Method | GET           |
| Endpoint    | /basic/result |

### Query parameters

| parameter | datatype                                        | example                    | Optional | Default Behaviour |
|-----------|-------------------------------------------------|----------------------------|----------|-------------------|
| projectId | 10 digit number                                 | `projectId[>=]=123456789`  | No | NIL               |
| startDate | a date in the format oe yyyy/mm/dd (string) | 1980/01/01 | No       | NIL               |
| startTime | a 24H time in the format of HHMM (string)   | 2211       | No       | NIL               |

### Response Body

For the `result` attribute in the response body:  

| parameter | datatype         | example                                         | Remarks |
|-----------|------------------|-------------------------------------------------|----------|
| data      | Array of objects | {taskId, projectId, dueDate, dueTime, duration, lateness} | ADD SOMETHING HERE|
| totalLateness | Number | 1 |   |

```json
{
    "result": {
        "data": [
            {
                "taskId": IDENTIFIER, 
                "fromDate": DATE,
                "fromTime": TIME, 
                "toDate": DATE,
                "toTime": TIME, 
                "lateness": number
            },
            ...
        ],
        "totalLateness": number
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
GET /basic/result?projectId=1234567890&startDate=2020/01/13&startTime=2130
```

### Sample Response

```json
{
    "result": {
        "data": [
            {
                "lectureId": 1234567890, 
                "fromDate": "2020/01/13",
                "fromTime": "2130", 
                "toDate": "2020/01/13",
                "toTime": "2230",
                "lateness": 0.5
            },
            {
                "lectureId": 1234567891, 
                "fromDate": "2020/01/13",
                "fromTime": "2230", 
                "toDate": "2020/01/13",
                "toTime": "2330",
                "lateness": 0.5
            }
        ],
        "totalLateness": 1
    }
}

```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```