FROM gitpod/workspace-postgres

RUN git clone https://github.com/devrimgunduz/pagila.git /workspace/pagila

RUN createdb -U gitpod pagila

RUN psql -U gitpod pagila < pagila-schema.sql

RUN psql -I gitpod pagila < pagila-data.sql