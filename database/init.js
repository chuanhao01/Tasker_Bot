const {Pool} = require('pg');

const pool = new Pool({
    connectionString: process.env.PG_URL,
    max: 5,
});

function cb(res){
    console.log(res);
}

const init = `
DROP TABLE IF EXISTS TEST;

CREATE TABLE IF NOT EXISTS TEST(
    testAtt VARCHAR(100) NOT NULL,
    PRIMARY KEY (testAtt)
);
`;

const seed = `
INSERT INTO TEST(testAtt)
VALUES
    ($1),
    ($2)`;

const get = `
SELECT * FROM TEST`;


pool.query(init)
.then(
    function(res){
        console.log(res);
        return pool.query(seed, ['abc', 'abcde']);
    }
)
.then(
    function(res){
        console.log(res);
        return pool.query(get);
    }
)
.then(
    function(res){
        console.log(res);
    }
);



