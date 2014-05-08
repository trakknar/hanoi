if(!Modernizr.csstransitions) {
    alert("Your browser does not support css transitions. Please use a newer browser to launch this game.");
}
else if(!window.addEventListener) {
    alert("Your browser is not supported. Please use a newer browser to launch this game.");
}
else {
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
}