import mysql.connector

# Database connection
conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='',
    database='cx_maturity_framework'
)
cursor = conn.cursor()

# Read and execute SQL migration
with open('sql/create_llm_cache_table.sql', 'r') as f:
    sql = f.read()

# Split SQL into individual statements
statements = [stmt.strip() for stmt in sql.split(';') if stmt.strip()]

for statement in statements:
    if statement:
        cursor.execute(statement)

conn.commit()

print('Migration executed successfully')

cursor.close()
conn.close()