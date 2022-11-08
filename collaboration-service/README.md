# Collaboration service

The responsibilities of the collaboration service are to manage everything to do with the usage of rooms. That means CRUD operations as well as maintaining live socket connections between multiple users in the room.

## Running as a containerized service

Edit the environment variables in the `docker-compose` file as needed, and then run:

```
docker-compose up --build collaboration-service
```

## Development and testing

1. Install the necessary dependencies

Create a virtual environment and install the dependencies.

```
pyenv virtualenv env
pyenv activate env
pip install -r requirements.txt
```

2. Running the application

Run the application as a module. It will auto-reload as files change.

```
python -m src.main
```

3. Adding and Running tests

We use `pytest` as the test framework.

To add tests, automated test discovery in `pytest` works by prefixing your files and methods with `test_`.

To run tests, do

```
pytest
```
