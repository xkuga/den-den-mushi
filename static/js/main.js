$(function() {
  var socket = io();
  var sent = false;

  var $msgTextArea = $('#msg-text-area');
  var $loginPage = $('#login-page');
  var $chatPage = $('#chat-page');
  var $usernameInput = $('.username-input');

  $usernameInput.focus();

  $loginPage.click(function () {
    $usernameInput.focus();
  });

  $usernameInput.keyup(function(e) {
    if (e.keyCode == 13) {
      var name = $usernameInput.val().trim();

      if (name) {
        socket.emit('user join', JSON.stringify({username: name}));
        $loginPage.hide();
        $chatPage.show();
        $msgTextArea.focus();
        document.title +=  ' - ' + name;
      } else {
        alert('Please input a name');
      }
    }
  });

  $('form').submit(function() {
    sendMessage();
    return false;
  });

  socket.on('user join', function(data) {
    data = JSON.parse(data);
    updateUserList(data.users);
  });

  socket.on('user left', function(data) {
    data = JSON.parse(data);
    updateUserList(data.users);
  });

  socket.on('chat msg', function(data) {
    data = JSON.parse(data);

    var table = '';

    table += '<table>';
    table += '<tr>';
    table += '<td rowspan="2" style="vertical-align: top;">';
    table += '<img src="%(avatar)s" />';
    table += '</td>';
    table += '<td class="meta">%(username)s - %(time)s</td>';
    table += '</tr>';
    table += '<tr class="bubble me"><td><pre>%(msg)s</pre></td></tr>';
    table += '</table>';

    table = sprintf(table, data);

    $('#chat').append($('<li>').html(table));
    scrollDown();
  });

  function sendMessage() {
    if ($msgTextArea.val().trim()) {
      var data = {msg: $msgTextArea.val()};

      socket.emit('chat msg', JSON.stringify(data));
      scrollDown();
      $msgTextArea.val('');
      $msgTextArea.focus();
    }
  }

  function scrollDown() {
    var elem = document.getElementById('msg-box');
    elem.scrollTop = elem.scrollHeight;
  }

  function updateUserList(users) {
    var arr = [];

    for (var k in users) {
      if (users.hasOwnProperty(k)) {
        arr.push(users[k]);
      }
    }

    arr.sort(function(a, b) {
      return b.timestamp - a.timestamp;
    });

    var userList = '';

    for (var i = 0; i < arr.length; i++) {
      var table = '';

      table += '<table>';
      table += '<tr>';
      table += '<td rowspan="2" style="vertical-align: top;">';
      table += '<img src="%(avatar)s" />';
      table += '</td>';
      table += '<td class="username">%(name)s</td>';
      table += '</tr>';
      table += '<tr><td class="meta">Join at %(joinTime)s</td></tr>';
      table += '</table>';
      table = sprintf(table, arr[i]);

      userList += '<li>' + table + '</li>';
    }

    $('#user-list').html(userList);
  }

  $msgTextArea.keydown(function(e) {
    if (e.keyCode == 13) {
      if (e.shiftKey) {
        // pass
      } else {
        sendMessage();
        sent = true;
      }
    }
  });

  $msgTextArea.keyup(function() {
    if (sent) {
      // fix textarea cursor
      $msgTextArea.val(' ');
      $msgTextArea.val('');
      sent = false;
    }
  });

});
