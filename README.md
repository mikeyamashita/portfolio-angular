portfolio crud app
A basic crud app learning and testing the latest features of angular 18, ngrx signals, view transitions api, zoneless, reactive forms, material design 3, and standalone components

Also setting up and connecting to a .net 8 webapi with identity authentication and authorization and postgres db in a docker container


azure hosted demo: https://orange-desert-0bb93bb0f.5.azurestaticapps.net/


//build docker image
docker build -t portfolio-angular .     

//publish container
docker run -p 4201:4200 --name portfolio-angular-container portfolio-angular
