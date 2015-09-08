Project Cony
==========

Project Cony is designed to be a set of home applications running on Raspberry Pi2 hardware. Its features range will be kept expanding as more ideas are added to the project. The ultimate goal is to have you home at your side as a living character to help you in the ways you like it to be.

--------------------------

Introduction
--------
Project Cony is primarily motivated by passion. We do hear about IT and technology advancement every day. However it either takes very long time to appear in our living or it is not coming at all. Every day we will have different kinds of dreams starting with "it will be nice". For instance, "it will be nice" that someone can play me a music to great me when I finally reach my sweet home after a tiring day. The dream I have in mind is that, "it will be nice" that all my dreams can come true with a bit help from technologies.
##Motivation
- To show off capabilities of a coder
- To have a better living experience
##Ideas
This section will have ideas from different people listed below. Each idea will be assessed by similarity and may be grouped under a bigger application. All ideas will have the same documentation structure. 
###0. Voice
####Dream
I would like to have a device read me some information while I am busy with something else. 
####Requirement
- Accurate and clear pronunciation 
- Hopefully I can have a list of voice to choose from
####Implementation
Version 0.X of the project will start with Google translation API service. This is an unofficial library which may involve some hacking around. Currently I am using a shell script return by Dan Fountain with reference to [his blog][1]. 
>**Updates:** 

>- *2015-09-08*:  Original Google TTS translate API no longer works as per normal. Extra parameter (&client=t) is needed to append at the end of the requesting URL.

###1. Bus Checker
####Dream
I would like to know when some specific buses are coming at 7:30 in the morning or on my demand. 
####Requirement
- Choose from a list of near by bus stops for selection and save my favourite one
- Choose from a list of buses given a bus stop number and save my favourite one
- Able to set a schedule timer for broadcasting
- Able to provide immediate arriving time and next arriving time
- Automatically repeat once after first broadcasting

####Implementation
#####Inputs
#####Outputs

###2. Events Checker
####Dream
I would like to know the upcoming events and holidays from my Google calendar at the start of my day so that I can plan them ahead.



> Written with [StackEdit](https://stackedit.io/).

[1]:http://danfountain.com/2013/03/raspberry-pi-text-to-speech/