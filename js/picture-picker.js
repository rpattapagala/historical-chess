const piecesNamesMap = {
    bk: 'gilgamesh.jpg',
    wk: 'arthur.jpg'
};

export function returnPathToPiece(piece) {
    const fileName = piecesNamesMap[piece];
    if (!fileName) {
        return null;
    }

    return `images/pieces/${fileName}`;
}
