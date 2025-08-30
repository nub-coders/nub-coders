# Copy the configuration files to sites-available
sudo cp nub-coder.tech /etc/nginx/sites-available/
sudo cp build.nub-coder.tech /etc/nginx/sites-available/
sudo cp dockers.nub-coder.tech /etc/nginx/sites-available/
sudo cp api.nub-coder.tech /etc/nginx/sites-available/



# Create symbolic links in sites-enabled
sudo ln -s /etc/nginx/sites-available/nub-coder.tech /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/build.nub-coder.tech /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/dockers.nub-coder.tech /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.nub-coder.tech /etc/nginx/sites-enabled/



# Install Certbot if not already installed
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Get certificates for all domains
#sudo certbot --nginx -d nub-coder.tech -d www.nub-coder.tech -d build.nub-coder.tech -d dockers.nub-coder.tech -d api.nub-coder.tech
