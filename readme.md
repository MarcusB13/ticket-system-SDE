### Backend

`psql postgres`

```
CREATE USER ticketsystem WITH PASSWORD 'ticketsystem';
ALTER ROLE ticketsystem SUPERUSER;
CREATE DATABASE ticketsystem;
GRANT ALL PRIVILEGES ON DATABASE ticketsystem TO ticketsystem;
\q
```