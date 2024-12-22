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



If you make changes to the model.py file, then delete the 1st and 3rd files in the migrations folder (found in the myapp folder) and run python manage.py makemigrations again!

If you want to delete the data from database then delete the db.sqlite3 file from the root directory(cd myproject2). You now have fresh/empty database now.  


PASSWORD NEEDS TO BE 8 CHARACTERS LONG!


Before running npm start, paste the build folder (from the frontend folder) into the static folder found in myproject2 folder.




