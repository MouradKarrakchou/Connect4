echo "Starting Docker containers: Node and MongoDB"

echo "---------------------RM------------------------"
docker image rm -f ps8-2023-puissance4quarts_nodejs
echo "--------------------BUILD----------------------"
docker-compose build
echo "---------------------UP------------------------"
docker-compose up 

echo "Stopping Docker containers: Node and MongoDB"
read -p "Press any key to quit ..."