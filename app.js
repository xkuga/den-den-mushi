var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config');
var utils = require('./utils');
var avatar = require('./avatar')(config.images, config.roleImages);

var users = {};
var userCount = 0;
var logCount = 0;
var maxLogCount = 1997;

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendfile('index.html');
});

io.on('connection', function(socket) {
  var userJoined = false;

  socket.on('user join', function(data) {
    var input = JSON.parse(data);
    var username = utils.escapeHtml(input.username);
    var userAvatar = avatar.get(username);
    var output = {};

    users[socket.id] = {
      name: username,
      avatar: userAvatar,
      joinTime: utils.time(),
      timestamp: utils.timestamp()
    };

    userCount++;
    userJoined = true;
    output.users = users;
    io.emit('user join', JSON.stringify(output));
    log('join', socket.id, username, userAvatar);
  });

  socket.on('chat msg', function(data) {
    var input = JSON.parse(data);
    var user = users[socket.id];
    var output = {};

    output.username = user.name;
    output.avatar = user.avatar;
    output.time = utils.time();
    output.msg = utils.escapeHtml(input.msg);

    io.emit('chat msg', JSON.stringify(output));
    log('chat', socket.id, user.name, user.avatar, input.msg);
  });

  socket.on('disconnect', function() {
    if (userJoined) {
      var output = {};
      var user = users[socket.id];

      delete users[socket.id];
      userCount--;
      output.users = users;
      io.emit('user left', JSON.stringify(output));
      log('left', socket.id, user.name, user.avatar);
    }
  });

  function log(action, socketId, username, avatar, msg) {
    if (logCount < maxLogCount) {
      var log = {
        'time': utils.time(config.logtimeFormat),
        'action': action,
        'socket_id': socketId,
        'username': username,
        'avatar': avatar,
        'total_user': userCount,
        'msg': msg
      };

      console.log(JSON.stringify(log));
      logCount++;
    }
  }
});

http.listen(3000, function() {
  console.log(utils.time() + ' listening on *:3000');
});
