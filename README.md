# express-chat
Local area chat application

# prerequiste
NodeJS should be installed on each machine.

# installation
Run "npm install" to install all dependencies.

Run "node central.js" on central machine server. Update free ports accordingly on config/config.json central port.

update hostname of central machine server in config/config.json, hostname will be printed on console.

Run "node index.js" on each network machine to access chat application at (http://localhost:3000/index). 

Note: Run above script on atleast two machines to see online friends.

# use
Click on newtork machine name on online friends section to start chat.

# functionality
Machine status, typing status and timestatmp will be shown in chat section.

Chats from other machine will be preserved if active chats machine is different.

Machine will be removed from online friend section if that machine server goes down.
