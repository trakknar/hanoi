var init = function () {

    var game = new hanoi.Game(4);

    var solution = function (diskNumber, idTowerFrom, idTowerIntermediate, idTowerTo) {
        if (diskNumber === 1) {
            game.registerMove(idTowerFrom, idTowerTo);
        }
        else {
            solution(diskNumber - 1, idTowerFrom, idTowerTo, idTowerIntermediate);
            game.registerMove(idTowerFrom, idTowerTo);
            solution(diskNumber - 1, idTowerIntermediate, idTowerFrom, idTowerTo);
        }
    };

    var solutionStructure = function (diskNumber, idTowerFrom, idTowerIntermediate, idTowerTo) {
        return function () {
            solution(diskNumber, idTowerFrom, idTowerIntermediate, idTowerTo);
        };
    };

    game.resolve(solutionStructure(4, 1, 2, 3));

};

window.addEventListener('load', init, false);