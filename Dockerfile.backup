FROM node:24-bookworm-slim

# Install Python and PostgreSQL build/runtime prerequisites
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    python3-pip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install backend dependencies
COPY backend/express/package.json backend/express/package-lock.json ./backend/express/
WORKDIR /app/backend/express
RUN npm ci

# Copy backend source and Prisma migrations/schema
COPY backend/express/ ./

# Generate Prisma Client and compile TypeScript
RUN npx prisma generate
RUN npm run build

# Install Python dependencies
WORKDIR /app
COPY ai/requirements.txt ./ai/requirements.txt
RUN pip3 install --break-system-packages --no-cache-dir -r ai/requirements.txt

# Copy the AI code and its saved model/data
COPY ai/ ./ai/

ENV NODE_ENV=production
ENV PYTHON_PATH=python3
ENV PORT=10000

EXPOSE 10000

WORKDIR /app/backend/express

CMD ["sh", "-c", "node dist/server.js"]