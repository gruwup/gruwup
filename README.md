# Gruwup

Let us say you are traveling to Toronto alone and would love to connect with someone new over
the flight. Most social media sites such as FaceBook, Instagram focus on connecting with
people one already knows. Thus it is difficult to find new pals with similar plans, interests and
availability. Our project aims to solve this problem by allowing adventure/destination based
searching, filtering and matching for users to find friends with the same availability and interests.
Our target audience are people from all walks of life who are looking to find someone to do
something together. We plan to offer a slick UI, adventure filtering, and auto-schedule-checking
to find ideal adventures for each user. Hence using our app, you can post adventures to/at
certain destinations (like flight to Toronto) and others can find them by discovering or filtering the
location, date and time of the adventure.

## Figma illustrations for the main screens of our app

Below is Figma illustrations for the two main screens of our app.

<img width="478" alt="Screen Shot 2023-05-03 at 11 09 23 PM" src="https://user-images.githubusercontent.com/70575969/236124485-f5c678a0-4e0f-497d-8cf9-36980e93a98e.png">


## Use case diagram 

<img width="488" alt="Screen Shot 2023-05-03 at 11 09 32 PM" src="https://user-images.githubusercontent.com/70575969/236124502-9d8f0672-0809-44d0-8693-736c71475659.png">




Testing, things to keep in mind:
- Please configure a google console project with this project's SHA-1, otherwise google sign in will not work for running frontend tests
- strings.xml contains the web client id, everyone has their own so do not version control this file (use git update-index --assume-unchanged app/src/main/res/values/strings.xml)
