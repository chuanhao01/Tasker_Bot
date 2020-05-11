# SQL Statements

For this worksheet you will need to provide an example of your own SQL statement. The two given are examples.

### Template

Format of statement:  
```sql
```

Example:  
```sql
```

## For the Basic problem statement

### Bulk insert

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

## INSERT

Example:
```sql
INSERT INTO table_name (attr1, attr2,...) VALUES (value1, value2, ...);
```

## SELECT with Filtering and Pagination

Example:
```sql
SELECT * FROM table_name WHERE attr1 == value1 AND attr2 >= value2 LIMIT 10 OFFSET 20;
```
