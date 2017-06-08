Setup
-----

#### Install python 2.7 (ensure it's added to PATH)

> https://www.python.org/downloads/

#### Install node LTS

> https://nodejs.org/en/download/

#### Install dependencies (run console as admin)

> npm i
> rmdir typings /s /q

#### Install global dependencies

> npm i gulp-cli -g

#### Setup livereload certificate

Generate SHA-2 certificate:

> mkdir webpack\https
> cd webpack/https
> openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days [a reasonable # of days]

You can skip all fields except the "Common Name (e.g. server FQDN or YOUR name)". This is your hostname ("localhost")
Generate a pfx file from the public and private key files (set password to "password"):

> openssl pkcs12 -name [your FQDN entered above] -inkey key.pem -in cert.pem -export -out cert.pfx

Return to root dir

> cd ../../

Add certificate to trusted root certificates:

* Open Microsoft Management Console (mmc)
* File -> "Add/Remove Snap-in..."
* Add "Certificates" snap-in
* Select "Computer account" then "Local computer"
* Expand "Certificates" -> "Trusted Root Certification Authorities" -> "Certificates"
* Under "Actions" in sidebar (Or right-click in window) Navigate "All Tasks" -> "Import..."
* Find your pfx file in folder it was saved, enter the password
* Finish dialog

#### Build

> npm run dev