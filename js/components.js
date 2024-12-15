function createItemComponent(item, onClick, onMouseover, onMouseout, onContextmenu) {
    const itemDiv = document.createElement('div');
    itemDiv.className = `item ${item}`;
    itemDiv.addEventListener('click', onClick);
    itemDiv.addEventListener('mouseover', onMouseover);
    itemDiv.addEventListener('mouseout', onMouseout);
    if (onContextmenu) {
        itemDiv.addEventListener('contextmenu', onContextmenu);
    }
    return itemDiv;
}

function createDungeonComponent(dungeon, onClick, onContextmenu) {
    const dungeonDiv = document.createElement('div');
    dungeonDiv.className = `dungeon ${dungeon}`;
    dungeonDiv.addEventListener('click', onClick);
    if (onContextmenu) {
        dungeonDiv.addEventListener('contextmenu', onContextmenu);
    }
    return dungeonDiv;
}

function createKeyComponent(key, onClick, onMouseover, onMouseout, onContextmenu) {
    const keyDiv = document.createElement('div');
    keyDiv.className = `key ${key}`;
    keyDiv.addEventListener('click', onClick);
    keyDiv.addEventListener('mouseover', onMouseover);
    keyDiv.addEventListener('mouseout', onMouseout);
    if (onContextmenu) {
        keyDiv.addEventListener('contextmenu', onContextmenu);
    }
    return keyDiv;
}
