// Global Variables
let currentEmailId = null

document.addEventListener('DOMContentLoaded', function () {
    // Use buttons to toggle between views
    document
        .querySelector('#inbox')
        .addEventListener('click', () => load_mailbox('inbox'))
    document
        .querySelector('#sent')
        .addEventListener('click', () => load_mailbox('sent'))
    document
        .querySelector('#archived')
        .addEventListener('click', () => load_mailbox('archive'))
    document.querySelector('#compose').addEventListener('click', compose_email)
    document
        .querySelector('#archive-btn')
        .addEventListener('click', function () {
            if (currentEmailId) {
                archive_email(currentEmailId)
            }
        })
    document
        .querySelector('#unarchive-btn')
        .addEventListener('click', function () {
            if (currentEmailId) {
                unarchive_email(currentEmailId)
            }
        })
    document.querySelector('#reply-btn').addEventListener('click', function () {
        if (currentEmailId) {
            compose_reply(currentEmailId)
        }
    })

    // Event listener for the compose e-mail send button
    // Per the duck, this calls the function with the event as the argument.
    // This allows access to information about the event and preventing default behavior.
    document
        .querySelector('#compose-form')
        .addEventListener('submit', event => {
            send_email(event)
        })

    // By default, load the inbox
    load_mailbox('inbox')
})
// --------------------------- Compose EMail Process ------------------------//
// sets the display, clears out fields //
function compose_email() {

    // Show compose view and hide other views
    show_compose()

    // Clear out composition fields
    document.querySelector('#compose-recipients').value = ''
    document.querySelector('#compose-subject').value = ''
    document.querySelector('#compose-body').value = ''
}

// updates the compose form with data from the e-mail using ID passed in.
async function compose_reply(id) {
    // Show compose view and hide other views
    show_compose()
    let email = await getEmail(id)

    // Updates composition fields
    // creates a variable for the message above the new message.
    responseInfo = 'On ' + email.timestamp + ' ' + email.sender + ' wrote: '

    // sets the values for the display of the e-mail.
    newBody = '\n'
    newBody += '\n'
    newBody += responseInfo
    newBody += '\n'
    newBody += email.body
    document.querySelector('#compose-recipients').value = email.sender
    document.querySelector('#compose-subject').value = email.subject
    document.querySelector('#compose-body').value = newBody

    // Sets focus for user experience to start typing in the top of the screen.
    document.querySelector('#compose-body').scrollTop = 0
    document.querySelector('#compose-body').focus()
}

function getEmail(id) {
    let url = '/emails/' + id
    return fetch(url)
        .then(response => response.json())
        .then(email => {
            return email
        })
}

// Gets data from the form
send_email = event => {
    // Prevent form submission
    event.preventDefault()

    // Get information from the form
    const recipients = document.querySelector('#compose-recipients').value
    const subject = document.querySelector('#compose-subject').value
    const body = document.querySelector('#compose-body').value

    createEmail(recipients, subject, body)
}
// Post data to the db
function createEmail(recipients, subject, body) {
    fetch('/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            recipients: recipients,
            subject: subject,
            body: body,
        }),
    })
        .then(response => response.json())
        .then(result => {
            // Error handling
            if (result.error)
                switch (result.error) {
                    default:
                        alert(result.error)
                        break
                    case 'At least one recipient required.':
                        alert('At least one recipient required.')
                        break
                }
            if (result.message) {
                if (result.message === `Email sent successfully.`) {
                    load_mailbox('sent')
                }
            }
        })
}
// --------------------------- View Lists of Emails Processes ---------------//
// Sets the e-mail views, gets the emails
function load_mailbox(mailbox) {
    // Variables to assign the location to pull the e-mails.
    const mb_type = mailbox
    let url = '/emails/' + mb_type

    // Show the mailbox and hide other views
    show_mailbox()

    // Avoids duplicating lines with multiple clicks
    document.querySelector('#list-of-emails').innerHTML = ''

    // Show the mailbox name
    // previous code using innerhtml broke my code!
    // I want to use html for much of the structure and change only
    // what I need to with javascript.
    document.querySelector('#mailbox-title').textContent =
        mailbox.charAt(0).toUpperCase() + mailbox.slice(1)

    // Get e-mails of this type
    fetch(url)
        .then(response => response.json())
        .then(emails => {
            // send to view the list
            format_mailbox(emails)
        })
}

// Creates rows for each e-mail in the list using a forEach loop
function format_mailbox(emails) {
    const startDiv = document.querySelector('#list-of-emails')

    // Email List Container
    emDiv = document.createElement('div')
    emDiv.setAttribute('id', 'emailsList')
    startDiv.appendChild(emDiv)

    // Format list of emails
    emails.forEach((email, emailIndex) => {
        // Create the row
        rowDiv = document.createElement('div')
        rowDiv.setAttribute('id', emailIndex + 1)
        rowDiv.classList.add('row', 'rowStyle')
        rowDiv.addEventListener('click', function () {
            load_email(email.id)
        })
        if (email.read) {
            rowDiv.classList.add('readStyle')
        } else {
            rowDiv.classList.add('unreadStyle')
        }

        // Add the row to the container
        emDiv.appendChild(rowDiv)

        columns = [3, 6, 3]
        columns.forEach((column, colIndex) => {
            // Variables
            colClass = 'col-' + column
            switch (colIndex) {
                case 0:
                    text = email.sender
                    colStyle = 'colFrom'
                    colAlign = 'text-left'
                    break
                case 1:
                    text = email.subject
                    colStyle = 'colSubject'
                    colAlign = 'text-left'
                    break
                case 2:
                    text = email.timestamp
                    colStyle = 'colTimestamp'
                    colAlign = 'text-right'
            }
            colDiv = document.createElement('div')
            colDiv.setAttribute('id', emailIndex + '-' + (colIndex + 1))
            colDiv.classList.add(colClass, colStyle, colAlign)
            colDiv.textContent = text
            rowDiv.appendChild(colDiv)
        })
    })
}

// --------------------------- View Single Email Processes ------------------//
// gets the data from the click event on the email list page
function load_email(id) {
    let url = '/emails/' + id
    fetch(url)
        .then(response => response.json())
        .then(email => {
            // Update the value of read to true
            read_email(id)
            // Print email
            format_email(email)
        })
}

// formats the view page
function format_email(email) {
    // Hide the e-mail list or compose (if open)
    show_single()
    // manages archive (default not archived)
    show_if_not_archived()
    if (email.archived === true) {
        show_if_archived()
    }
    // Updates the global variable
    currentEmailId = email.id

    // use getElementByID to populate the email structure.
    headers = ['sender', 'recipients', 'subject', 'timestamp', 'body']
    headers.forEach(header => {
        // If this e-mail was a reply, causes the responses to be stacked
        // not all concatenated into one long line.
        if (header === 'body') {
            document.getElementById(header).innerHTML = email[header].replace(
                /\n/g,
                '<br>'
            )
        } else {
            document.getElementById(header).innerHTML = email[header]
        }
    })
}

// --------------------------- Helper Functions -------------------------//
async function archive_email(id) {
    let url = '/emails/' + id
    await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true,
        }),
    })
    load_mailbox('inbox')
}

function read_email(id) {
    let url = '/emails/' + id
    fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            read: true,
        }),
    })
}

async function unarchive_email(id) {
    let url = '/emails/' + id
    await fetch(url, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false,
        }),
    })
    load_mailbox('archive')
}

function show_compose() {
    document.querySelector('#emails-view').style.display = 'none'
    document.querySelector('#compose-view').style.display = 'block'
}

function show_single() {
    document.querySelector('#emails-view').style.display = 'block'
    document.querySelector('#single-email').style.display = 'block'
    document.querySelector('#compose-view').style.display = 'none'
    document.querySelector('#list-of-emails').style.display = 'none'
    document.querySelector('#mailbox-title').style.display = 'none'
}
function show_mailbox() {
    document.querySelector('#emails-view').style.display = 'block'
    document.querySelector('#list-of-emails').style.display = 'block'
    document.querySelector('#mailbox-title').style.display = 'block'
    document.querySelector('#compose-view').style.display = 'none'
    document.querySelector('#single-email').style.display = 'none'
}
function show_if_archived() {
    document.querySelector('#unarchive-btn').style.display = 'block'
    document.querySelector('#archive-btn').style.display = 'none'
}

function show_if_not_archived() {
    document.querySelector('#unarchive-btn').style.display = 'none'
    document.querySelector('#archive-btn').style.display = 'block'
}
