# gruwup

TA Testing, things to keep in mind:
- Please configure a google console project with this project's SHA-1, otherwise google sign in will not work for running frontend tests
- strings.xml contains the web client id, everyone has their own so do not version control this file (use git update-index --assume-unchanged app/src/main/res/values/strings.xml)
