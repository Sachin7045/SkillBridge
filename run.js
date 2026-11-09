import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n======================================================');
console.log('  🌉 Starting SkillBridge (Backend + Frontend)...');
console.log('======================================================\n');

// 1. Launch Backend on Port 5001
const backend = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'backend'),
  stdio: 'inherit',
  env: { ...process.env, PORT: '5001' },
  shell: true
});

// 2. Launch Frontend on Port 5173
const frontendCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const frontend = spawn(frontendCmd, ['run', 'dev'], {
  cwd: path.join(__dirname, 'frontend'),
  stdio: 'inherit',
  shell: true
});

console.log('  Backend  -> http://localhost:5001');
console.log('  Frontend -> http://localhost:5173');
console.log('  Press Ctrl+C to stop both servers.\n');

// Open browser after 2.5 seconds
setTimeout(() => {
  const openCmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(openCmd, ['http://localhost:5173'], { shell: true, stdio: 'ignore' });
}, 2500);

function cleanup() {
  console.log('\nStopping SkillBridge servers...');
  try { backend.kill(); } catch (e) {}
  try { frontend.kill(); } catch (e) {}
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
