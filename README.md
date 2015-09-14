Project Cony
======
##Intruduction
Project Cony is a self-initiated project just for fun. Seriously, it is for fun! It aims to boost our home living experience with an expanding range of fun features.

##Features

###Voice Assistant
The main idea is to feed the information to our ears. Currently I am using unofficial Google Translate Text-To-Speech (tts) API. But recently Google just updated it without any notification. Can't really blame them since the APIs are 'unofficial'. 

###Bus Checker
Hmm, the idea is to have the system checking for arrival time of my frequent-taking buses automatically on schedule. The library is using APIs provided by Land Transport Authority of Singapore. So it only works for Singapore public transport for now. They have been doing a good job to make them available. But, as IT systems always are, sometimes the APIs are just not working. 

>**Speech Format**
>Greetings, Bus [*] is arriving (in * minutes). * minutes later bus [] will arrive. * minutes later bus [] will arrive. ... hope it helps!

###Google News Checker
(Under construction)

###Google Calendar Checker
(Under construction)

##Installation
Clone the project and run
```
npm install
```
Create local copies of the configuration files 'config.json.local & client_secret.json.local' and update relevant API keys in these local copies.

##Testing
Tests are implemented using mocha and chai. chai is already listed in package.json. You need to run
```
(sudo) npm install -g mocha
```
before running any tests using
```
mocha
```


> Written with [StackEdit](https://stackedit.io/).