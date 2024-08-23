#!/bin/bash
set -e



cd /home/marcus/ticketsystem-2024/

git clean -f
git reset --hard HEAD
git pull origin main

# Send commit message to discord
commit=$(git log -1 --pretty=format:'%h %cn: %s%b' $newrev)

/home/marcus/ticketsystem-2024/backend/env/bin/python -m pip install -r backend/requirements.txt --no-input

/home/marcus/ticketsystem-2024/backend/env/bin/python backend/ticketsystem/manage.py clean_pyc
/home/marcus/ticketsystem-2024/backend/env/bin/python backend/ticketsystem/manage.py clear_cache


/home/marcus/ticketsystem-2024/backend/env/bin/python -m pip install --upgrade pip setuptools --no-input

/home/marcus/ticketsystem-2024/backend/env/bin/python backend/ticketsystem/manage.py makemigrations
/home/marcus/ticketsystem-2024/backend/env/bin/python backend/ticketsystem/manage.py migrate

sudo systemctl restart ticketsystem
