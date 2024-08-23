BIN=./env/bin/
sources = apps/


.PHONY: install


run:
	$(BIN)python ./ticketsystem/manage.py runserver 0.0.0.0:8000


m:
	$(BIN)python ./ticketsystem/manage.py migrate

mm:
	$(BIN)python ./ticketsystem/manage.py makemigrations


superuser:
	$(BIN)python ./ticketsystem/manage.py createsuperuser