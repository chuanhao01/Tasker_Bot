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
  - [Get Data](#get-data)
    - [Parameters](#parameters)
    - [Response Body](#response-body)
    - [Error](#error)
    - [Sample Request](#sample-request)
    - [Sample Response](#sample-response)
    - [Sample Error](#sample-error)
  - [Insert Data](#insert-data)
    - [Parameters](#parameters-1)
    - [Response Body](#response-body-1)
    - [Error](#error-1)
    - [Sample Request](#sample-request-1)
    - [Sample Response](#sample-response-1)
    - [Sample Error](#sample-error-1)



## Get Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | GET         |
| Endpoint    | /basic/data |

### Parameters

| parameter | datatype        | example   |
| --------- | --------------- | --------- |
| id        | 10 digit number | 123456789 |

### Response Body

```json
{
    "result": [
        {
            "id": number,
            "property1": number,
            "property2": string,
            ...
        }
    ]
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
GET /basic/data?id=1234567890
```

### Sample Response

```json
{
    "result": [
        {
            "id": 1234567890,
            "property1": 1234567890,
            "property2": "haha",
            ...
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```

## Insert Data

| attribute   | value       |
| ----------- | ----------- |
| HTTP Method | POST        |
| Endpoint    | /basic/insert|

### Parameters

| parameter | datatype        | example   |
| --------- | --------------- | --------- |
| data        | Array of objects| {taskId, projectId, dueDate, dueTime, duration}  |

Table for insert objects  
|parameter|datatype|example|
|---|---| --- |
|taskId|10 digit number|0000000001|
|projectId| 10 digit number| 0000000001 |
|dueDate| a date in the format of yyyy-mm-dd| 1980-01-01|
|dueTime| a time in 


### Response Body

```json
{
    "result": [
        {
            "id": number,
            "property1": number,
            "property2": string,
            ...
        }
    ]
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
GET /basic/data?id=1234567890
```

### Sample Response

```json
{
    "result": [
        {
            "id": 1234567890,
            "property1": 1234567890,
            "property2": "haha",
            ...
        }
    ]
}
```

### Sample Error

```json
{
	"error": "Server Error",
	"code": 500
}
```