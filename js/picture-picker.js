const fs = require('fs');
const piecesNamesMap = {
    'bk': ["gilgamesh.jpg"],
    'wk': ["arthur.jpg"]
}

function returnPathToPiece(piece) {
    let randomNumber = "" + Math.ceil(Math.random() * 10);
    const filePath = '../images/pieces/' + piecesNamesMap.get(piece) + ' .png'
    console.log(filePath);
    fs.copyFile(filePath, "../images/display/" + piecesNamesMap.get(piece), (err) => {if (err) throw err;
        console.log(err);})
    return filePath;
}