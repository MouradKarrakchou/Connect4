echo "Starting Docker containers: Node and MongoDB"

docker-compose down
git pull
docker image rm -f ps8-2023-puissance4quarts_nodejs
docker-compose build
docker-compose up -d
