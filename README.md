# PMP

since sqlite is already installed

open project folder myproject2


open 2 terminals

1. in cd frontend
do:

npm install

npm run build

npm start


3. in the root directory (cd myproject2)
do:

python manage.py makemigrations

python manage.py migrate

python manage.py runserver



If you want to delete the data from database then delete the db.sqlite3 file from the root directory(cd myproject2). You now have fresh database. 


PASSWORD NEEDS TO BE 8 CHARACTERS


Before running npm start for both the react interfaces, paste the build files in their respective folders in the static folder which can be found in the root directory.




