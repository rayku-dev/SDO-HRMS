echo "Switching to branch main"
git checkout main

echo "Installing dependencies..."
npm install

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r dist package.json .env junebence@172.16.0.25:/srv/test-server/hrms/

echo "Installing dependencies on server..."
ssh junebence@172.16.0.25 "cd /srv/test-server/hrms && npm install --production"

echo "Starting app with PM2..."
ssh junebence@172.16.0.25 "cd /srv/test-server/hrms && pm2 start dist/main.js --name nestjs-app"

echo "Backend Has Been Deployed Successfully!"
