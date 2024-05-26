#!/bin/bash

mkdir -p /etc/prometheus/targets

# Get the list of running server containers
containers=$(docker ps --filter "name=server" --format '{{.Names}}')

# Create a target file for each container
for container in $containers; do
  ip=$(docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $container)
  echo "{\"targets\":[\"$ip:3000\"]}" > /etc/prometheus/targets/$container.json
done