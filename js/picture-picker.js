const fs = require('fs');
const piecesNamesMap = {
    bk: 'gilgamesh.jpg',
    wk: 'arthur.jpg'
};

export function returnPathToPiece(piece) {
    let randomNumber = "" + parseInt(Math.ceil(Math.random() * 10));
    console.log(randomNumber);
    const filePath = `images/pieces/${piecesNamesMap[piece]}`;
    console.log(filePath);
    fs.copyFile(filePath, "images/display/" + piecesNamesMap[piece], (err) => {});
    return filePath;
}