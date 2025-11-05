import { createApp } from './app';

const app = createApp();
const port = Number(process.env.PORT || 4100);

app.listen(port, () => {
  const publicUrl = process.env.PUBLIC_BACKEND_URL || `http://localhost:${port}`;
  const corsOrigins =
    process.env.CORS_ALLOWED_ORIGINS ||
    process.env.WEB_ORIGINS ||
    process.env.WEB_ORIGIN ||
    'http://localhost:3000';

  console.log(`� API server ready on ${publicUrl}`);
  console.log(`�📡 CORS allow list: ${corsOrigins}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Database: ${process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}`);
});
