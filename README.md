# PMP

since sqlite is already installed

open project folder


open three terminal

1. in prof_frontend
do:

npm install

npm run build

set PORT=3001 && npm start



2.in stud_frontend
do:

npm install

npm run build

set PORT=3001 && npm start




3.in the root directory
do:

python manage.py makemigrations

python manage.py migrate

python manage.py runserver



If you want to delete the data from database then delete the db.sqlite3 file from the root directory. You now have fresh database


Before running npm start for both the react interfaces, paste the build files in their respective folders in the static folder which can be found in the root directory.




