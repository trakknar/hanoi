var hanoi = (function() {
    "use strict";

    /**
     * @namespace
     */
    var hanoi = {};

    /**
     * Exception model
     * @param {string} message
     * @constructor
     */
    hanoi.Exception = function (message) {
        this.message = message;
    };

    /**
     * Tower model
     * @param {int} id
     * @constructor
     */
    hanoi.Tower = function (id) {
        this.id = id;
        this.domElt = document.getElementsByClassName('tower' + id)[0];
        this.disks = [];
    };

    /**
     * Add a disk on top of the tower
     * @param {hanoi.Disk} disk
     * @throws {hanoi.Exception} if the disk to add is bigger than the top disk of the tower
     */
    hanoi.Tower.prototype.addDisk = function (disk) {
        var disksNumber = this.disks.length;
        if (disksNumber > 0) {
            var topDisk = this.disks[disksNumber - 1];
            if (topDisk.id < disk.id) {
                throw new hanoi.Exception("A disk can not be put on a smaller one (tower "
                    + this.id + " : disk " + disk.id + " can not be on disk " + topDisk.id + ")");
            }
        }

        this.disks.push(disk);
    };

    /**
     * Remove the top disk of the tower
     * @returns {hanoi.Disk}
     * @throws {hanoi.Exception} if the tower is empty
     */
    hanoi.Tower.prototype.removeDisk = function () {
        var disksNumber = this.disks.length;
        if (disksNumber === 0) {
            throw new hanoi.Exception("No disk to remove from tower " + this.id);
        }

        return this.disks.pop();
    };

    /**
     * Disk model
     * @param {int} id
     * @constructor
     */
    hanoi.Disk = function (id) {
        this.id = id;
        this.domElt = document.getElementsByClassName('disk' + id)[0];
    };

    /**
     * Animate the motion of a disk form a tower to another one
     * @param {hanoi.Tower} towerFrom
     * @param {hanoi.Tower} towerTo
     */
    hanoi.Disk.prototype.animate = function (towerFrom, towerTo) {
        var cssTransitionEndNames = {
            'WebkitTransition': 'webkitTransitionEnd',// Saf 6, Android Browser
            'MozTransition': 'transitionend', // only for FF < 15
            'transition': 'transitionend' // IE10, Opera, Chrome, FF 15+, Saf 7+
        };
        var cssTransitionEndName = cssTransitionEndNames[Modernizr.prefixed('transition')];

        var domElt = this.domElt;

        var listener = function () {
            if (domElt.classList.contains('c' + xFrom)) {
                domElt.classList.remove('c' + xFrom);
                domElt.classList.add('c' + xTo);
            }
            else if (domElt.classList.contains('lINF')) {
                domElt.classList.remove('lINF');
                domElt.classList.add('l' + yTo);
                domElt.removeEventListener(cssTransitionEndName, listener);
            }
        };

        var xFrom = towerFrom.id;
        var yFrom = towerFrom.disks.length + 1;
        var xTo = towerTo.id;
        var yTo = towerTo.disks.length;

        domElt.classList.remove('l' + yFrom);
        domElt.classList.add('lINF');

        domElt.addEventListener(cssTransitionEndName, listener);
    };

    /**
     * Game model
     * @param {int} diskNumber
     * @constructor
     */
    hanoi.Game = function (diskNumber) {
        this.moves = [];

        var firstTower = new hanoi.Tower(1);
        this.towers = {
            '1': firstTower,
            '2': new hanoi.Tower(2),
            '3': new hanoi.Tower(3)
        };

        for (var i = diskNumber; i >= 1; i--) {
            firstTower.addDisk(new hanoi.Disk(i));
        }
    };

    /**
     * Display a message to the user
     * @param {string} message
     */
    hanoi.Game.prototype.displayMessage = function (message) {
        alert(message);
    };

    /**
     * Display an exception to the user
     * @param {hanoi.Exception|string} exception
     */
    hanoi.Game.prototype.displayException = function (exception) {
        if (exception instanceof hanoi.Exception) {
            this.displayMessage(exception.message);
        }
        else if (typeof exception === "string") {
            this.displayMessage(exception);
        }
    };

    /**
     * Move one disk from a tower to another one
     * @param {int} idTowerFrom
     * @param {int} idTowerTo
     */
    hanoi.Game.prototype.move = function (idTowerFrom, idTowerTo) {
        if (!this.towers.hasOwnProperty(idTowerFrom)) {
            throw "Tower " + idTowerFrom + " does not exist";
        }
        if (!this.towers.hasOwnProperty(idTowerTo)) {
            throw "Tower " + idTowerTo + " does not exist";
        }

        var towerFrom = this.towers[idTowerFrom];
        var towerTo = this.towers[idTowerTo];

        var disk = towerFrom.removeDisk();
        towerTo.addDisk(disk);

        disk.animate(towerFrom, towerTo);
    };

    /**
     * Register the move of the top disk of a tower to another one
     * The move will be effective when the {@see Game.run} method will be executed
     * @param {int} idTowerFrom
     * @param {int} idTowerTo
     */
    hanoi.Game.prototype.registerMove = function (idTowerFrom, idTowerTo) {
        var game = this;
        game.moves.push(function () {
            game.move(idTowerFrom, idTowerTo);
        });
    };

    /**
     * Execute the solution registered by {@see Game.resolve}
     */
    hanoi.Game.prototype.run = function () {
        var game = this;
        var runner = setInterval(function execute() {
            if (game.moves.length < 1) {
                clearInterval(runner);
                game.displayMessage("Game over");
            }
            else {
                var move = game.moves.shift();
                try {
                    move();
                }
                catch (e) {
                    game.displayException(e);
                    clearInterval(runner);
                    game.displayMessage("Game over");
                }
            }
            return execute;
        }(), 1500);
    };

    /**
     * Take a function that should resolved the Hanoi problem and runs it
     * @param {HanoiSolution} solution
     */
    hanoi.Game.prototype.resolve = function (solution) {
        if (typeof solution !== 'function') {
            this.displayException("The solution should be a function");
        }
        else {
            try {
                solution();
                this.run();
            }
            catch (e) {
                this.displayException(e);
            }
        }
    };

    return hanoi;
})();

/**
 * This function takes no parameters and should resolve the Hanoi problem
 * @callback HanoiSolution
 */