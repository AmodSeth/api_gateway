FROM python:3.7
# Keeps Python from generating .pyc files in the container
ENV PYTHONDONTWRITEBYTECODE 1

# Turns off buffering for easier container logging
ENV PYTHONUNBUFFERED 1
ARG PROJECT=apigateway
ARG PROJECT_DIR=/var/www/${PROJECT}
RUN mkdir -p $PROJECT_DIR
WORKDIR $PROJECT_DIR
RUN pip3 install virtualenv
COPY ./requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN virtualenv --system-site-packages -p python3 /var/www/.venv
CMD ["python3", "./manage.py", "runserver",  "0.0.0.0:8000"]
