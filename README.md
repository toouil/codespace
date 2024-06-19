## Installation

```bash
# Clone this repository
$ git clone https://github.com/toouil/codespace.git codespace

# Go into the codespace
$ cd ghostman

# Clone .env.example file to .env
$ copy .env.example .env
```

edit the .env file (ex: app name, database...)

```bash
# Install dependencies
$ npm install
$ composer install

# If there are problems installing composer dependencies .. try :
$ composer update

# Generate app key
$ php artisan key:generate
```

Start your mySql server

```bash
# Run migrations
$ php artisan migrate

# Run the app
$ npm run dev
$ php artisan serve
```
Open your browser and visit http://localhost:8000 to use the application.

🚨 Note : Not complete yet !