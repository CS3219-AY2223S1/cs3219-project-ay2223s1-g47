FROM python:3.8
WORKDIR /usr/collaboration-serivce
COPY . /usr/collaboration-service
RUN pip install -r /usr/collaboration-service/requirements.txt
COPY src ./src
CMD python -m src.main