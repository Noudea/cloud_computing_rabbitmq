#!/bin/bash


apt-get update && apt-get install -y netcat

# wait rabbitmq service
while ! nc -z ampq_rabbitmq 5672; do
  echo 'waiting for rabbitmq container...'
  sleep 1
done
