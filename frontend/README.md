# Frontend

## Components / Requirements

1. Basic/Advance Data viewer
    1. Pagination
        1. First page
        2. Next page
        3. Page size
    2. Filtering
        1. duration
        2. projectId
    3. pageNum ( number of records in a page )
2. Basic Result viewer
    1. Input fields for 3 computation parameters
        - projectId
        - startDate
        - startTime
    2. Graphical view of duration taken to complete tasks
    3. Graphical view of lateness of tasks
3. Advance Result viewer
    1. Input fields for 1 computation paramter
        - projectId
    2. Graphical view of distribution of tasks by member

___

## Notes

-   Problem: Task Allocation
-   Libraries required:
    - `Cypress`
- Relevant documents
    - [Code style](../worksheets/code_style.md)
    - Wireframes
        - [Basic data viewer Wireframe](../worksheets/wireframes/basic_frontend_data_viewer.md)
        - [Advance data viewer Wireframe](../worksheets/wireframes/advance_frontend_data_viewer.md)
        - [Basic result viewer Wireframe](../worksheets/wireframes/basic_frontend_result_viewer.md)
        - [Advance result viewer Wireframe](../worksheets/wireframes/advance_frontend_result_viewer.md)

___

## How to run the codes

### Webpage (index.html)

1. `cd frontend/files` (workspaceFolder == fsp-jibaboom-2a11-team_name)
2. `npm start`

### Cypress automated tests (cypress_mock.js / cypress_acceptance.js)

1. `cd frontend`
2. CLI
    - Integration testing : `npm run cy_int_test`
    - Acceptance testing  : `npm run cy_acc_test`
3. GUI
    - npm run cy_start
        * Integration testing : Select `cypress_mock.js`
        * Acceptance testing  : Select `cypress_acceptance.js`