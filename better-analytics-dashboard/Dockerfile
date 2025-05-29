FROM node:20-alpine as builder

WORKDIR /app

# Copy source files
COPY package*.json .

RUN npm install

# Copy source files
COPY . .

# Generate Prisma client
RUN npx prisma generate

RUN npm run build

FROM node:20-alpine as runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

CMD node server.js
