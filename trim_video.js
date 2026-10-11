const ffmpeg = require('ffmpeg-static');
const { spawnSync } = require('child_process');

const inputVideo = process.argv[2];
const outputVideo = process.argv[3];
const duration = process.argv[4] || '24';

const args = [
  '-y',
  '-i', inputVideo,
  '-t', duration,
  outputVideo
];

console.log(`Running: ${ffmpeg} ${args.join(' ')}`);
const result = spawnSync(ffmpeg, args, { stdio: 'inherit' });
if (result.error) {
  console.error(result.error);
  process.exit(1);
}
process.exit(result.status);
