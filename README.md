# Mail

Design a front-end for an email client that makes API calls to send and receive emails.

## Description

We were provided with a starter distribution code; a Django project called project3 containing a single app called mail. The project requirments asked that we use the provided API to get and send e-mails in a single page web application. All python was provided, but we were asked to build out the HTML, CSS and Javascript to enable logged in users to send and receive e-mails. The primary functionality includes: 

### Send email
The logged in user can click compose and a form is made visible.  The user completes the form and when clicking the save button, the data from the form is stored in the database via the API. The API provides responses (errors) if the e-mail can not be sent, or a message if it saved successfully. I used the alert function to communcate to the user if there is an error or if the e-mail sent successfully. 

### Viewing e-mail mail boxes
There are three e-mail box types.  One is for incoming e-mails (inbox), one is outgoing (sent) and the third is archived.  A user can tell if an e-mail is new (unread) if the e-mail in the list is white.  If it is gray, then the user has already read the e-mail. All e-mails for that user are found in one of the three boxes depending on status elements in the object.  

### Viewing individual e-mails
When a user clicks on an e-mail, then the list view is hidden, and the user sees a view that is specific to that one e-mail object.  The user can then see the content or body of the e-mail. 

### Enabling the user to process the e-mail further. 
There are two buttons on the single e-mail view that enable the user to either reply or archive the e-mail.  If the user is viewing the e-mail from the archive e-mail box, the second button is a un-archive button which will enable the the user to move it to the incoming e-mail box. The Reply button will take the information from the sent e-mail object and will use it to create a new e-mail object.  The recipient and subject are pre-populated as is the bodd or text of the previous e-mail.  A notification line is added to tell the user when the previous e-mail was sent and who sent it. The user can then add more text as a reply, and send it. 

### Dependencies

This project does use bootstrap, django and Javascript. I elected to add some formatting and linting capabilities and configured them to help me with proper formatting.  Any Dependencies are noted in the requirments.txt.


## Authors

Elizabeth Bradshaw
liz.bradshaw.1265@gmail.com

## Version History

This is the second release of this project. The first time, I had built most of the HTML via Javascript.  I found this to be inefficient and way too error prone.  I revised the structure and utilized the HTML file to build the majority of the structure. 


## Acknowledgments

Inspiration, code snippets, etc.
* [section notes] (https://github.com/nolaProgramierer/33a_Fall25_Section4)
* [more section notes] (https://drive.google.com/drive/folders/1wLJipkzhiZ10QdWaGQGTFFXQtfBeYZVn)
* [W3Schools - Javascript, bootstrap, HTML, CSS](https://www.w3schools.com/)
* [My Duck Buddy](https://cs50.ai/chat)
* Note: I did use Copilot to help overecome the issue where the innerhtml was blocking my HTML code structure.  I had exhausted the duck where I began going in circles with debugging with the duck and I had written the first release of this code using Javascript as a workaround.  The first release was not efficient and very error prone. I learned that the line of code:document.querySelector('#emails-view').innerHTML = `<h3>${      mailbox.charAt(0).toUpperCase() + mailbox.slice(1) }</h3>` was overwriting all the HTML that I had added inside of the e-mails-view. 
