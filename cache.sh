#!/bin/bash
sudo su
# Stop and remove all running and stopped containers
docker container stop $(docker container ls -q) 2>/dev/null
docker container rm $(docker container ls -a -q) 2>/dev/null

# Remove all images
docker image rm $(docker image ls -q) 2>/dev/null

# Remove all volumes
docker volume rm $(docker volume ls -q) 2>/dev/null

# Remove all networks
docker network rm $(docker network ls -q) 2>/dev/null

# Clean up dangling images, containers, volumes, and networks
docker system prune -a -f --volumes

echo "Docker cleanup completed."
