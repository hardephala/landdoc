docker build -t land-docs:latest .
docker run -d -p 80:3000 --name land-docs land-docs:latest