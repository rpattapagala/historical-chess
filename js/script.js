const elm_board = document.querySelector('.board');

const game = new Chess();

function toDests(chess) {
  const dests = new Map();
  SQUARES.forEach(s => {
    const moves = chess.moves({ square: s, verbose: true });
    if (moves.length) dests.set(s, moves.map(m => m.to));
  });
  return dests;
}

function computerMove() {
  const moves = game.moves();
  if (moves.length > 0) {
    const move = moves[Math.floor(Math.random() * moves.length)];
    game.move(move);
    ground.set({
      fen: game.fen(),
      turnColor: game.turn() === 'w' ? 'white' : 'black',
      movable: { dests: toDests(game) }
    });
  }
}

const ground = Chessground(elm_board, {
  fen: game.fen(),
  turnColor: 'white',
  movable: {
    free: false,
    color: 'white',
    dests: toDests(game),
    events: {
      after: (orig, dest) => {
        const move = game.move({ from: orig, to: dest, promotion: 'q' });
        if (move) {
          ground.set({
            fen: game.fen(),
            turnColor: game.turn() === 'w' ? 'white' : 'black',
            movable: { dests: toDests(game) }
          });
          if (!game.game_over()) {
            setTimeout(computerMove, 500);
          }
        }
      }
    }
  },
  viewOnly: false
});
