# Schema

For our database schema, we are using 6 tables:
- 3 tables for the basic problem
- 3 tables for the advanced problem

## Database creation and ERD

The statement used to create our database.
```sql
DROP TABLE IF EXISTS PROJECTTASKSBASIC, TASKSBASIC, PROJECTSBASIC, PROJECTTASKSADVANCED, TASKSADVANCED, PROJECTSADVANCED;

CREATE TABLE IF NOT EXISTS PROJECTSBASIC(
    projectID INT UNIQUE NOT NULL,
    PRIMARY KEY(projectId)
);

CREATE TABLE IF NOT EXISTS TASKSBASIC(
    taskID INT UNIQUE NOT NULL,
    dueDate DATE NOT NULL,
    dueTime TIME NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (taskID)
);

CREATE TABLE IF NOT EXISTS PROJECTTASKSBASIC(
    projectID INT NOT NULL REFERENCES PROJECTSBASIC(projectID),
    taskID INT NOT NULL REFERENCES TASKSBASIC(taskID),
    PRIMARY KEY (projectID, taskID)
);

CREATE TABLE IF NOT EXISTS PROJECTSADVANCED(
    projectID INT UNIQUE NOT NULL,
    PRIMARY KEY(projectId)
);

CREATE TABLE IF NOT EXISTS TASKSADVANCED(
    taskID INT UNIQUE NOT NULL,
    duration INT NOT NULL,
    PRIMARY KEY (taskID)
);

CREATE TABLE IF NOT EXISTS PROJECTTASKSADVANCED(
    projectID INT NOT NULL REFERENCES PROJECTSADVANCED(projectID),
    taskID INT NOT NULL REFERENCES TASKSADVANCED(taskID),
    PRIMARY KEY (projectID, taskID)
);
```

The ERD of the database looks like this:  
![Picture of the ERD](./assets/schema-ERD.png)