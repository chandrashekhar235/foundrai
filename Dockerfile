FROM python:3.13-slim-bookworm

# Install Node.js 24 and npm
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    && mkdir -p /etc/apt/keyrings \
    && curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
       | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg \
    && echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_24.x nodistro main" \
       > /etc/apt/sources.list.d/nodesource.list \
    && apt-get update \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Express backend dependencies
COPY backend/express/package.json backend/express/package-lock.json ./backend/express/

WORKDIR /app/backend/express
RUN npm ci

# Copy backend source and Prisma configuration
COPY backend/express/ ./

# Generate Prisma Client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# Install Python AI dependencies
WORKDIR /app
COPY ai/requirements.txt ./ai/requirements.txt
RUN python -m pip install --no-cache-dir -r ai/requirements.txt

# Copy AI code, model, and datasets
COPY ai/ ./ai/

ENV NODE_ENV=production
ENV PYTHON_PATH=python
ENV PORT=10000

EXPOSE 10000

WORKDIR /app/backend/express

CMD ["sh", "-c", "node dist/server.js"]
