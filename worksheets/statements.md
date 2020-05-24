# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

## For the Basic problem statement


### Bulk insert

This the sql statement used as part of the bulk insert API requirements.  

Format of statement:  
```sql
INSERT INTO TASKSBASIC
(taskId, projectId, dueDate, dueTime, duration)
VALUES
${query_params}
```

Example:  
```sql
INSERT INTO TASKSBASIC
(taskId, projectId, dueDate, dueTime, duration)
VALUES
(11, 11, '1998-02-01', '13:07:00', 2),
(21, 11, '1998-02-02', '01:32:00', 22)
```

### To get data for the basic data viewer

This is the SQL statement used for retriving data from the db to be shown on the data viewer.  
Comes with optional `queryConditions` that are used to filter, sort and limit results.  
Example use case: `GET /basic/data/` API  

Format of statement:  
```sql
SELECT * FROM TASKSBASIC
${queryConditions}
```

Example:  
```sql
SELECT * FROM TASKSBASIC
WHERE 
projectId > 1 
AND 
duration <= 10 
ORDER BY 
projectId asc, taskId asc
LIMIT 5 OFFSET 20
```