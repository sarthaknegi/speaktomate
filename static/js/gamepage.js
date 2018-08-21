    var board,whatsMyMove,
      game = new Chess(),
      statusEl = $('#status'),
      fenEl = $('#fen'),
      pgnEl = $('#pgn');

      var checkStr = 'checking';

      var onDragStart = function(source, piece, position, orientation) {
      if (game.game_over() === true ||
          (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
          (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
      }
    };

    var onDrop = function(source, target) {
      // see if the move is legal
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) return 'snapback';

      updateStatus();
    };

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    var onSnapEnd = function() {
      board.position(game.fen());
    };

    var updateStatus = function() {
      var status = '';

      var moveColor = 'White';
      if (game.turn() === 'b') {
        moveColor = 'Black';
      }

      // checkmate?
      if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
      }

      // draw?
      else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
      }

      // game still on
      else {
        status = moveColor + ' to move';

        // check?
        if (game.in_check() === true) {
          status += ', ' + moveColor + ' is in check';
        }
      }
      statusEl.html(status);
      fenEl.html(game.fen());
      pgnEl.html(game.pgn());
    };

    var makeRandomMove = function() {
          var possibleMoves = game.moves();

          // game over
          if (possibleMoves.length === 0) return;

          var randomIndex = Math.floor(Math.random() * possibleMoves.length);
            var temp = game.move(possibleMoves[randomIndex])
            prepareStr = temp['from'] +'-' +temp['to']
             board.move(prepareStr);
    };

    var cfg = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd
    };

// This is the speech recognition code....Wed Speech API
    try {
      var recognition = new webkitSpeechRecognition();
    }
    catch(e) {
      $('.no-browser-support').show();
      $('.app').hide();
    }

    recognition.continous = true;
    recognition.interimResults = true;

    var interimResult = '';

     $('#start-game').on('click', function(e) {
          console.log('Whats your Move!! Speak!!');
          recognition.start();
    });

    movingpiece = function(whatsMyMove){
           console.log('Inside the movingpiece')
           console.log(whatsMyMove)
           try{
               if(whatsMyMove){
                   whatsMyMove = String(whatsMyMove);
                   whatsMyMove = whatsMyMove.toLowerCase();
                   whatsMyMove = whatsMyMove.split("to");
                   whatsMyMove[0] = whatsMyMove[0].replace(/\s+/g,'');
                   whatsMyMove[1] = whatsMyMove[1].replace(/\s+/g,'');
                   moveStr = whatsMyMove[0]+'-'+whatsMyMove[1]
                   board.move(moveStr);
                   if(String(game.turn()) == 'w'){
                     whoseTurn.html("Its Black's Turn");
                     game.setTurn("b");
                     makeRandomMove();
                     game.setTurn("w");
                   }
                   return whatsMyMove;
               }
            }
            catch(e){
            }
    }

    recognition.onresult = function (event) {
            whatsMyMove = event.results[0][0].transcript;
    };

     recognition.onend = function() {
            console.log('Inside the end function');
            if(whatsMyMove != checkStr){
                checkStr = movingpiece(whatsMyMove) // add a logic here to check the whites move
            }
            recognition.start();
     };

    board = ChessBoard('board1', cfg);
    updateStatus();
