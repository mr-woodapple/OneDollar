# One Dollar

Yet another personal finance tracker web app, focusing on simplicity and speed.

## Integrations

Currently, only "LunchFlow" is supported as an external provider to sync accounts/balance/transactions from your bank account.

## Self Hosting

To get started with self hosting, simply create a new folder, and create two files. Name the first one `compose.yaml` and copy-paste this content:

```yaml
services:
  frontend-onedollar:
    container_name: OneDollar.ReactFrontend
    image: ghcr.io/mr-woodapple/onedollar-frontend:dev
    ports:
      - ${FE_PORT:-7134}:80
    restart: unless-stopped

  backend:
    container_name: OneDollar.AspNetCoreBackend
    image: ghcr.io/mr-woodapple/onedollar-backend:dev
    environment:
      ConnectionStrings__DatabaseConnection: ${DB_CONNECTIONSTRING}
      FrontendUrl: ${FE_URL}
    depends_on:
      - sql-server
    restart: unless-stopped

  sql-server:
    container_name: OneDollar.SqlServer
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      MSSQL_SA_PASSWORD: ${DB_PASSWORD}
      ACCEPT_EULA: "Y"
    volumes:
      - sqlData:/var/opt/mssql
    restart: unless-stopped

volumes:
  sqlData:
```

Name the second one `.env`, and paste this content:

```env
# Database connection related variables
DB_CONNECTIONSTRING=Server=sql-server,1433;Database=OneDollarDatabase;User=sa;Password=<REPLACE WITH YOUR PASSWORD>;Encrypt=False;TrustServerCertificate=True
DB_PASSWORD=<REPLACE WITH YOUR PASSWORD>

# Frontend url, used for cors
FE_URL=<YOUR DOMAIN>

# The port under which the frontend should be listening
FE_PORT=7134
```

Once you're done, run `docker compose up -d` to start the app. Access the frontend under the IP address or domain you setup in the `.env` file. :)