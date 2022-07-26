# gruwup

Login branch, things to keep in mind:
- do not add "local.properties" to git; everyone has their own as it is dependent on your file path (git rm --cached local.properties)
- make sure to configure a google console project with this project's SHA-1, otherwise google sign in will not work
- strings.xml contains the web client id, everyone has their own so do not version control this file (use git update-index --assume-unchanged app/src/main/res/values/strings.xml)

Current Bugs
- Chat doesn't show up for adventures a user has been accepted to
- Request fragment doesn't immediately display "no requests" text after all requests have been managed
