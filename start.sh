echo "Starting Docker containers: Node and MongoDB"

docker-compose build
docker-compose up
echo "Stopping Docker containers: Node and MongoDB"
read -p "Press any key to quit ..."