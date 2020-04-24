const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

const init = `
DROP TABLE IF EXISTS TASKSWITHOUTDEADLINE, TASKS, PROJECTTYPES, PROJECTS;

CREATE TABLE IF NOT EXISTS PROJECTS(
    projectID SERIAL,
    projectUID VARCHAR(100) NOT NULL,
    PRIMARY KEY(projectUID)
);

CREATE TABLE IF NOT EXISTS PROJECTTYPES(
    projectUID VARCHAR(100) NOT NULL REFERENCES PROJECTS(projectUID) ON DELETE CASCADE,
    taskID SERIAL,
    taskType SMALLINT NOT NULL,
    taskUID VARCHAR(100) NOT NULL,
    PRIMARY KEY(projectUID, taskUID)
);

CREATE TABLE IF NOT EXISTS TASKS(
    taskUID VARCHAR(100) NOT NULL REFERENCES PROJECTTYPES(taskUID) ON DELETE CASCADE,
    dueDate DATE NOT NULL,
    dueTime TIME(HHMM) NOT NULL,
    duration INTEGER NOT NULL,
    PRIMARY KEY(taskUID)
);

CREATE TABLE IF NOT EXISTS TASKSWITHOUTDEADLINE(
    taskUID VARCHAR(100) NOT NULL REFERENCES PROJECTTYPES(taskUID) ON DELETE CASCADE,
    duration INTEGER NOT NULL,
    PRIMARY KEY(taskUID)
);

`;

