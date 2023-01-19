#!/bin/bash


apt-get update && apt-get install -y netcat

# wait rabbitmq service
while ! nc -z ampq_rabbitmq 5672; do
  echo 'waiting for rabbitmq container...'
  sleep 1
done

# wait mongodb service
while ! nc -z ampq_mongodb 27017; do
  echo 'waiting for mongodb container...'
  sleep 1
done
