# Question service

This microservice is intended to be a simple interface that handles storing and providing questions.

## Getting set up

Install dependencies, then run with `npm`

From `question-service/`:

```
npm install
num run dev # dev environment
npm start # in producition
```

## Running docker container

If no active development work is being done, you could simply run it as a safe container on its own using `docker-compose`.

```
docker-compose up --build --remove-orphans question-service
```

And you should see the service running on `localhost:8002`.

## Running tests for development

TODO (no real rigorous testing as been done)
