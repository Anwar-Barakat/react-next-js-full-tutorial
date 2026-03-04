# SQL Deep Dive for Technical Interviews

A comprehensive guide to SQL covering fundamentals, joins, aggregation, window functions, optimization, and common interview questions with solutions.

---

## Table of Contents

### SQL Fundamentals
1. [What is SQL and Why It Matters](#1-what-is-sql-and-why-it-matters)
2. [Basic SQL Operations (CRUD)](#2-basic-sql-operations-crud)
3. [Filtering and Sorting](#3-filtering-and-sorting)

### Joins
4. [Understanding JOINs](#4-understanding-joins)
5. [INNER JOIN](#5-inner-join)
6. [LEFT JOIN and RIGHT JOIN](#6-left-join-and-right-join)
7. [FULL OUTER JOIN, CROSS JOIN, and SELF JOIN](#7-full-outer-join-cross-join-and-self-join)

### Aggregation
8. [Aggregate Functions](#8-aggregate-functions)
9. [GROUP BY and HAVING](#9-group-by-and-having)

### Advanced Queries
10. [Subqueries and Nested Queries](#10-subqueries-and-nested-queries)
11. [Common Table Expressions (CTEs)](#11-common-table-expressions-ctes)
12. [UNION, INTERSECT, and EXCEPT](#12-union-intersect-and-except)

### Window Functions
13. [What are Window Functions?](#13-what-are-window-functions)
14. [ROW_NUMBER, RANK, and DENSE_RANK](#14-row_number-rank-and-dense_rank)
15. [LEAD, LAG, and Other Window Functions](#15-lead-lag-and-other-window-functions)

### Optimization & Database Theory
16. [Indexes and Query Optimization](#16-indexes-and-query-optimization)
17. [EXPLAIN and Query Analysis](#17-explain-and-query-analysis)
18. [Transactions and Isolation Levels](#18-transactions-and-isolation-levels)
19. [Normalization (1NF, 2NF, 3NF, BCNF)](#19-normalization-1nf-2nf-3nf-bcnf)

### Practical & Interview
20. [MySQL vs PostgreSQL Differences](#20-mysql-vs-postgresql-differences)
21. [Common SQL Interview Questions with Solutions](#21-common-sql-interview-questions-with-solutions)

---

## Schema Used Throughout This Guide

Before we begin, here is the schema we will use consistently across all examples. This makes it easy to follow along and practice.

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department_id INT,
    salary DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL
);

-- Orders table
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100)
);

-- Employees table (for self-join and hierarchy examples)
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    manager_id INT,
    salary DECIMAL(10, 2),
    department_id INT,
    FOREIGN KEY (manager_id) REFERENCES employees(id),
    FOREIGN KEY (department_id) REFERENCES departments(id)
);
```

> For how Laravel interacts with databases using Eloquent ORM, see [Database Guide](../backend/06_database.md)

---

## SQL Fundamentals

---

## 1. What is SQL and Why It Matters

**SQL** stands for **Structured Query Language**. It is the standard language used to communicate with **relational databases** -- databases that store data in tables with rows and columns, where tables can relate to each other through keys.

SQL is asked about in virtually every technical interview, whether you are applying for a frontend, backend, or full-stack role. Why? Because almost every application stores data, and understanding how to retrieve, manipulate, and optimize that data is a core skill.

> Think of SQL as the universal language for talking to databases. Just like you use English to talk to people, you use SQL to talk to your data.

**Why SQL matters in interviews:**
- It tests your ability to think logically and work with structured data
- It reveals whether you understand data relationships
- It shows if you can write efficient queries (not just queries that work)
- Nearly every real-world application uses a relational database at some level

**SQL command types** fall into four major categories:

| Category | Full Name | Purpose | Key Commands |
|----------|-----------|---------|-------------|
| **DDL** | Data Definition Language | Define and modify database structure | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| **DML** | Data Manipulation Language | Query and modify data within tables | `SELECT`, `INSERT`, `UPDATE`, `DELETE` |
| **DCL** | Data Control Language | Control access and permissions | `GRANT`, `REVOKE` |
| **TCL** | Transaction Control Language | Manage transactions | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

**DDL** is about the structure: creating tables, altering columns, dropping entire tables. **DML** is what you use day-to-day: selecting data, inserting records, updating values, deleting rows. **DCL** handles who can do what: granting permissions to users, revoking access. **TCL** ensures your operations are atomic and safe: wrapping multiple statements in a transaction so they either all succeed or all fail.

**In short:** SQL is the universal language for relational databases. It is divided into DDL (structure), DML (data), DCL (permissions), and TCL (transactions). Master all four categories to feel confident in any interview.

---

## 2. Basic SQL Operations (CRUD)

CRUD stands for **Create, Read, Update, Delete** -- the four fundamental operations you can perform on data. In SQL, these map to `INSERT`, `SELECT`, `UPDATE`, and `DELETE`.

### SELECT -- Reading Data

The most common SQL operation. You will write SELECT statements more than anything else.

```sql
-- Select all columns from users
SELECT * FROM users;

-- Select specific columns
SELECT name, email, salary FROM users;

-- Select with an alias
SELECT name AS full_name, salary AS monthly_pay FROM users;
```

### INSERT INTO -- Creating Data

```sql
-- Insert a single user
INSERT INTO users (name, email, department_id, salary)
VALUES ('Ahmed Ali', 'ahmed@example.com', 1, 5000.00);

-- Insert multiple users at once
INSERT INTO users (name, email, department_id, salary)
VALUES
    ('Sara Hassan', 'sara@example.com', 2, 6000.00),
    ('Omar Khaled', 'omar@example.com', 1, 5500.00),
    ('Layla Ibrahim', 'layla@example.com', 3, 7000.00);
```

### UPDATE -- Modifying Data

```sql
-- Update a specific user's salary
UPDATE users
SET salary = 6500.00
WHERE id = 1;

-- Update multiple columns
UPDATE users
SET salary = 7000.00, department_id = 2
WHERE email = 'ahmed@example.com';

-- CAUTION: Without WHERE, all rows are updated!
UPDATE users SET salary = 0; -- This updates EVERY user!
```

### DELETE -- Removing Data

```sql
-- Delete a specific user
DELETE FROM users WHERE id = 5;

-- Delete users with no orders (using a subquery)
DELETE FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);

-- CAUTION: Without WHERE, all rows are deleted!
DELETE FROM users; -- This deletes EVERY user!
```

### DELETE vs TRUNCATE vs DROP

This is a classic interview question. These three commands all remove data, but they work very differently.

| Feature | DELETE | TRUNCATE | DROP |
|---------|--------|----------|------|
| **What it removes** | Specific rows (with WHERE) or all rows | All rows | Entire table (structure + data) |
| **Can use WHERE?** | Yes | No | No |
| **Can be rolled back?** | Yes (if in a transaction) | Depends on DB (MySQL: No, PostgreSQL: Yes) | No |
| **Resets AUTO_INCREMENT?** | No | Yes | N/A (table is gone) |
| **Speed** | Slower (row by row) | Faster (deallocates pages) | Fastest (drops everything) |
| **Triggers fired?** | Yes | No | No |
| **Logs** | Logs each row deletion | Minimal logging | Minimal logging |

```sql
-- DELETE: removes rows, can be selective
DELETE FROM orders WHERE status = 'cancelled';

-- TRUNCATE: removes ALL rows, resets auto-increment
TRUNCATE TABLE orders;

-- DROP: removes the entire table
DROP TABLE orders;
```

**In short:** Use `DELETE` when you need to remove specific rows and want the operation to be logged and reversible. Use `TRUNCATE` when you want to quickly empty a table. Use `DROP` when you want to completely remove a table from the database.

---

## 3. Filtering and Sorting

Filtering and sorting are how you narrow down your results and present them in a meaningful order. The `WHERE` clause is your primary filtering tool, and `ORDER BY` handles sorting.

### WHERE Clause Operators

```sql
-- Equal to
SELECT * FROM users WHERE department_id = 1;

-- Not equal to
SELECT * FROM users WHERE department_id != 1;
-- Also valid: WHERE department_id <> 1

-- Greater than / Less than
SELECT * FROM users WHERE salary > 5000;
SELECT * FROM users WHERE salary < 8000;

-- Greater than or equal / Less than or equal
SELECT * FROM users WHERE salary >= 5000;
SELECT * FROM users WHERE salary <= 8000;

-- BETWEEN: inclusive range
SELECT * FROM users WHERE salary BETWEEN 5000 AND 8000;
-- Equivalent to: WHERE salary >= 5000 AND salary <= 8000

-- IN: match any value in a list
SELECT * FROM users WHERE department_id IN (1, 2, 3);

-- LIKE: pattern matching
SELECT * FROM users WHERE name LIKE 'A%';      -- starts with A
SELECT * FROM users WHERE name LIKE '%ali%';    -- contains "ali"
SELECT * FROM users WHERE email LIKE '%@gmail.com'; -- ends with @gmail.com
SELECT * FROM users WHERE name LIKE '_a%';      -- second character is "a"

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE department_id IS NULL;
SELECT * FROM users WHERE department_id IS NOT NULL;
```

**Important:** You cannot use `= NULL` or `!= NULL`. NULL is not a value -- it represents the absence of a value. You must use `IS NULL` or `IS NOT NULL`.

### Combining Conditions with AND, OR, NOT

```sql
-- AND: both conditions must be true
SELECT * FROM users
WHERE department_id = 1 AND salary > 5000;

-- OR: at least one condition must be true
SELECT * FROM users
WHERE department_id = 1 OR department_id = 2;

-- NOT: negates a condition
SELECT * FROM users
WHERE NOT department_id = 1;

-- Combining with parentheses for clarity
SELECT * FROM users
WHERE (department_id = 1 OR department_id = 2)
  AND salary > 5000;
```

### ORDER BY -- Sorting Results

```sql
-- Sort by salary ascending (default)
SELECT * FROM users ORDER BY salary;
SELECT * FROM users ORDER BY salary ASC;

-- Sort by salary descending
SELECT * FROM users ORDER BY salary DESC;

-- Sort by multiple columns
SELECT * FROM users
ORDER BY department_id ASC, salary DESC;
-- First sorts by department, then within each department, by salary (highest first)
```

### LIMIT and OFFSET -- Pagination

```sql
-- Get the first 10 users
SELECT * FROM users LIMIT 10;

-- Get users 11-20 (skip first 10, then take 10)
SELECT * FROM users LIMIT 10 OFFSET 10;

-- Shorthand syntax (MySQL)
SELECT * FROM users LIMIT 10, 10; -- LIMIT offset, count

-- Get the top 5 highest-paid users
SELECT * FROM users
ORDER BY salary DESC
LIMIT 5;
```

### DISTINCT -- Removing Duplicates

```sql
-- Get unique department IDs
SELECT DISTINCT department_id FROM users;

-- Get unique combinations of department and status
SELECT DISTINCT department_id, status FROM orders
JOIN users ON orders.user_id = users.id;

-- Count distinct values
SELECT COUNT(DISTINCT department_id) AS unique_departments FROM users;
```

**In short:** `WHERE` filters rows before they are returned, using operators like `=`, `BETWEEN`, `IN`, `LIKE`, and `IS NULL`. `ORDER BY` sorts results. `LIMIT` and `OFFSET` handle pagination. `DISTINCT` removes duplicates. These are the building blocks you will use in every single query.

---

## Joins

---

## 4. Understanding JOINs

A **JOIN** combines rows from two or more tables based on a related column between them. This is one of the most important concepts in SQL because real-world data is spread across multiple tables.

> Think of JOIN like matching students to their classes. You have a list of students and a list of classes. The JOIN says: "For each student, find their class by matching the class_id." Without JOINs, your data would be isolated in separate tables with no way to connect it.

Here is a text diagram showing how JOINs work conceptually:

```
TABLE: users                    TABLE: orders
+----+--------+               +----+---------+--------+
| id | name   |               | id | user_id | amount |
+----+--------+               +----+---------+--------+
| 1  | Ahmed  |               | 1  | 1       | 100.00 |
| 2  | Sara   |               | 2  | 1       | 250.00 |
| 3  | Omar   |               | 3  | 2       | 75.00  |
| 4  | Layla  |               | 4  | 5       | 300.00 |
+----+--------+               +----+---------+--------+

INNER JOIN (users.id = orders.user_id):
Only rows where BOTH tables have a match.

+--------+---------+--------+
| name   | user_id | amount |
+--------+---------+--------+
| Ahmed  | 1       | 100.00 |
| Ahmed  | 1       | 250.00 |
| Sara   | 2       | 75.00  |
+--------+---------+--------+

Notice: Omar (no orders) and order #4 (user_id=5, no such user) are excluded.
```

**The key concept:** JOINs match rows from one table to rows in another table using a condition (usually a foreign key relationship). The type of JOIN determines what happens when there is no match.

---

## 5. INNER JOIN

**INNER JOIN** returns only the rows where there is a match in **both** tables. If a row in the left table has no corresponding row in the right table, it is excluded. If a row in the right table has no corresponding row in the left table, it is also excluded.

> Think of INNER JOIN as the intersection of two sets. Only the data that exists in both tables makes it through.

```sql
-- Get all users who have placed orders, along with their order details
SELECT
    users.name,
    users.email,
    orders.id AS order_id,
    orders.amount,
    orders.status
FROM users
INNER JOIN orders ON users.id = orders.user_id;
```

This query returns only users who have at least one order. Users with no orders are silently excluded.

### Using Table Aliases

Table aliases make your queries shorter and more readable, especially with multiple JOINs.

```sql
-- Same query with aliases
SELECT
    u.name,
    u.email,
    o.id AS order_id,
    o.amount,
    o.status
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

### Joining Multiple Tables

```sql
-- Get user name, order amount, and product name for each order
SELECT
    u.name AS customer_name,
    p.name AS product_name,
    p.price,
    o.amount,
    o.status,
    o.created_at AS order_date
FROM users u
INNER JOIN orders o ON u.id = o.user_id
INNER JOIN products p ON o.product_id = p.id;
```

### INNER JOIN with Conditions

```sql
-- Get only completed orders with user details
SELECT
    u.name,
    o.id AS order_id,
    o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
ORDER BY o.amount DESC;
```

**In short:** INNER JOIN is the most common JOIN type. It returns only rows with matches in both tables. Use it when you want data that definitively exists on both sides of the relationship.

---

## 6. LEFT JOIN and RIGHT JOIN

### LEFT JOIN (LEFT OUTER JOIN)

**LEFT JOIN** returns **all rows from the left table** and the matching rows from the right table. If there is no match in the right table, the result contains NULL for the right table's columns.

```sql
-- Get ALL users, whether they have orders or not
SELECT
    u.name,
    u.email,
    o.id AS order_id,
    o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

**Result:**

```
+--------+-------------------+----------+--------+
| name   | email             | order_id | amount |
+--------+-------------------+----------+--------+
| Ahmed  | ahmed@example.com | 1        | 100.00 |
| Ahmed  | ahmed@example.com | 2        | 250.00 |
| Sara   | sara@example.com  | 3        | 75.00  |
| Omar   | omar@example.com  | NULL     | NULL   |
| Layla  | layla@example.com | NULL     | NULL   |
+--------+-------------------+----------+--------+
```

Notice how Omar and Layla appear even though they have no orders. Their order columns are NULL.

### Finding Rows with No Match

A very common interview pattern: "Find all users who have never placed an order."

```sql
-- Users who have never ordered
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

This works because LEFT JOIN puts NULL in the right table's columns when there is no match. By filtering for `WHERE o.id IS NULL`, you get only the unmatched rows.

### RIGHT JOIN (RIGHT OUTER JOIN)

**RIGHT JOIN** is the mirror of LEFT JOIN. It returns **all rows from the right table** and matching rows from the left table.

```sql
-- Get ALL orders, even if the user was deleted
SELECT
    u.name,
    o.id AS order_id,
    o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

In practice, **RIGHT JOIN is rarely used**. You can always rewrite a RIGHT JOIN as a LEFT JOIN by swapping the table order. Most developers prefer LEFT JOIN for consistency and readability.

```sql
-- This RIGHT JOIN:
SELECT * FROM users u RIGHT JOIN orders o ON u.id = o.user_id;

-- Is equivalent to this LEFT JOIN:
SELECT * FROM orders o LEFT JOIN users u ON u.id = o.user_id;
```

### Practical Example: User Report with Order Count

```sql
-- Get each user with their total number of orders and total spending
SELECT
    u.name,
    u.email,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_spent DESC;
```

We use LEFT JOIN here so that users with zero orders still appear (with 0 orders and 0 spent). `COALESCE` replaces NULL with 0 for users who have no orders.

**In short:** LEFT JOIN keeps all rows from the left table and fills NULLs for non-matching right table rows. RIGHT JOIN does the opposite. Use LEFT JOIN with `WHERE right_table.id IS NULL` to find rows with no match -- this is a very common interview pattern.

---

## 7. FULL OUTER JOIN, CROSS JOIN, and SELF JOIN

### FULL OUTER JOIN

**FULL OUTER JOIN** returns **all rows from both tables**. Where there is a match, columns are filled in from both sides. Where there is no match, the missing side gets NULLs.

```sql
-- Get all users and all orders, matched where possible
SELECT
    u.name,
    o.id AS order_id,
    o.amount
FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

**Result:**

```
+--------+----------+--------+
| name   | order_id | amount |
+--------+----------+--------+
| Ahmed  | 1        | 100.00 |
| Ahmed  | 2        | 250.00 |
| Sara   | 3        | 75.00  |
| Omar   | NULL     | NULL   |   -- user with no orders
| Layla  | NULL     | NULL   |   -- user with no orders
| NULL   | 4        | 300.00 |   -- order with no valid user
+--------+----------+--------+
```

**Note:** MySQL does not support FULL OUTER JOIN directly. You can simulate it using a UNION of LEFT JOIN and RIGHT JOIN:

```sql
-- Simulating FULL OUTER JOIN in MySQL
SELECT u.name, o.id AS order_id, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id

UNION

SELECT u.name, o.id AS order_id, o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

### CROSS JOIN

**CROSS JOIN** produces a **cartesian product** -- every row from the first table is combined with every row from the second table. If table A has 4 rows and table B has 3 rows, the result has 4 x 3 = 12 rows.

```sql
-- Generate all possible user-product combinations
SELECT
    u.name AS customer,
    p.name AS product,
    p.price
FROM users u
CROSS JOIN products p;
```

Cross joins are rarely used in practice, but they are useful for:
- Generating all possible combinations (e.g., sizes x colors)
- Creating test data
- Pairing every item in one set with every item in another set

```sql
-- Practical example: Generate a report template for every user and every month
SELECT
    u.name,
    m.month_name
FROM users u
CROSS JOIN (
    SELECT 'January' AS month_name UNION ALL
    SELECT 'February' UNION ALL
    SELECT 'March' UNION ALL
    SELECT 'April'
) m;
```

### SELF JOIN

A **SELF JOIN** is when a table is joined with itself. This is commonly used for hierarchical data, like an employee-manager relationship.

```sql
-- Find each employee and their manager's name
SELECT
    e.name AS employee_name,
    e.salary AS employee_salary,
    m.name AS manager_name,
    m.salary AS manager_salary
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;
```

**Result:**

```
+----------------+-----------------+--------------+----------------+
| employee_name  | employee_salary | manager_name | manager_salary |
+----------------+-----------------+--------------+----------------+
| John (CEO)     | 15000.00        | NULL         | NULL           |
| Sarah (VP)     | 12000.00        | John (CEO)   | 15000.00       |
| Mike (Manager) | 9000.00         | Sarah (VP)   | 12000.00       |
| Lisa (Dev)     | 7000.00         | Mike (Mgr)   | 9000.00        |
| Tom (Dev)      | 6500.00         | Mike (Mgr)   | 9000.00        |
+----------------+-----------------+--------------+----------------+
```

We use LEFT JOIN so the CEO (who has no manager, `manager_id IS NULL`) still appears.

```sql
-- Find employees who earn more than their manager
SELECT
    e.name AS employee_name,
    e.salary AS employee_salary,
    m.name AS manager_name,
    m.salary AS manager_salary
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

### JOIN Types Summary Table

| JOIN Type | Returns | Common Use Case |
|-----------|---------|----------------|
| **INNER JOIN** | Only matching rows from both tables | Get orders with user details |
| **LEFT JOIN** | All from left + matching from right (NULLs for no match) | Find users with or without orders |
| **RIGHT JOIN** | All from right + matching from left (NULLs for no match) | Rarely used; rewrite as LEFT JOIN |
| **FULL OUTER JOIN** | All from both tables (NULLs where no match) | Reconciling two datasets |
| **CROSS JOIN** | Cartesian product (every combo) | Generate all combinations |
| **SELF JOIN** | Table joined to itself | Employee-manager hierarchies |

**In short:** FULL OUTER JOIN returns everything from both tables. CROSS JOIN creates all possible combinations (cartesian product). SELF JOIN connects a table to itself, which is essential for hierarchical data like org charts. Know all six JOIN types and when to use each one.

---

## Aggregation

---

## 8. Aggregate Functions

**Aggregate functions** perform calculations across a set of rows and return a single value. They are the foundation of reporting and analytics queries.

### COUNT

`COUNT` counts the number of rows. There is an important difference between `COUNT(*)` and `COUNT(column)`.

```sql
-- COUNT(*) counts ALL rows, including rows with NULLs
SELECT COUNT(*) AS total_users FROM users;

-- COUNT(column) counts only NON-NULL values in that column
SELECT COUNT(department_id) AS users_with_department FROM users;

-- COUNT(DISTINCT column) counts unique non-null values
SELECT COUNT(DISTINCT department_id) AS unique_departments FROM users;
```

**Example with data:**

```
users table:
+----+-------+---------------+
| id | name  | department_id |
+----+-------+---------------+
| 1  | Ahmed | 1             |
| 2  | Sara  | 2             |
| 3  | Omar  | NULL          |
| 4  | Layla | 1             |
+----+-------+---------------+

SELECT COUNT(*) FROM users;                    -- Result: 4
SELECT COUNT(department_id) FROM users;        -- Result: 3 (NULL excluded)
SELECT COUNT(DISTINCT department_id) FROM users; -- Result: 2 (only 1 and 2)
```

### SUM

`SUM` adds up all values in a column. It **ignores NULL values**.

```sql
-- Total revenue from all orders
SELECT SUM(amount) AS total_revenue FROM orders;

-- Total revenue from completed orders only
SELECT SUM(amount) AS completed_revenue
FROM orders
WHERE status = 'completed';

-- SUM with NULL: if ALL values are NULL, SUM returns NULL (not 0)
SELECT COALESCE(SUM(amount), 0) AS safe_total FROM orders WHERE 1 = 0;
```

### AVG

`AVG` calculates the average. Like SUM, it **ignores NULL values**, which can lead to surprising results.

```sql
-- Average salary
SELECT AVG(salary) AS avg_salary FROM users;

-- IMPORTANT: AVG ignores NULLs
-- If salaries are: 5000, 6000, NULL, 7000
-- AVG = (5000 + 6000 + 7000) / 3 = 6000 (NOT divided by 4!)

-- If you want NULLs treated as 0:
SELECT AVG(COALESCE(salary, 0)) AS avg_salary_with_nulls FROM users;

-- Average order amount
SELECT AVG(amount) AS avg_order_value FROM orders;

-- Round to 2 decimal places
SELECT ROUND(AVG(amount), 2) AS avg_order_value FROM orders;
```

### MIN and MAX

```sql
-- Highest salary
SELECT MAX(salary) AS highest_salary FROM users;

-- Lowest salary
SELECT MIN(salary) AS lowest_salary FROM users;

-- Salary range
SELECT
    MIN(salary) AS lowest,
    MAX(salary) AS highest,
    MAX(salary) - MIN(salary) AS salary_range
FROM users;

-- Most recent order
SELECT MAX(created_at) AS latest_order FROM orders;

-- Oldest order
SELECT MIN(created_at) AS first_order FROM orders;
```

### Combining Aggregate Functions

```sql
-- Complete summary report
SELECT
    COUNT(*) AS total_orders,
    COUNT(DISTINCT user_id) AS unique_customers,
    SUM(amount) AS total_revenue,
    ROUND(AVG(amount), 2) AS avg_order_value,
    MIN(amount) AS smallest_order,
    MAX(amount) AS largest_order
FROM orders
WHERE status = 'completed';
```

**In short:** Aggregate functions collapse multiple rows into a single result. `COUNT(*)` counts all rows while `COUNT(column)` skips NULLs. `SUM` and `AVG` also ignore NULLs, which can be surprising. Use `COALESCE` to handle NULLs when needed. These functions are the backbone of any reporting query.

---

## 9. GROUP BY and HAVING

**GROUP BY** splits your rows into groups based on one or more columns, then applies aggregate functions to each group independently. **HAVING** filters groups after aggregation.

### Basic GROUP BY

```sql
-- Count orders per user
SELECT
    user_id,
    COUNT(*) AS order_count
FROM orders
GROUP BY user_id;

-- Total revenue per order status
SELECT
    status,
    COUNT(*) AS order_count,
    SUM(amount) AS total_revenue
FROM orders
GROUP BY status;
```

### GROUP BY with JOIN

```sql
-- Orders per customer with their names
SELECT
    u.name,
    COUNT(o.id) AS order_count,
    COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.name
ORDER BY total_spent DESC;
```

### GROUP BY with Multiple Columns

```sql
-- Revenue per product category per month
SELECT
    p.category,
    DATE_FORMAT(o.created_at, '%Y-%m') AS month,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS revenue
FROM orders o
INNER JOIN products p ON o.product_id = p.id
WHERE o.status = 'completed'
GROUP BY p.category, DATE_FORMAT(o.created_at, '%Y-%m')
ORDER BY month DESC, revenue DESC;
```

### HAVING vs WHERE

This is a very common interview question. The key difference is **when** the filtering happens.

- **WHERE** filters rows **before** grouping (before GROUP BY runs)
- **HAVING** filters groups **after** grouping (after GROUP BY and aggregate functions run)

```sql
-- WHERE: filter rows BEFORE grouping
-- "Only look at completed orders, then count per user"
SELECT
    user_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent
FROM orders
WHERE status = 'completed'
GROUP BY user_id;

-- HAVING: filter groups AFTER grouping
-- "Count all orders per user, then only show users with more than 3 orders"
SELECT
    user_id,
    COUNT(*) AS order_count,
    SUM(amount) AS total_spent
FROM orders
GROUP BY user_id
HAVING COUNT(*) > 3;

-- Using both WHERE and HAVING together
-- "Among completed orders, find users who spent more than 1000 total"
SELECT
    u.name,
    COUNT(o.id) AS order_count,
    SUM(o.amount) AS total_spent
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.name
HAVING SUM(o.amount) > 1000
ORDER BY total_spent DESC;
```

**SQL execution order** (important for understanding WHERE vs HAVING):

1. `FROM` and `JOIN` -- determine the tables
2. `WHERE` -- filter individual rows
3. `GROUP BY` -- group the remaining rows
4. `HAVING` -- filter groups
5. `SELECT` -- choose columns and compute expressions
6. `DISTINCT` -- remove duplicates
7. `ORDER BY` -- sort the results
8. `LIMIT` / `OFFSET` -- paginate

### Practical: Revenue Report Per Month

```sql
-- Monthly revenue report for the last 12 months,
-- only showing months with more than $5000 in revenue
SELECT
    DATE_FORMAT(o.created_at, '%Y-%m') AS month,
    COUNT(o.id) AS total_orders,
    COUNT(DISTINCT o.user_id) AS unique_customers,
    SUM(o.amount) AS revenue,
    ROUND(AVG(o.amount), 2) AS avg_order_value
FROM orders o
WHERE o.status = 'completed'
  AND o.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY DATE_FORMAT(o.created_at, '%Y-%m')
HAVING SUM(o.amount) > 5000
ORDER BY month DESC;
```

**In short:** `GROUP BY` splits rows into groups for aggregate calculations. `WHERE` filters rows before grouping; `HAVING` filters groups after aggregation. You can use both together. Understanding the SQL execution order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT) is crucial for writing correct queries.

---

## Advanced Queries

---

## 10. Subqueries and Nested Queries

A **subquery** is a query nested inside another query. They allow you to use the result of one query as input for another. Subqueries can appear in the `SELECT`, `FROM`, or `WHERE` clause.

### Subquery in WHERE Clause

The most common use case. The inner query returns values that the outer query uses for filtering.

```sql
-- Find users who have placed at least one order
SELECT name, email
FROM users
WHERE id IN (SELECT DISTINCT user_id FROM orders);

-- Find users who have NEVER placed an order
SELECT name, email
FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);

-- Find users whose salary is above the company average
SELECT name, salary
FROM users
WHERE salary > (SELECT AVG(salary) FROM users);

-- Find orders with an amount above the average order amount
SELECT id, user_id, amount
FROM orders
WHERE amount > (SELECT AVG(amount) FROM orders);
```

### Subquery in SELECT Clause

Used to compute a value for each row in the outer query.

```sql
-- Get each user with the total number of orders they placed
SELECT
    u.name,
    u.email,
    (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count
FROM users u;

-- Get each user with their most recent order date
SELECT
    u.name,
    (SELECT MAX(o.created_at) FROM orders o WHERE o.user_id = u.id) AS last_order_date
FROM users u;
```

### Subquery in FROM Clause (Derived Table)

Used to create a temporary result set that you can query like a table.

```sql
-- Find the top 3 customers by spending, then get their details
SELECT
    u.name,
    u.email,
    top_customers.total_spent
FROM (
    SELECT user_id, SUM(amount) AS total_spent
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
    ORDER BY total_spent DESC
    LIMIT 3
) AS top_customers
INNER JOIN users u ON top_customers.user_id = u.id;
```

### Correlated vs Non-Correlated Subqueries

This is an important distinction for interviews.

**Non-correlated subquery:** The inner query runs once, independently. It does not reference the outer query.

```sql
-- Non-correlated: the subquery runs ONCE and returns a single value
SELECT name, salary
FROM users
WHERE salary > (SELECT AVG(salary) FROM users);
-- The AVG(salary) is computed once and used for every row
```

**Correlated subquery:** The inner query runs once **for each row** of the outer query. It references columns from the outer query.

```sql
-- Correlated: the subquery runs ONCE PER ROW of the outer query
SELECT
    u.name,
    u.salary,
    u.department_id
FROM users u
WHERE u.salary > (
    SELECT AVG(u2.salary)
    FROM users u2
    WHERE u2.department_id = u.department_id
);
-- This finds users who earn more than the average salary in THEIR department
-- The subquery re-runs for each user, using that user's department_id
```

Correlated subqueries are powerful but can be slow on large datasets because they execute the inner query repeatedly. When possible, consider rewriting them as JOINs.

```sql
-- The correlated subquery above, rewritten as a JOIN
SELECT u.name, u.salary, u.department_id
FROM users u
INNER JOIN (
    SELECT department_id, AVG(salary) AS avg_salary
    FROM users
    GROUP BY department_id
) dept_avg ON u.department_id = dept_avg.department_id
WHERE u.salary > dept_avg.avg_salary;
```

### EXISTS and NOT EXISTS

`EXISTS` checks whether a subquery returns any rows. It is often faster than `IN` for large datasets.

```sql
-- Find users who have at least one completed order
SELECT u.name, u.email
FROM users u
WHERE EXISTS (
    SELECT 1 FROM orders o
    WHERE o.user_id = u.id AND o.status = 'completed'
);

-- Find users who have no orders at all
SELECT u.name, u.email
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

**In short:** Subqueries let you nest queries inside other queries. They can appear in WHERE (most common), SELECT, or FROM clauses. Non-correlated subqueries run once; correlated subqueries run once per row and can be slow. Use `EXISTS` for efficient existence checks. When performance matters, consider rewriting subqueries as JOINs.

---

## 11. Common Table Expressions (CTEs)

A **Common Table Expression (CTE)** is a temporary named result set defined using the `WITH` keyword. It exists only for the duration of the query. CTEs make complex queries more readable and maintainable.

### Basic CTE Syntax

```sql
WITH cte_name AS (
    -- Your query here
    SELECT ...
)
SELECT * FROM cte_name;
```

### Readability Advantage

Compare a nested subquery to a CTE:

```sql
-- Without CTE (nested subquery -- harder to read)
SELECT u.name, u.email, customer_stats.total_orders, customer_stats.total_spent
FROM users u
INNER JOIN (
    SELECT
        user_id,
        COUNT(*) AS total_orders,
        SUM(amount) AS total_spent
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
    HAVING SUM(amount) > 1000
) AS customer_stats ON u.id = customer_stats.user_id
ORDER BY customer_stats.total_spent DESC;

-- With CTE (same logic, much cleaner)
WITH customer_stats AS (
    SELECT
        user_id,
        COUNT(*) AS total_orders,
        SUM(amount) AS total_spent
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
    HAVING SUM(amount) > 1000
)
SELECT
    u.name,
    u.email,
    cs.total_orders,
    cs.total_spent
FROM users u
INNER JOIN customer_stats cs ON u.id = cs.user_id
ORDER BY cs.total_spent DESC;
```

### Multiple CTEs

You can define multiple CTEs separated by commas.

```sql
WITH high_spenders AS (
    SELECT user_id, SUM(amount) AS total_spent
    FROM orders
    WHERE status = 'completed'
    GROUP BY user_id
    HAVING SUM(amount) > 1000
),
recent_orders AS (
    SELECT user_id, MAX(created_at) AS last_order_date
    FROM orders
    GROUP BY user_id
),
department_names AS (
    SELECT u.id AS user_id, d.name AS department_name
    FROM users u
    INNER JOIN departments d ON u.department_id = d.id
)
SELECT
    u.name,
    u.email,
    dn.department_name,
    hs.total_spent,
    ro.last_order_date
FROM users u
INNER JOIN high_spenders hs ON u.id = hs.user_id
LEFT JOIN recent_orders ro ON u.id = ro.user_id
LEFT JOIN department_names dn ON u.id = dn.user_id
ORDER BY hs.total_spent DESC;
```

### Recursive CTEs

Recursive CTEs are used for hierarchical or tree-structured data, like an org chart. A recursive CTE references itself.

```sql
-- Build the full organizational hierarchy
WITH RECURSIVE org_chart AS (
    -- Base case: start with top-level employees (no manager)
    SELECT
        id,
        name,
        manager_id,
        salary,
        0 AS level,
        CAST(name AS CHAR(500)) AS path
    FROM employees
    WHERE manager_id IS NULL

    UNION ALL

    -- Recursive case: find employees whose manager is in the current result
    SELECT
        e.id,
        e.name,
        e.manager_id,
        e.salary,
        oc.level + 1,
        CONCAT(oc.path, ' > ', e.name)
    FROM employees e
    INNER JOIN org_chart oc ON e.manager_id = oc.id
)
SELECT
    CONCAT(REPEAT('  ', level), name) AS employee,
    level,
    salary,
    path
FROM org_chart
ORDER BY path;
```

**Result:**

```
+------------------+-------+----------+-----------------------------+
| employee         | level | salary   | path                        |
+------------------+-------+----------+-----------------------------+
| John             | 0     | 15000.00 | John                        |
|   Sarah          | 1     | 12000.00 | John > Sarah                |
|     Mike         | 2     | 9000.00  | John > Sarah > Mike         |
|       Lisa       | 3     | 7000.00  | John > Sarah > Mike > Lisa  |
|       Tom        | 3     | 6500.00  | John > Sarah > Mike > Tom   |
+------------------+-------+----------+-----------------------------+
```

### Another Recursive CTE Example: Number Sequence

```sql
-- Generate numbers 1 through 10
WITH RECURSIVE numbers AS (
    SELECT 1 AS n
    UNION ALL
    SELECT n + 1 FROM numbers WHERE n < 10
)
SELECT n FROM numbers;
```

**In short:** CTEs use the `WITH` keyword to create named temporary result sets. They dramatically improve readability compared to nested subqueries. You can chain multiple CTEs with commas. Recursive CTEs are powerful for hierarchical data like org charts and tree structures. They are a must-know for modern SQL interviews.

---

## 12. UNION, INTERSECT, and EXCEPT

These set operations combine the results of two or more SELECT statements. All SELECT statements must have the same number of columns with compatible data types.

### UNION vs UNION ALL

**UNION** combines results and **removes duplicates**. **UNION ALL** combines results and **keeps duplicates**.

```sql
-- UNION: removes duplicates
SELECT name, email FROM users WHERE department_id = 1
UNION
SELECT name, email FROM users WHERE salary > 6000;
-- If a user is in department 1 AND earns > 6000, they appear only ONCE

-- UNION ALL: keeps duplicates (faster because no dedup step)
SELECT name, email FROM users WHERE department_id = 1
UNION ALL
SELECT name, email FROM users WHERE salary > 6000;
-- If a user matches both conditions, they appear TWICE
```

**When to use which:**
- Use `UNION` when you need unique results
- Use `UNION ALL` when duplicates are acceptable or impossible, and you want better performance

### Practical UNION Example

```sql
-- Create a combined activity log from multiple tables
SELECT
    'order' AS activity_type,
    user_id,
    amount AS value,
    created_at
FROM orders

UNION ALL

SELECT
    'product_view' AS activity_type,
    user_id,
    product_id AS value,
    viewed_at AS created_at
FROM product_views

ORDER BY created_at DESC
LIMIT 50;
```

### INTERSECT

**INTERSECT** returns only rows that appear in **both** result sets.

```sql
-- Find users who are in department 1 AND have placed an order
SELECT user_id FROM users WHERE department_id = 1
INTERSECT
SELECT DISTINCT user_id FROM orders;
```

**Note:** MySQL does not support INTERSECT directly (added in MySQL 8.0.31). You can simulate it:

```sql
-- Simulating INTERSECT in older MySQL
SELECT DISTINCT u.id
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE u.department_id = 1;
```

### EXCEPT (MINUS in Oracle)

**EXCEPT** returns rows from the first query that are **not** in the second query.

```sql
-- Find users who have NOT placed any orders
SELECT id FROM users
EXCEPT
SELECT DISTINCT user_id FROM orders;
```

**Note:** Like INTERSECT, EXCEPT was added in MySQL 8.0.31. You can simulate it:

```sql
-- Simulating EXCEPT in older MySQL
SELECT u.id
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

### Summary

| Operation | Returns | Removes Duplicates? |
|-----------|---------|-------------------|
| `UNION` | Rows from both queries | Yes |
| `UNION ALL` | Rows from both queries | No (faster) |
| `INTERSECT` | Only rows in both queries | Yes |
| `EXCEPT` | Rows in first but not second | Yes |

**In short:** `UNION` combines results (deduped), `UNION ALL` combines without dedup (faster). `INTERSECT` finds common rows. `EXCEPT` finds rows in the first set not in the second. All require matching column counts and compatible types. MySQL added native INTERSECT/EXCEPT support in 8.0.31; for older versions, use JOINs to simulate them.

---

## Window Functions

---

## 13. What are Window Functions?

**Window functions** perform calculations across a set of rows that are related to the current row -- without collapsing the rows into a single result like aggregate functions do. This is their superpower: you get the aggregate value **alongside** each individual row.

### The OVER() Clause

Every window function uses the `OVER()` clause to define its "window" -- the set of rows the function operates on.

```sql
-- Without window function: you get ONE row
SELECT AVG(salary) AS avg_salary FROM users;
-- Result: 6125.00

-- With window function: you get the average NEXT TO each row
SELECT
    name,
    salary,
    AVG(salary) OVER() AS avg_salary
FROM users;
```

**Result:**

```
+-------+---------+------------+
| name  | salary  | avg_salary |
+-------+---------+------------+
| Ahmed | 5000.00 | 6125.00    |
| Sara  | 6000.00 | 6125.00    |
| Omar  | 5500.00 | 6125.00    |
| Layla | 7000.00 | 6125.00    |
+-------+---------+------------+
```

Every row still appears, but now each row also has the overall average.

### PARTITION BY vs GROUP BY

**PARTITION BY** divides rows into groups (partitions) for window function calculations, but it does **not** collapse the rows.

```sql
-- GROUP BY: collapses rows (one row per department)
SELECT department_id, AVG(salary) AS avg_salary
FROM users
GROUP BY department_id;

-- PARTITION BY: keeps all rows, adds per-department average
SELECT
    name,
    department_id,
    salary,
    AVG(salary) OVER(PARTITION BY department_id) AS dept_avg_salary
FROM users;
```

**Result with PARTITION BY:**

```
+-------+---------------+---------+-----------------+
| name  | department_id | salary  | dept_avg_salary |
+-------+---------------+---------+-----------------+
| Ahmed | 1             | 5000.00 | 5250.00         |
| Omar  | 1             | 5500.00 | 5250.00         |
| Sara  | 2             | 6000.00 | 6000.00         |
| Layla | 3             | 7000.00 | 7000.00         |
+-------+---------------+---------+-----------------+
```

Each row keeps its individual data but also shows the department average. This is impossible with GROUP BY alone.

### Why Window Functions are Powerful

Window functions solve problems that would otherwise require complex subqueries or self-joins:
- Ranking rows within groups
- Comparing each row to an aggregate (e.g., "Is this salary above or below the department average?")
- Accessing previous or next row values
- Calculating running totals
- Finding the Nth highest/lowest value

```sql
-- Compare each user's salary to their department average
SELECT
    name,
    department_id,
    salary,
    AVG(salary) OVER(PARTITION BY department_id) AS dept_avg,
    salary - AVG(salary) OVER(PARTITION BY department_id) AS diff_from_avg
FROM users;
```

### ORDER BY within OVER()

Adding `ORDER BY` inside the `OVER()` clause creates a running (cumulative) calculation.

```sql
-- Running total of order amounts
SELECT
    id,
    user_id,
    amount,
    SUM(amount) OVER(ORDER BY created_at) AS running_total
FROM orders;
```

```sql
-- Running total per user
SELECT
    id,
    user_id,
    amount,
    SUM(amount) OVER(PARTITION BY user_id ORDER BY created_at) AS user_running_total
FROM orders;
```

**In short:** Window functions calculate values across a set of related rows without collapsing them. The `OVER()` clause defines the window. `PARTITION BY` is like GROUP BY but keeps all rows. Adding `ORDER BY` inside `OVER()` creates running calculations. They are one of the most powerful features in modern SQL and a favorite topic in interviews.

---

## 14. ROW_NUMBER, RANK, and DENSE_RANK

These three ranking functions assign a number to each row based on the specified ordering. The difference between them is how they handle **ties** (rows with the same value).

### Definitions

- **ROW_NUMBER():** Assigns a unique sequential number to each row. No ties -- even if values are identical, each row gets a different number.
- **RANK():** Assigns the same rank to tied rows, then **skips** the next rank(s). If two rows tie for rank 2, the next row gets rank 4.
- **DENSE_RANK():** Assigns the same rank to tied rows, but does **not** skip. If two rows tie for rank 2, the next row gets rank 3.

### Example with Same Data

```sql
SELECT
    name,
    salary,
    ROW_NUMBER() OVER(ORDER BY salary DESC) AS row_num,
    RANK()       OVER(ORDER BY salary DESC) AS rank_num,
    DENSE_RANK() OVER(ORDER BY salary DESC) AS dense_rank_num
FROM users;
```

**Result:**

| name | salary | row_num | rank_num | dense_rank_num |
|------|--------|---------|----------|----------------|
| Layla | 7000 | 1 | 1 | 1 |
| Sara | 6000 | 2 | 2 | 2 |
| Omar | 6000 | 3 | 2 | 2 |
| Ahmed | 5000 | 4 | 4 | 3 |
| Karim | 4500 | 5 | 5 | 4 |

Notice the differences at Sara and Omar (both have salary 6000):
- **ROW_NUMBER:** Sara=2, Omar=3 (unique numbers, arbitrary order for ties)
- **RANK:** Sara=2, Omar=2, then Ahmed=**4** (skipped rank 3)
- **DENSE_RANK:** Sara=2, Omar=2, then Ahmed=**3** (no skip)

### Practical: Get the Top N Per Group

One of the most common interview questions: "Get the top 2 highest-paid users per department."

```sql
WITH ranked AS (
    SELECT
        name,
        department_id,
        salary,
        ROW_NUMBER() OVER(
            PARTITION BY department_id
            ORDER BY salary DESC
        ) AS rn
    FROM users
)
SELECT name, department_id, salary
FROM ranked
WHERE rn <= 2;
```

This uses `PARTITION BY department_id` to rank users **within each department**, then filters to keep only the top 2.

### Practical: Find the Second Highest Salary

```sql
-- Using DENSE_RANK (handles ties correctly)
WITH ranked AS (
    SELECT
        name,
        salary,
        DENSE_RANK() OVER(ORDER BY salary DESC) AS dr
    FROM users
)
SELECT name, salary
FROM ranked
WHERE dr = 2;
```

### Practical: Remove Duplicate Rows

```sql
-- Keep only the first occurrence of each email
WITH numbered AS (
    SELECT
        *,
        ROW_NUMBER() OVER(PARTITION BY email ORDER BY id) AS rn
    FROM users
)
DELETE FROM users WHERE id IN (
    SELECT id FROM numbered WHERE rn > 1
);
```

**In short:** ROW_NUMBER gives unique sequential numbers. RANK gives the same number for ties but skips ranks. DENSE_RANK gives the same number for ties without skipping. Use ROW_NUMBER for "top N per group" queries. Use DENSE_RANK for "Nth highest value" queries. These are extremely common in SQL interviews.

---

## 15. LEAD, LAG, and Other Window Functions

### LAG -- Access the Previous Row

`LAG(column, offset, default)` returns the value from a **previous** row. The offset (default 1) specifies how many rows back to look.

```sql
-- Compare each order's amount to the previous order
SELECT
    id,
    user_id,
    amount,
    created_at,
    LAG(amount, 1, 0) OVER(ORDER BY created_at) AS prev_amount,
    amount - LAG(amount, 1, 0) OVER(ORDER BY created_at) AS diff_from_prev
FROM orders;
```

**Result:**

```
+----+---------+--------+---------------------+-------------+----------------+
| id | user_id | amount | created_at          | prev_amount | diff_from_prev |
+----+---------+--------+---------------------+-------------+----------------+
| 1  | 1       | 100.00 | 2024-01-15 10:00:00 | 0.00        | 100.00         |
| 2  | 2       | 250.00 | 2024-01-16 14:30:00 | 100.00      | 150.00         |
| 3  | 1       | 75.00  | 2024-01-17 09:15:00 | 250.00      | -175.00        |
| 4  | 3       | 300.00 | 2024-01-18 16:00:00 | 75.00       | 225.00         |
+----+---------+--------+---------------------+-------------+----------------+
```

### LAG with PARTITION BY

```sql
-- Compare each user's order to their own previous order
SELECT
    id,
    user_id,
    amount,
    created_at,
    LAG(amount) OVER(PARTITION BY user_id ORDER BY created_at) AS prev_order_amount
FROM orders;
-- Now LAG looks at the previous order for the SAME user, not globally
```

### LEAD -- Access the Next Row

`LEAD(column, offset, default)` returns the value from a **future** row.

```sql
-- Show each order alongside the next order's amount
SELECT
    id,
    user_id,
    amount,
    LEAD(amount) OVER(ORDER BY created_at) AS next_amount,
    LEAD(amount) OVER(ORDER BY created_at) - amount AS change
FROM orders;
```

### Practical: Calculate Month-over-Month Growth

```sql
WITH monthly_revenue AS (
    SELECT
        DATE_FORMAT(created_at, '%Y-%m') AS month,
        SUM(amount) AS revenue
    FROM orders
    WHERE status = 'completed'
    GROUP BY DATE_FORMAT(created_at, '%Y-%m')
)
SELECT
    month,
    revenue,
    LAG(revenue) OVER(ORDER BY month) AS prev_month_revenue,
    ROUND(
        (revenue - LAG(revenue) OVER(ORDER BY month))
        / LAG(revenue) OVER(ORDER BY month) * 100,
        2
    ) AS growth_percent
FROM monthly_revenue
ORDER BY month;
```

### Running Totals with SUM OVER

```sql
-- Running total of all orders
SELECT
    id,
    amount,
    created_at,
    SUM(amount) OVER(ORDER BY created_at) AS running_total
FROM orders;

-- Running total per user
SELECT
    id,
    user_id,
    amount,
    SUM(amount) OVER(
        PARTITION BY user_id
        ORDER BY created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS user_running_total
FROM orders;
```

### FIRST_VALUE and LAST_VALUE

```sql
-- Show each user's salary alongside the highest salary in their department
SELECT
    name,
    department_id,
    salary,
    FIRST_VALUE(name) OVER(
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS highest_paid_employee,
    FIRST_VALUE(salary) OVER(
        PARTITION BY department_id
        ORDER BY salary DESC
    ) AS highest_salary_in_dept
FROM users;

-- LAST_VALUE requires explicit frame definition
SELECT
    name,
    department_id,
    salary,
    LAST_VALUE(name) OVER(
        PARTITION BY department_id
        ORDER BY salary DESC
        ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS lowest_paid_employee
FROM users;
```

**Important:** `LAST_VALUE` often surprises people because the default window frame is `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW`. This means `LAST_VALUE` returns the current row's value by default. You must explicitly set the frame to `ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING` to get the actual last value in the partition.

### NTILE -- Divide Rows into Buckets

```sql
-- Divide users into 4 salary quartiles
SELECT
    name,
    salary,
    NTILE(4) OVER(ORDER BY salary) AS salary_quartile
FROM users;
```

### Window Function Summary

| Function | Purpose | Example Use Case |
|----------|---------|-----------------|
| `ROW_NUMBER()` | Unique sequential number | Top N per group, deduplication |
| `RANK()` | Rank with gaps for ties | Competition rankings |
| `DENSE_RANK()` | Rank without gaps | Finding Nth highest value |
| `LAG()` | Previous row value | Month-over-month comparison |
| `LEAD()` | Next row value | Forecasting, gap analysis |
| `SUM() OVER()` | Running/cumulative total | Revenue accumulation |
| `AVG() OVER()` | Moving average | Trend smoothing |
| `FIRST_VALUE()` | First value in window | Best performer in group |
| `LAST_VALUE()` | Last value in window | Worst performer in group |
| `NTILE()` | Divide into N buckets | Percentiles, quartiles |

**In short:** LAG and LEAD let you access previous and next rows without self-joins, making time-series analysis elegant. Running totals use SUM with OVER(ORDER BY ...). FIRST_VALUE and LAST_VALUE access the extreme values in a window (but watch out for LAST_VALUE's default frame). These functions transform complex analytical queries from multi-step nightmares into single, readable statements.

---

## Optimization & Database Theory

---

## 16. Indexes and Query Optimization

An **index** is a data structure that speeds up data retrieval. Without indexes, the database must scan every row in a table to find matching data (a "full table scan"). With the right indexes, it can jump directly to the relevant rows.

> Think of a database index like the index at the back of a book. Instead of reading every page to find information about "transactions," you look in the index, find the page number, and go directly there. Without the index, you would have to flip through every single page.

### How Indexes Work: B-Tree

Most database indexes use a **B-tree** (balanced tree) structure. The B-tree organizes data in a sorted, hierarchical way that allows the database to find any value in logarithmic time -- O(log n) instead of O(n).

```
                    [50]
                   /    \
              [20, 35]   [70, 85]
             /   |   \   /   |   \
          [10] [25] [40] [60] [75] [90]
```

Each node contains sorted values and pointers to child nodes. To find a value, the database traverses from root to leaf, making a decision at each level. For a table with 1 million rows, this means roughly 20 comparisons instead of 1 million.

### Creating Indexes

```sql
-- Single column index
CREATE INDEX idx_users_email ON users(email);

-- Composite (multi-column) index
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Unique index (also enforces uniqueness)
CREATE UNIQUE INDEX idx_users_email_unique ON users(email);

-- View existing indexes on a table
SHOW INDEX FROM users;
```

### Single vs Composite Index

A **single column index** indexes one column. A **composite index** indexes multiple columns and is useful when you frequently query on combinations of columns.

```sql
-- This composite index on (user_id, status):
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Helps with these queries:
SELECT * FROM orders WHERE user_id = 1;                         -- Yes (leftmost column)
SELECT * FROM orders WHERE user_id = 1 AND status = 'completed'; -- Yes (both columns)
SELECT * FROM orders WHERE status = 'completed';                 -- NO! (not leftmost)
```

**Leftmost prefix rule:** A composite index on `(A, B, C)` can help queries filtering on `A`, `A+B`, or `A+B+C`, but NOT on `B`, `C`, `B+C`, etc.

### When to Create Indexes

**Do index:**
- Columns used frequently in `WHERE` clauses
- Columns used in `JOIN` conditions (foreign keys)
- Columns used in `ORDER BY` and `GROUP BY`
- Columns with high cardinality (many unique values, like email or user_id)

**Do NOT index:**
- Small tables (full scan is fast enough)
- Columns with low cardinality (like a boolean `is_active` column with only true/false)
- Columns that are frequently updated (indexes slow down writes)
- Tables that are write-heavy with few reads

### Impact on Writes

Every index speeds up reads but **slows down writes**. When you INSERT, UPDATE, or DELETE a row, every index on that table must also be updated. A table with 10 indexes means each write operation does 11 operations (1 for the table + 10 for the indexes).

```sql
-- This INSERT must update every index on the orders table
INSERT INTO orders (user_id, product_id, amount, status)
VALUES (1, 5, 150.00, 'pending');
-- If orders has 5 indexes, this single INSERT triggers 6 write operations
```

### Practical Index Strategy

```sql
-- For our orders table, common queries might be:
-- 1. "Get all orders for a user" -> index on user_id
-- 2. "Get all pending orders" -> index on status (maybe, check cardinality)
-- 3. "Get completed orders for a user sorted by date" -> composite index

-- Best composite index for query #3:
CREATE INDEX idx_orders_user_status_created
ON orders(user_id, status, created_at);

-- This single index covers all three queries efficiently
```

**In short:** Indexes are like a book's index -- they let the database find data without scanning every row. B-trees provide O(log n) lookups. Composite indexes follow the leftmost prefix rule. Index columns used in WHERE, JOIN, ORDER BY. But every index slows down writes, so do not over-index. Finding the right balance is a key skill.

---

## 17. EXPLAIN and Query Analysis

**EXPLAIN** shows you the execution plan for a query -- how the database engine will actually execute it. This is your primary tool for diagnosing slow queries.

### Basic EXPLAIN Usage

```sql
EXPLAIN SELECT * FROM users WHERE email = 'ahmed@example.com';
```

**Sample output (MySQL):**

```
+----+-------------+-------+-------+------------------+------------------+---------+-------+------+-------+
| id | select_type | table | type  | possible_keys    | key              | key_len | ref   | rows | Extra |
+----+-------------+-------+-------+------------------+------------------+---------+-------+------+-------+
| 1  | SIMPLE      | users | const | idx_users_email  | idx_users_email  | 602     | const | 1    | NULL  |
+----+-------------+-------+-------+------------------+------------------+---------+-------+------+-------+
```

### Key EXPLAIN Indicators

| Column | What It Tells You | What to Look For |
|--------|------------------|-----------------|
| **type** | How the table is accessed | `const` > `eq_ref` > `ref` > `range` > `index` > `ALL` (ALL is worst) |
| **possible_keys** | Indexes that could be used | Should not be NULL for filtered queries |
| **key** | Index actually used | Should not be NULL; should match your intended index |
| **rows** | Estimated rows to examine | Lower is better |
| **Extra** | Additional information | Watch for "Using filesort", "Using temporary" |

### Access Type Ranking (best to worst)

| Type | Meaning | Performance |
|------|---------|------------|
| `const` / `system` | Exact match on primary key or unique index | Excellent |
| `eq_ref` | One row per join match (unique index) | Excellent |
| `ref` | Multiple rows from index lookup | Good |
| `range` | Index range scan (BETWEEN, <, >) | Good |
| `index` | Full index scan (reads every entry in the index) | Fair |
| `ALL` | Full table scan (reads every row) | Bad |

### Reading EXPLAIN Output -- Practical Example

```sql
-- Slow query (no indexes)
EXPLAIN SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.department_id = 2
GROUP BY u.id, u.name;
```

**Bad output:**

```
+----+-------+------+------+------+-------------+
| id | table | type | key  | rows | Extra       |
+----+-------+------+------+------+-------------+
| 1  | u     | ALL  | NULL | 5000 | Using where |
| 1  | o     | ALL  | NULL | 50000| Using where |
+----+-------+------+------+------+-------------+
```

Both tables show `type: ALL` (full table scan) and `key: NULL` (no index used). The database is reading all 5000 users and all 50000 orders.

### Optimizing the Slow Query

```sql
-- Step 1: Add indexes
CREATE INDEX idx_users_department ON users(department_id);
CREATE INDEX idx_orders_user ON orders(user_id);

-- Step 2: Run EXPLAIN again
EXPLAIN SELECT u.name, COUNT(o.id) AS order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.department_id = 2
GROUP BY u.id, u.name;
```

**Better output:**

```
+----+-------+------+----------------------+------+-------------+
| id | table | type | key                  | rows | Extra       |
+----+-------+------+----------------------+------+-------------+
| 1  | u     | ref  | idx_users_department | 50   | NULL        |
| 1  | o     | ref  | idx_orders_user      | 10   | NULL        |
+----+-------+------+----------------------+------+-------------+
```

Now the database reads only 50 users (in department 2) and approximately 10 orders per user. That is 550 rows instead of 55,000.

### EXPLAIN ANALYZE (MySQL 8.0+ / PostgreSQL)

`EXPLAIN ANALYZE` actually executes the query and shows real timing:

```sql
EXPLAIN ANALYZE
SELECT u.name, SUM(o.amount) AS total_spent
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.status = 'completed'
GROUP BY u.id, u.name
ORDER BY total_spent DESC
LIMIT 10;
```

### Common Performance Red Flags

- **type: ALL** -- Full table scan. Add an index on the filtered column.
- **Using filesort** -- MySQL cannot use an index for ORDER BY. Consider a composite index that includes the ORDER BY column.
- **Using temporary** -- MySQL creates a temporary table (often for GROUP BY or DISTINCT). Consider rewriting the query or adding indexes.
- **rows: very large number** -- The query examines too many rows. Check WHERE clauses and indexes.
- **key: NULL** -- No index is being used. Verify that the right index exists and is being picked up.

**In short:** EXPLAIN is your best friend for understanding query performance. Look at `type` (avoid ALL), `key` (should not be NULL), `rows` (lower is better), and `Extra` (avoid filesort and temporary). Always EXPLAIN your queries before deploying them to production. Add indexes strategically based on what EXPLAIN tells you.

---

## 18. Transactions and Isolation Levels

A **transaction** is a sequence of SQL operations that are treated as a single unit of work. Either all operations succeed, or none of them do. This ensures data integrity.

### ACID Properties

Every database transaction guarantees the **ACID** properties:

- **Atomicity:** All operations in a transaction succeed or all fail. No partial execution. If a bank transfer debits one account but the credit fails, the debit is rolled back.
- **Consistency:** A transaction brings the database from one valid state to another valid state. All constraints, rules, and triggers are respected.
- **Isolation:** Concurrent transactions do not interfere with each other. Each transaction sees a consistent snapshot of the data.
- **Durability:** Once a transaction is committed, the changes are permanent, even if the server crashes immediately after.

> Think of ACID like sending a package. Atomicity means the package either arrives complete or not at all (no half-deliveries). Consistency means the package contents match the label. Isolation means your package does not get mixed up with someone else's. Durability means once delivered, it stays delivered.

### Transaction Syntax

```sql
-- Start a transaction
BEGIN;
-- or: START TRANSACTION;

-- Perform operations
UPDATE users SET salary = salary - 500 WHERE id = 1;
UPDATE users SET salary = salary + 500 WHERE id = 2;

-- If everything is good, commit
COMMIT;

-- If something went wrong, rollback
ROLLBACK;
```

### Practical Example: Bank Transfer

```sql
BEGIN;

-- Step 1: Check if sender has enough balance
SELECT salary FROM users WHERE id = 1 FOR UPDATE;
-- "FOR UPDATE" locks this row to prevent other transactions from modifying it

-- Step 2: Debit the sender
UPDATE users SET salary = salary - 1000 WHERE id = 1;

-- Step 3: Credit the receiver
UPDATE users SET salary = salary + 1000 WHERE id = 2;

-- Step 4: Log the transfer
INSERT INTO orders (user_id, product_id, amount, status)
VALUES (1, 1, 1000.00, 'completed');

-- If all steps succeed:
COMMIT;

-- If any step fails, we would:
-- ROLLBACK;
```

### SAVEPOINT

Savepoints let you partially roll back within a transaction.

```sql
BEGIN;

INSERT INTO users (name, email) VALUES ('User A', 'a@test.com');
SAVEPOINT sp1;

INSERT INTO users (name, email) VALUES ('User B', 'b@test.com');
SAVEPOINT sp2;

INSERT INTO users (name, email) VALUES ('User C', 'c@test.com');

-- Oops, undo only User C
ROLLBACK TO sp2;
-- User A and User B are still pending

COMMIT;
-- Only User A and User B are saved
```

### Isolation Levels

Isolation levels control how much one transaction can see of another transaction's uncommitted changes. Higher isolation = more safety but less concurrency.

| Isolation Level | Dirty Reads | Non-Repeatable Reads | Phantom Reads | Performance |
|----------------|-------------|---------------------|---------------|-------------|
| **READ UNCOMMITTED** | Possible | Possible | Possible | Fastest |
| **READ COMMITTED** | Prevented | Possible | Possible | Fast |
| **REPEATABLE READ** | Prevented | Prevented | Possible | Moderate |
| **SERIALIZABLE** | Prevented | Prevented | Prevented | Slowest |

**Definitions of the problems:**
- **Dirty Read:** Transaction A reads data that Transaction B has modified but not yet committed. If B rolls back, A has read "dirty" (invalid) data.
- **Non-Repeatable Read:** Transaction A reads a row, then Transaction B updates it and commits. When A reads the same row again, the value has changed.
- **Phantom Read:** Transaction A reads a set of rows matching a condition. Transaction B inserts a new row that matches the condition and commits. When A re-runs the same query, a new "phantom" row appears.

```sql
-- Set isolation level for the current session
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Check current isolation level (MySQL)
SELECT @@transaction_isolation;

-- MySQL default: REPEATABLE READ
-- PostgreSQL default: READ COMMITTED
```

### Deadlocks

A **deadlock** occurs when two transactions are each waiting for the other to release a lock.

```
Transaction A: LOCK row 1, then tries to LOCK row 2
Transaction B: LOCK row 2, then tries to LOCK row 1
-- Both are waiting forever. This is a deadlock.
```

The database engine detects deadlocks and automatically rolls back one of the transactions. To prevent deadlocks:
- Always lock rows in the same order across transactions
- Keep transactions short
- Use appropriate isolation levels
- Avoid user interaction within transactions

```sql
-- Deadlock-prone (DO NOT do this):
-- Transaction A                    -- Transaction B
BEGIN;                              BEGIN;
UPDATE users SET salary = 0         UPDATE orders SET amount = 0
WHERE id = 1;                       WHERE id = 1;
-- waits...                         -- waits...
UPDATE orders SET amount = 0        UPDATE users SET salary = 0
WHERE id = 1;                       WHERE id = 1;
-- DEADLOCK!                        -- DEADLOCK!
```

**In short:** Transactions ensure all-or-nothing execution through ACID properties. Use BEGIN/COMMIT/ROLLBACK to control them. Isolation levels trade safety for performance: READ UNCOMMITTED is fast but risky, SERIALIZABLE is safe but slow. Most databases default to READ COMMITTED or REPEATABLE READ. Deadlocks happen when transactions wait for each other's locks -- prevent them by locking in a consistent order and keeping transactions short.

---

## 19. Normalization (1NF, 2NF, 3NF, BCNF)

**Normalization** is the process of organizing database tables to reduce data redundancy and improve data integrity. Each "normal form" (NF) adds stricter rules.

> Think of normalization like organizing your closet. First Normal Form is putting everything on shelves (not on the floor). Second Normal Form is separating clothes by type. Third Normal Form is having each item in exactly one place, with no duplicates.

### First Normal Form (1NF)

**Rule:** Each column must contain only **atomic** (indivisible) values. No lists, no repeating groups.

**Before 1NF (violates -- multiple values in one column):**

| id | name | phone_numbers |
|----|------|---------------|
| 1 | Ahmed | 123-456, 789-012 |
| 2 | Sara | 345-678 |

**After 1NF (each value is atomic):**

| id | name | phone_number |
|----|------|-------------|
| 1 | Ahmed | 123-456 |
| 1 | Ahmed | 789-012 |
| 2 | Sara | 345-678 |

Or better, move to a separate table:

```sql
-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Phone numbers table (separate table for multi-valued attribute)
CREATE TABLE user_phones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    phone_number VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Second Normal Form (2NF)

**Rule:** Must be in 1NF, AND every non-key column must depend on the **entire** primary key (not just part of it). This only matters for tables with composite primary keys.

**Before 2NF (partial dependency -- student_name depends only on student_id, not the full key):**

| student_id | course_id | student_name | course_name | grade |
|-----------|-----------|-------------|-------------|-------|
| 1 | 101 | Ahmed | Math | A |
| 1 | 102 | Ahmed | Science | B |
| 2 | 101 | Sara | Math | A |

The primary key is `(student_id, course_id)`. But `student_name` depends only on `student_id`, and `course_name` depends only on `course_id`. These are **partial dependencies**.

**After 2NF (separate tables, no partial dependencies):**

```sql
-- Students table
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(100)
);

-- Courses table
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(100)
);

-- Enrollments table (only the grade depends on both student and course)
CREATE TABLE enrollments (
    student_id INT,
    course_id INT,
    grade CHAR(2),
    PRIMARY KEY (student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);
```

### Third Normal Form (3NF)

**Rule:** Must be in 2NF, AND no non-key column should depend on another non-key column (no **transitive dependencies**).

**Before 3NF (transitive dependency -- department_name depends on department_id, not on user id):**

| id | name | department_id | department_name |
|----|------|-------------|----------------|
| 1 | Ahmed | 1 | Engineering |
| 2 | Sara | 2 | Marketing |
| 3 | Omar | 1 | Engineering |

Here `department_name` depends on `department_id`, not directly on the user's primary key. This creates redundancy: "Engineering" is stored multiple times.

**After 3NF (remove transitive dependency):**

```sql
-- Users table (no department_name here)
CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Departments table (department_name lives here)
CREATE TABLE departments (
    id INT PRIMARY KEY,
    name VARCHAR(100)
);
```

### Boyce-Codd Normal Form (BCNF)

**Rule:** Must be in 3NF, AND every determinant must be a candidate key. BCNF handles edge cases that 3NF misses.

**Before BCNF:**

Consider a table where students can enroll in subjects, and each subject is taught by one professor:

| student_id | subject | professor |
|-----------|---------|-----------|
| 1 | Math | Dr. Ali |
| 2 | Math | Dr. Ali |
| 1 | Physics | Dr. Sara |
| 3 | Physics | Dr. Sara |

The functional dependency is: `subject -> professor` (each subject has one professor). But `subject` is not a candidate key (the candidate key is `student_id + subject`). This violates BCNF.

**After BCNF:**

```sql
-- Subject-Professor mapping
CREATE TABLE subject_professors (
    subject VARCHAR(100) PRIMARY KEY,
    professor VARCHAR(100)
);

-- Student enrollments
CREATE TABLE student_subjects (
    student_id INT,
    subject VARCHAR(100),
    PRIMARY KEY (student_id, subject),
    FOREIGN KEY (subject) REFERENCES subject_professors(subject)
);
```

### Normalization Summary

| Normal Form | Rule | Eliminates |
|-------------|------|-----------|
| **1NF** | Atomic values, no repeating groups | Multi-valued columns |
| **2NF** | No partial dependencies | Partial dependency on composite key |
| **3NF** | No transitive dependencies | Non-key depending on non-key |
| **BCNF** | Every determinant is a candidate key | Remaining anomalies |

### When to Denormalize

Normalization is great for data integrity, but sometimes you intentionally **denormalize** for performance:

- **Read-heavy applications:** Joining 5 tables for every page load is slow. Storing redundant data reduces JOINs.
- **Reporting/analytics:** Pre-computed summaries and aggregated tables speed up dashboards.
- **Caching layers:** Materialized views or summary tables that are periodically refreshed.
- **High-traffic systems:** Sometimes duplicating a `user_name` in the orders table avoids a JOIN on every order listing.

```sql
-- Denormalized orders table (includes user_name to avoid JOIN)
CREATE TABLE orders_denormalized (
    id INT PRIMARY KEY,
    user_id INT,
    user_name VARCHAR(100),  -- denormalized from users table
    product_name VARCHAR(150), -- denormalized from products table
    amount DECIMAL(10, 2),
    status VARCHAR(20),
    created_at TIMESTAMP
);
```

The trade-off: denormalization speeds up reads but makes writes more complex (you must update the redundant data in multiple places).

**In short:** Normalization eliminates redundancy: 1NF requires atomic values, 2NF removes partial dependencies, 3NF removes transitive dependencies, and BCNF handles remaining anomalies. In practice, most applications aim for 3NF. Denormalize intentionally when read performance is more important than write simplicity.

---

## Practical & Interview

---

## 20. MySQL vs PostgreSQL Differences

MySQL and PostgreSQL are the two most popular open-source relational databases. Both are excellent, but they have different strengths and philosophies. MySQL focuses on speed and simplicity; PostgreSQL focuses on standards compliance and advanced features.

### Feature Comparison Table

| Feature | MySQL | PostgreSQL |
|---------|-------|-----------|
| **Default Storage Engine** | InnoDB (transactional) | Single engine (MVCC-based) |
| **ACID Compliance** | Yes (with InnoDB) | Yes (always) |
| **JSON Support** | JSON type with basic functions | JSONB (binary, indexable, very powerful) |
| **Full-Text Search** | Built-in (basic) | Built-in (advanced, with ranking) |
| **Arrays** | Not supported | Native array types |
| **Enums** | ENUM column type | CREATE TYPE AS ENUM |
| **Window Functions** | MySQL 8.0+ | Supported since version 8.4 (2006) |
| **CTEs (WITH)** | MySQL 8.0+ | Supported since version 8.4 (2006) |
| **Materialized Views** | Not supported (use workarounds) | Native support |
| **UPSERT** | `INSERT ... ON DUPLICATE KEY UPDATE` | `INSERT ... ON CONFLICT DO UPDATE` |
| **Replication** | Built-in (master-slave, group replication) | Streaming replication, logical replication |
| **Default Port** | 3306 | 5432 |
| **Case Sensitivity** | Depends on collation (often case-insensitive) | Case-sensitive by default |
| **LIMIT Syntax** | `LIMIT 10 OFFSET 5` or `LIMIT 5, 10` | `LIMIT 10 OFFSET 5` |
| **Auto Increment** | `AUTO_INCREMENT` | `SERIAL` or `GENERATED ALWAYS AS IDENTITY` |
| **Boolean Type** | TINYINT(1) (0/1) | Native BOOLEAN (true/false) |
| **String Concatenation** | `CONCAT(a, b)` | `a \|\| b` or `CONCAT(a, b)` |
| **Current Timestamp** | `NOW()` or `CURRENT_TIMESTAMP` | `NOW()` or `CURRENT_TIMESTAMP` |
| **ILIKE (case-insensitive LIKE)** | Use `LOWER()` + `LIKE` | Native `ILIKE` operator |
| **Default Isolation Level** | REPEATABLE READ | READ COMMITTED |
| **Performance (simple reads)** | Generally faster | Comparable |
| **Performance (complex queries)** | Good | Often better (advanced query planner) |

### Syntax Differences

```sql
-- Auto-increment
-- MySQL:
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

-- PostgreSQL:
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
);
-- Or in modern PostgreSQL:
CREATE TABLE users (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(100)
);
```

```sql
-- UPSERT (Insert or Update)
-- MySQL:
INSERT INTO users (id, name, email)
VALUES (1, 'Ahmed', 'ahmed@test.com')
ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email);

-- PostgreSQL:
INSERT INTO users (id, name, email)
VALUES (1, 'Ahmed', 'ahmed@test.com')
ON CONFLICT (id)
DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email;
```

```sql
-- String concatenation
-- MySQL:
SELECT CONCAT(first_name, ' ', last_name) AS full_name FROM users;

-- PostgreSQL:
SELECT first_name || ' ' || last_name AS full_name FROM users;
```

```sql
-- Case-insensitive search
-- MySQL (often case-insensitive by default):
SELECT * FROM users WHERE name LIKE '%ahmed%';

-- PostgreSQL (case-sensitive by default):
SELECT * FROM users WHERE name ILIKE '%ahmed%';
```

```sql
-- FULL OUTER JOIN
-- MySQL: NOT directly supported (simulate with UNION)
-- PostgreSQL: Natively supported
SELECT * FROM users u
FULL OUTER JOIN orders o ON u.id = o.user_id;
```

```sql
-- JSON handling
-- MySQL:
SELECT JSON_EXTRACT(metadata, '$.name') FROM products;
SELECT metadata->>'$.name' FROM products; -- MySQL 8.0+

-- PostgreSQL:
SELECT metadata->>'name' FROM products;
SELECT metadata->'address'->>'city' FROM products;
-- PostgreSQL JSONB supports indexing:
CREATE INDEX idx_metadata ON products USING GIN (metadata);
```

### When to Choose Which

**Choose MySQL when:**
- You need a simple, fast database for straightforward CRUD operations
- Your hosting environment provides MySQL (most shared hosting does)
- You are using frameworks that default to MySQL (like Laravel)
- You need easy setup and administration

**Choose PostgreSQL when:**
- You need advanced data types (arrays, JSONB, custom types)
- You are building complex analytical queries
- You need geographic/spatial data support (PostGIS)
- You need materialized views or advanced indexing
- Standards compliance and data integrity are top priorities

**In short:** MySQL is simpler and faster for basic operations. PostgreSQL is more feature-rich and standards-compliant. MySQL uses AUTO_INCREMENT while PostgreSQL uses SERIAL. MySQL's JSON is basic while PostgreSQL's JSONB is powerful and indexable. For interviews, know both syntaxes and be able to explain when you would choose one over the other.

---

## 21. Common SQL Interview Questions with Solutions

These are the classic SQL interview questions that come up again and again. For each one, we will provide the schema context, the solution, and an explanation.

### Question 1: Second Highest Salary

**Problem:** Find the second highest salary from the users table. If there is no second highest salary, return NULL.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
```

**Solution 1: Using LIMIT and OFFSET**

```sql
SELECT DISTINCT salary
FROM users
ORDER BY salary DESC
LIMIT 1 OFFSET 1;
```

**Explanation:** Sort salaries in descending order, skip the first one (highest), and take the next one. DISTINCT ensures that if multiple users have the same highest salary, we still get the actual second-highest value.

**Solution 2: Using Subquery**

```sql
SELECT MAX(salary) AS second_highest_salary
FROM users
WHERE salary < (SELECT MAX(salary) FROM users);
```

**Explanation:** The inner query finds the maximum salary. The outer query finds the maximum salary that is less than that, which is the second highest.

**Solution 3: Using DENSE_RANK (most robust)**

```sql
WITH ranked AS (
    SELECT
        salary,
        DENSE_RANK() OVER(ORDER BY salary DESC) AS dr
    FROM users
)
SELECT DISTINCT salary AS second_highest_salary
FROM ranked
WHERE dr = 2;
```

**Explanation:** DENSE_RANK assigns ranks without gaps. Filtering for rank 2 gives the second highest salary, even if multiple users share the same salary. This is the preferred approach in interviews because it generalizes to Nth highest.

---

### Question 2: Employees Earning More Than Their Manager

**Problem:** Find all employees who earn more than their manager.

**Schema:**
```sql
-- employees(id, name, manager_id, salary, department_id)
```

**Solution:**

```sql
SELECT
    e.name AS employee_name,
    e.salary AS employee_salary,
    m.name AS manager_name,
    m.salary AS manager_salary
FROM employees e
INNER JOIN employees m ON e.manager_id = m.id
WHERE e.salary > m.salary;
```

**Explanation:** This is a self-join. We join the employees table to itself: `e` represents employees and `m` represents managers. The join condition `e.manager_id = m.id` links each employee to their manager. The WHERE clause filters for cases where the employee's salary exceeds their manager's salary.

---

### Question 3: Find Duplicate Emails

**Problem:** Find all email addresses that appear more than once in the users table.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
```

**Solution 1: Using GROUP BY and HAVING**

```sql
SELECT email, COUNT(*) AS occurrence_count
FROM users
GROUP BY email
HAVING COUNT(*) > 1;
```

**Explanation:** Group by email, count how many times each appears, and filter for counts greater than 1. Simple and efficient.

**Solution 2: Using Self-Join**

```sql
SELECT DISTINCT a.email
FROM users a
INNER JOIN users b ON a.email = b.email AND a.id != b.id;
```

**Explanation:** Join the table to itself on matching email but different IDs. If a match exists, the email is a duplicate.

---

### Question 4: Department with the Highest Average Salary

**Problem:** Find the department that has the highest average salary.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
-- departments(id, name)
```

**Solution 1: Using ORDER BY and LIMIT**

```sql
SELECT
    d.name AS department_name,
    ROUND(AVG(u.salary), 2) AS avg_salary
FROM departments d
INNER JOIN users u ON d.id = u.department_id
GROUP BY d.id, d.name
ORDER BY avg_salary DESC
LIMIT 1;
```

**Explanation:** Join departments with users, group by department, calculate the average salary, sort descending, and take the first row.

**Solution 2: Using a CTE (handles ties)**

```sql
WITH dept_avg AS (
    SELECT
        d.name AS department_name,
        ROUND(AVG(u.salary), 2) AS avg_salary,
        RANK() OVER(ORDER BY AVG(u.salary) DESC) AS rnk
    FROM departments d
    INNER JOIN users u ON d.id = u.department_id
    GROUP BY d.id, d.name
)
SELECT department_name, avg_salary
FROM dept_avg
WHERE rnk = 1;
```

**Explanation:** The CTE calculates each department's average salary and ranks them. Filtering for rank 1 returns the department(s) with the highest average. Using RANK handles ties -- if two departments have the same average, both are returned.

---

### Question 5: Customers Who Never Ordered

**Problem:** Find all users who have never placed an order.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
-- orders(id, user_id, product_id, amount, status, created_at)
```

**Solution 1: Using LEFT JOIN**

```sql
SELECT u.name, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

**Explanation:** LEFT JOIN keeps all users. For users with no orders, the order columns are NULL. Filtering `WHERE o.id IS NULL` gives only users with no matching orders. This is generally the most performant approach.

**Solution 2: Using NOT IN**

```sql
SELECT name, email
FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM orders);
```

**Explanation:** The subquery gets all user IDs that appear in orders. The outer query gets users whose ID is NOT in that list.

**Caution:** If the subquery returns any NULL values, `NOT IN` behaves unexpectedly (it returns no rows). Use `NOT EXISTS` instead for safety.

**Solution 3: Using NOT EXISTS (safest)**

```sql
SELECT u.name, u.email
FROM users u
WHERE NOT EXISTS (
    SELECT 1 FROM orders o WHERE o.user_id = u.id
);
```

**Explanation:** For each user, check if any order exists with their user_id. If no such order exists, include the user. This approach handles NULLs correctly and is often the most efficient.

---

### Question 6: Top 3 Products by Revenue

**Problem:** Find the top 3 products that have generated the most revenue from completed orders.

**Schema:**
```sql
-- products(id, name, price, category)
-- orders(id, user_id, product_id, amount, status, created_at)
```

**Solution:**

```sql
SELECT
    p.name AS product_name,
    p.category,
    COUNT(o.id) AS total_orders,
    SUM(o.amount) AS total_revenue
FROM products p
INNER JOIN orders o ON p.id = o.product_id
WHERE o.status = 'completed'
GROUP BY p.id, p.name, p.category
ORDER BY total_revenue DESC
LIMIT 3;
```

**Explanation:** Join products with completed orders, group by product, sum the amounts, and take the top 3.

---

### Question 7: Users with Orders in Every Month of the Last Year

**Problem:** Find users who have placed at least one order in every month of the last 12 months.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
-- orders(id, user_id, product_id, amount, status, created_at)
```

**Solution:**

```sql
SELECT
    u.name,
    u.email,
    COUNT(DISTINCT DATE_FORMAT(o.created_at, '%Y-%m')) AS active_months
FROM users u
INNER JOIN orders o ON u.id = o.user_id
WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
GROUP BY u.id, u.name, u.email
HAVING COUNT(DISTINCT DATE_FORMAT(o.created_at, '%Y-%m')) = 12;
```

**Explanation:** Count the number of distinct months each user has ordered in during the last 12 months. If that count equals 12, the user has been active every month.

---

### Question 8: Running Total of Orders Per User

**Problem:** For each order, show the running total of the order amounts for that user.

**Schema:**
```sql
-- orders(id, user_id, product_id, amount, status, created_at)
```

**Solution:**

```sql
SELECT
    o.id,
    o.user_id,
    u.name,
    o.amount,
    o.created_at,
    SUM(o.amount) OVER(
        PARTITION BY o.user_id
        ORDER BY o.created_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
    ) AS running_total
FROM orders o
INNER JOIN users u ON o.user_id = u.id
ORDER BY o.user_id, o.created_at;
```

**Explanation:** The window function SUM with PARTITION BY user_id calculates a running total for each user independently. ORDER BY created_at ensures the running total accumulates chronologically.

---

### Question 9: Nth Highest Salary (Generalized)

**Problem:** Write a query that can find the Nth highest salary. Make it work for any value of N.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
```

**Solution:**

```sql
-- For N = 3 (third highest salary):
WITH ranked_salaries AS (
    SELECT
        DISTINCT salary,
        DENSE_RANK() OVER(ORDER BY salary DESC) AS rank_num
    FROM users
)
SELECT salary
FROM ranked_salaries
WHERE rank_num = 3; -- Change 3 to any N
```

**Explanation:** DENSE_RANK assigns ranks without gaps to distinct salary values. Simply change the WHERE condition to get any Nth highest salary. This is the cleanest and most scalable approach.

---

### Question 10: Department Report Card

**Problem:** For each department, show the department name, total employees, average salary, highest salary, lowest salary, and the name of the highest-paid employee.

**Schema:**
```sql
-- users(id, name, email, department_id, salary, created_at)
-- departments(id, name)
```

**Solution:**

```sql
WITH dept_stats AS (
    SELECT
        u.department_id,
        COUNT(*) AS total_employees,
        ROUND(AVG(u.salary), 2) AS avg_salary,
        MAX(u.salary) AS max_salary,
        MIN(u.salary) AS min_salary
    FROM users u
    GROUP BY u.department_id
),
top_earners AS (
    SELECT
        department_id,
        name AS top_earner_name,
        salary,
        ROW_NUMBER() OVER(PARTITION BY department_id ORDER BY salary DESC) AS rn
    FROM users
)
SELECT
    d.name AS department_name,
    ds.total_employees,
    ds.avg_salary,
    ds.max_salary,
    ds.min_salary,
    te.top_earner_name
FROM departments d
INNER JOIN dept_stats ds ON d.id = ds.department_id
INNER JOIN top_earners te ON d.id = te.department_id AND te.rn = 1
ORDER BY ds.avg_salary DESC;
```

**Explanation:** We use two CTEs. `dept_stats` calculates aggregate statistics per department. `top_earners` uses ROW_NUMBER to find the highest-paid person per department. We join both CTEs with the departments table to produce the final report.

---

### Interview Tips for SQL Questions

- **Always clarify the schema** before writing the query. Ask what tables and columns are available.
- **Start simple, then optimize.** Get a working solution first, then discuss improvements.
- **Talk through your thinking.** Explain why you chose a particular approach (JOIN vs subquery, RANK vs ROW_NUMBER, etc.).
- **Consider edge cases:** What if there are NULLs? What if there are ties? What if the table is empty?
- **Mention indexes** when discussing optimization. Show that you think about performance.
- **Know multiple approaches.** If you solve it with a subquery, mention that a CTE or JOIN could also work.
- **Practice writing SQL by hand.** Many interviews use whiteboards or online editors without autocomplete.

**In short:** The most common SQL interview questions test JOINs (self-join for employee-manager), GROUP BY/HAVING (duplicates, aggregates), window functions (ranking, Nth highest), and set operations (customers who never ordered). Always have multiple solution approaches ready and be prepared to discuss trade-offs between them.

---

## Final Summary

SQL is a vast topic, but interviews tend to focus on a predictable set of concepts:

- **Fundamentals:** CRUD operations, filtering, sorting, and understanding DELETE vs TRUNCATE vs DROP
- **JOINs:** Know all six types, especially INNER, LEFT, and SELF JOIN
- **Aggregation:** GROUP BY, HAVING, and the difference between WHERE and HAVING
- **Subqueries and CTEs:** Write readable queries with WITH; understand correlated vs non-correlated subqueries
- **Window Functions:** ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, running totals
- **Optimization:** Indexes (B-tree, composite, when to use), EXPLAIN output, transaction isolation levels
- **Normalization:** 1NF through BCNF, and when to denormalize
- **Practical questions:** Second highest salary, employees earning more than managers, customers who never ordered

Master these topics and you will be well-prepared for any SQL interview question.

> For how Laravel interacts with databases using Eloquent ORM, see [Database Guide](../backend/06_database.md)
