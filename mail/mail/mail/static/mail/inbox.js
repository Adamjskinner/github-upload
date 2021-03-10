document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  
  // By default, load the inbox
  load_mailbox('inbox');

  // Watch for form submission
  const form = document.getElementById('compose-form');
  form.addEventListener('submit', send_email);

});

// Watch the submit button
function send_email(event) {
  event.preventDefault();
  console.log("Send Mail");   
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;
  
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: recipients,
      subject: subject,
      body: body
      })
    })
  .then(response => response.json())
  .then(result => {
  console.log(results);
  });

  load_mailbox('inbox');
}

function compose_email() {
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
 
  // remove any previous data
  var emailsexist = document.getElementById("emails");
  if (typeof(emailsexist) != 'undefined' && emailsexist != null){
    emailsexist.innerHTML = '';
    emails.remove();
  }

  // Check mailbox called
    // Get mailbox content
    fetch('/emails/'+ mailbox)
      .then(response => response.json())
      .then(emails => {

      // ... do something else with emails ...
        createtable(emails);
  });
}

function createtable(tableData){

  var emails = document.createElement('div');
  emails.classList.add("container");
  emails.setAttribute("id", "emails");
  
  tableData.forEach(function(rowData) {
    sender = rowData["sender"]
    subject = rowData["subject"]
    time = rowData["timestamp"]
    read = rowData["read"]
    id = rowData["id"]

    var email = document.createElement('div');
    email.classList.add("row","border","border-dark");
    email.setAttribute("id", id);
    email.setAttribute("onclick", "get_email(" + id + ")");

    var sendercell = document.createElement('div');
    sendercell.classList.add("col-sm");
    sendercell.innerHTML = sender;
    email.appendChild(sendercell);

    var subjectcell = document.createElement('div');
    subjectcell.classList.add("col-sm");
    subjectcell.innerHTML = subject;
    email.appendChild(subjectcell);

    var timecell = document.createElement('div');
    timecell.classList.add("col-sm");
    timecell.innerHTML = time;
    email.appendChild(timecell);
    
    if (read == true){
      email.classList.add("bg-secondary");
    }

    emails.appendChild(email);
  });

  document.querySelector("#emails-view").appendChild(emails);
}

function get_email(id, mailbox) {
  console.log(mailbox);
  // Show the email and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  // Get mailbox content
  fetch('/emails/'+ id)
    .then(response => response.json())
    .then(email => {

    toggle_email(id,'read','true');
    show_email(email, mailbox);
  });
}

function show_email(email, mailbox){
  // take the results from the get_email call and present them on screen

  // remove any previous data
  var emailexist = document.getElementById("email-view");
  if (typeof(emailexist) != 'undefined' && emailexist != null){
    emailexist.innerHTML = '';
  }


  recipient = email["recipients"]
  sender = email["sender"]
  subject = email["subject"]
  time = email["timestamp"]
  read = email["read"]
  id = email["id"]
  body = email["body"]
  archived = email["archived"]

  var emailSection = document.createElement('div');
  //emails.classList.add("container");
  emailSection.setAttribute("id", "email");
  document.querySelector("#email-view").appendChild(emailSection);

  var emailHeader = document.createElement('div');
  //emails.classList.add("container");
  emailHeader.setAttribute("id", "emailheader");
  emailSection.appendChild(emailHeader);

  var sendercell = document.createElement('div');
  //sendercell.classList.add("col-sm");
  sendercell.innerHTML = 'From: ' + sender;
  emailHeader.appendChild(sendercell);
  
  var recipientcell = document.createElement('div');
  //recipientcell.classList.add("col-sm");
  recipientcell.innerHTML = 'To: ' + recipient;
  emailHeader.appendChild(recipientcell);

  var subjectcell = document.createElement('div');
  //subjectcell.classList.add("col-sm");
  subjectcell.innerHTML = 'Subject: ' + subject;
  emailHeader.appendChild(subjectcell);

  var timecell = document.createElement('div');
  //timecell.classList.add("col-sm");
  timecell.innerHTML = 'Timestamp: ' + time;
  emailHeader.appendChild(timecell);

  var source = document.getElementsByTagName("h3")[0].innerHTML;
  if (source == 'Inbox'){
  // Set Buttons for Reply and acrhive
  var replyButton = document.createElement('button');
  replyButton.classList.add("btn", "btn-sm", "btn-outline-primary");
  replyButton.setAttribute("id","reply");
  replyButton.innerHTML = "Reply";
  emailHeader.appendChild(replyButton);

  // Use buttons to reply or archive
 document.querySelector('#reply').addEventListener('click', () => reply(id));  

}

  if (source == 'Inbox'||source == 'Archive'){
  var archiveButton = document.createElement('button');
  archiveButton.classList.add("btn", "btn-sm", "btn-outline-primary");
  archiveButton.setAttribute("id","archive");
  
  if (archived == false){
    archiveButton.innerHTML = "Archive";
    archiveAction = 'true';
  }
  else{
    archiveButton.innerHTML = "Unarchive";
    archiveAction = 'false';
  }
  emailHeader.appendChild(archiveButton);

 // Use buttons to reply or archive
 document.querySelector('#archive').addEventListener('click', () => toggle_email(id,'archive',archiveAction));
  }

  // Close section
  var headerrow = document.createElement('hr');
  emailHeader.appendChild(headerrow);

  var emailBody = document.createElement('div');
  //emails.classList.add("container");
  emails.setAttribute("id", "emailbody");
  emailSection.appendChild(emailBody);

  var bodycell = document.createElement('div');
  //timecell.classList.add("col-sm");
  bodycell.innerHTML = body;
  emailBody.appendChild(bodycell);
  emailSection.appendChild(emailBody);
 
}

function toggle_email(id,toggleType,toggleValue) {
  // call the api with the ID and pass in either 'read' or 'archive'
  // and true or false to switch the read/unread status and the archived status 

  value = toggleValue == 'true';

  if (toggleType == 'read') {
    fetch('/emails/'+ id, {
      method: 'PUT',
      body: JSON.stringify({
        read: value
      })
    })
  }
  else {
    fetch('/emails/'+ id, {
      method: 'PUT',
      body: JSON.stringify({
        archived: value
      })
    })
    load_mailbox('inbox')
  }

}

function reply(id){
  compose_email();

  fetch('/emails/'+ id)
  .then(response => response.json())
  .then(email => {
 
  document.querySelector('#compose-recipients').value = email["sender"];
  document.querySelector('#compose-subject').value = "Re: " + email["subject"];
  document.querySelector('#compose-body').value = email["timestamp"] + " " + email["sender"] + " wrote: " + email["body"];
});
}