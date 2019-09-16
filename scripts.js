var player = {x: 0, y: 0};
var target = {x: 4, y: 4};

var map = [];
$("document").ready(function(){
    console.clear();
    generateMap();
    // console.log(pathfind());
});

function generateMap(){
    $("#container").html('');
    map = [];
    var gridsize = {x: parseInt($("#gridsize").val()), y: parseInt($("#gridsize").val())};

    // console.log(gridSize);
    for(var x = 0; x < gridsize.x; x++){
        map[x] = [];
        for(var y = 0; y < gridsize.y; y++){
            var type = (Math.random() < 0.1 && !(player.x == x && player.y == y) && !(target.x == x && target.y == y)) ? 'wall' : 'none';
            if(player.x == x && player.y == y){
                type = 'player';
            }
            if(target.x == x && target.y == y){
                type = 'target';
            }

            map[x][y] = new Tile(x, y, type);
            const d = document.createElement("div");
            $(d).attr('id',`c${x}-${y}`);
            $(d).addClass('tile');
            $(d).addClass(type);

            $("#container").append(d);
        }
    }
    $("#container").css({width: `${gridsize.x * 20}px`, height: `${gridsize.y * 20}px`});

    path = pathfind();
    if(path.length == 0){
        console.log("No path could be found!");
    }
    else{
        console.log(path);
        for(tile of path){
            if(!((tile.x == player.x && tile.y == player.y) || (tile.x == target.x && tile.y == target.y) )){
                $(`#c${tile.x}-${tile.y}`).css({'background-color': 'red'});
            }
        }
    }
}

function pathfind(){
    var startNode = map[player.x][player.y];

    let openList = [];
    let closedList = [];

    openList.push(startNode);
    iterations = 0;

    while(openList.length > 0){
        //TODO: https://www.geeksforgeeks.org/a-search-algorithm/

        iterations++;
        if(iterations > 10000){
            console.log("Iterations overload");
            return [];
        }
        lowestCost = 0;
        lowestTile = null;
        for(tile of openList){
            if(lowestCost == 0 || tile.f < lowestCost){
                lowestCost = tile.f
                lowestTile = tile;

            }
        }
        if(!(tile.x == player.x && tile.y == player.y)){
            $(`#c${lowestTile.x}-${lowestTile.y}`).css({'background-color':'purple'});

        }

        openList = openList.filter((arr) => {
            return arr.x != lowestTile.x && arr.y != lowestTile.y;
        });

        neighbors = getNeighbors(map, lowestTile);

        for(neighbor of neighbors){

            if(neighbor.x == target.x && neighbor.y == target.y){ //* if is finished
                neighbor.parent = lowestTile;
                node = neighbor;
                path = [];
                iterations_a = 0;
                while(node.parent){
                    iterations_a++;
                    path.push(node);
                    node = node.parent;
                }
                path.push(node);

                return path.reverse();
            }

            if(isInList(closedList, neighbor, "closedList") || neighbor.isWall()){
                continue;
            }

            let gScore = lowestTile.g + 1;
            let gScoreIsBest = false;

            if(!isInList(openList, neighbor, "openList")){
                gScoreIsBest = true;
                neighbor.h = Math.abs(neighbor.x - lowestTile.x) + Math.abs(neighbor.y - lowestTile.y);
                openList.push(neighbor);
            }
            else if(gScore < neighbor.g){
                gScoreIsBest = true;
            }
            else{
                continue;
            }

            if(gScoreIsBest){
                neighbor.parent = lowestTile;

                neighbor.g = Math.abs(neighbor.x - player.x) + Math.abs(neighbor.y - player.y);    
                neighbor.f = neighbor.g + neighbor.h;
            }

        }
        closedList.push(lowestTile);
    }

    return [];
}

function isInList(list, node, debug=""){
    // console.log(debug, neighbor);
    for(tile of list){
        if(node.x == tile.x && node.y == tile.y && tile.f <= node.f){
            // console.log(debug);
            return true;
        }
    }
    // console.log(false);
    return false;
}

function getNeighbors(grid, node){

    let returnList = [];

    if(grid[node.x - 1]){
        if(!grid[node.x - 1][node.y].isWall()){
            returnList.push(grid[node.x - 1][node.y]);
        }
    }
    if(grid[node.x + 1]){
        if(!grid[node.x + 1][node.y].isWall()){
            returnList.push(grid[node.x + 1][node.y]);
        }
    }
    if(grid[node.x][node.y - 1]){
        if(!grid[node.x][node.y - 1].isWall()){
            returnList.push(grid[node.x][node.y - 1]);
        }
    }
    if(grid[node.x][node.y + 1]){
        if(!grid[node.x][node.y + 1].isWall()){
            returnList.push(grid[node.x][node.y + 1]);
        }
    }

    // for(tile of returnList){
    //     console.log(`tile`, tile);
    //     console.log(`parent`, node);
    //     tile.parent = node;
    // }

    return returnList;
}