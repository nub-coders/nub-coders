# Install Certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificates for all domains
#sudo certbot --nginx -d nub-coder.tech -d www.nub-coder.tech -d build.nub-coder.tech -d dockers.nub-coder.tech -d api.nub-coder.tech
