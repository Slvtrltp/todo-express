CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  password VARCHAR(100) NOT NULL,
  gender VARCHAR(1) NOT NULL DEFAULT 'M',
  bio TEXT
)

DROP TABLE users 


CREATE TABLE users (id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(100) NOT NULL,
    gender VARCHAR(1) NOT NULL DEFAULT 'M',
    age INT CHECK (age >= 0 AND age <= 120),
    bio TEXT)


INSERT INTO users (username, password, gender, age, bio)
SELECT 
    -- Generates a realistic username like 'john_doe_82'
    lower(first_names[floor(random() * 20 + 1)] || '_' || last_names[floor(random() * 20 + 1)] || '_' || floor(random() * 99 + 1)) AS username,
    
    -- Simulation of a hashed password
    '$2b$12$' || md5(random()::text) AS password,
    
    -- Pick a gender
    genders[floor(random() * 2 + 1)] AS gender,
    
    -- Age between 18 and 65
    floor(random() * (65 - 18 + 1) + 18)::int AS age,
    
    -- Pick a realistic bio snippet
    bios[floor(random() * 10 + 1)] AS bio
FROM 
    generate_series(1, 100) AS seq,
    (SELECT ARRAY['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'] AS first_names) AS fn,
    (SELECT ARRAY['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'] AS last_names) AS ln,
    (SELECT ARRAY['M', 'F'] AS genders) AS g,
    (SELECT ARRAY[
        'Avid traveler and foodie.', 
        'Software engineer loving open source.', 
        'Coffee addict. Design enthusiast.', 
        'Just here for the memes.', 
        'Living life one day at a time.', 
        'Photography is my passion.', 
        'Fitness junkie and marathon runner.', 
        'Always learning something new.', 
        'Professional napper.', 
        'I like big data and I cannot lie.'
    ] AS bios) AS b;

{
-- Дасгал №1(Өгөгдөл харах)
SELECT username, age from users; -- username болон age//
SELECT * from users where age>50 --Нас нь 50-аас дээш бүх хэрэглэгчид
SELECT username, age from users  where age>50 --Нас нь 50-аас дээш бүх хэрэглэгчид
SELECT * from users where username LIKE '%smith%'  --Хэрэглэгчийн нэр дотор (username) 'smith' гэдэг үг орсон
SELECT * from users where age>20 and age<30 and gender='F' --20-оос 30 насны хооронд байгаа эмэгтэй (F) хэрэглэгчид
SELECT * FROM users ORDER BY age DESC LIMIT 10; --амгийн өндөр настай 10 хэрэглэгчийг насны дарааллаар (ихээс бага руу) жагсаах
-- Дасгал №2(Өгөгдөл шинэчлэх)
UPDATE users set bio='Би мэдээллийн санд дуртай' where id=5 => select * from users where id=5
UPDATE users SET age=age+1 
UPDATE users SET bio = 'Null' WHERE bio IS NULL;
-- Дасгал №3(Өгөгдөл устгах)
DELETE from users WHERE id=10
DELETE from users WHERE age<18
--бүгд устах аюултай
-- Дасгал №4(Өгөгдөл нэмэх)
INSERT INTO users (username, password, gender, age, bio) VALUES ('sql_master', 'password123', 'M', 25, 'SQL бол хүч чадал')
INSERT INTO users (username, password) VALUES ('nmi', 'nmi123') default-оор эрэгтэй болж байна.
}















CREATE TABLE bank_transactions (
    transaction_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    transaction_type VARCHAR(10) CHECK (transaction_type IN ('deposit', 'withdraw')),
    amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
    balance NUMERIC(15, 2) NOT NULL,
    description TEXT
);
INSERT INTO bank_transactions (user_id, transaction_date, transaction_type, amount, balance, description)
WITH raw_data AS (
    SELECT 
        101 AS user_id, 
        NOW() - (interval '1 minute' * seq) AS t_date, 
        CASE WHEN random() > 0.4 THEN 'deposit' ELSE 'withdraw' END AS t_type,
        (random() * 500 + 10)::NUMERIC(15, 2) AS t_amount, -- 10-аас 510-ын хооронд санамсаргүй дүн
        'Automated transaction #' || seq AS t_desc
    FROM generate_series(1, 1000) AS seq
),
calculated_data AS (
    -- 2. Window Function ашиглаж үлдэгдлийг (balance) хуримтлуулж тооцно
    SELECT 
        user_id,
        t_date,
        t_type,
        t_amount,
        SUM(CASE WHEN t_type = 'deposit' THEN t_amount ELSE -t_amount END) 
            OVER (ORDER BY t_date ASC) AS rolling_balance,
        t_desc
    FROM raw_data
)
-- 3. Эцсийн үр дүнг хүснэгтэд оруулна
SELECT user_id, t_date, t_type, t_amount, rolling_balance, t_desc
FROM calculated_data
ORDER BY t_date ASC;

select min(amount) from bank_transactions 

select max(amount) from bank_transactions 

select transaction_type from bank_transactions where user_id=101

SELECT SUM(amount) AS total_deposits
FROM bank_transactions
WHERE user_id = 101 AND transaction_type = 'deposit';

SELECT *
FROM bank_transactions
ORDER BY transaction_type = 'withdraw' DESC LIMIT 5;

select count(*) from bank_transactions where description='ATM withdrawal'

SELECT
           COUNT(*) AS transaction_count, 
           SUM(amount) AS total_spent
    FROM bank_transactions
    where description='ATM withdrawal' ;

