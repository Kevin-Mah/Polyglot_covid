# cmpt383_project: Coronovirus Case Information
A program that displays Canadian covid-19 information, trends, and statistics. The site is a way to display 
worldwide covid information and a focus on Canada. It shows the trend and comparisons between major provinces.
There is also a comparison with fatalities, smoking, and age to see if there is any correlation.
The site features and interactive map and charts that display information.

# Programming languages
- Javascript for the front end.
- Python for the back end server.
- Go for getting online data, processing the data, and making calculations concurrently.

# Inter-language communication methods
The python rpc server upon startup makes a system call to run the go program and then listens to requests to send the javascript.
The go program retrieves and processes online information and creates json files that are read in the javascript.

# Deployment technology
Vagrant VM

# How to Use
If this is the first build then run in command line

vagrant up

This will start up the vm and run the provisions. The server should be up and running. If the vm has already been built and
this is a subsequent vagrant up then run in command line

vagrant up --provision

Then in any browser access http://127.0.0.1:8080/ to access the site.





