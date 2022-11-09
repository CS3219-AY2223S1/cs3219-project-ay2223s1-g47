# Matching service

This microservice handles the matching of users given some criteria.

## Getting set up

Install dependencies, then run with `npm`

From `matching-service/`

1. We need `rabbitmq` and `collaboration-service` to be running. Let's use the docker container.

From `/`, run `docker-compose up --build collaboration-service rabbitmq`.

2. Then, to start the matching service, install the dependencies then run it.

```
npm ci
npm start
```

## Running as a docker container

If no active development work is being done, you could simply run it as a safe container on its own using `docker-compose`.

```
docker-compose up --build --remove-orphans matching-service
```

And you should see the service running on `localhost:8001`.
