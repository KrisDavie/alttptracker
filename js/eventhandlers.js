function addDungeonTracking(containerName, templateName, start, end) {
    const template = document.getElementById(templateName).content;
    const container = document.getElementById(containerName);
    for (let id = start; id < end; id++) {
        const clone = document.importNode(template, true);

        const dungeonBoss = clone.querySelector('.boss');
        const dungeonPrize = clone.querySelector('.prize');
        const dungeonChest = clone.querySelector('.chest');
        const dungeonBigKey = clone.querySelector('.bigkey');
        const dungeonSmallKey = clone.querySelector('.smallkeyfull');
        const dungeonCompass = clone.querySelector('.compass');
        const dungeonMap = clone.querySelector('.dungeonmap');

        dungeonBoss.dataset.target = id;
        dungeonBoss.id += id;
        dungeonBoss.classList.value += id;

        dungeonPrize.dataset.target = id;
        dungeonPrize.id += id;
        dungeonPrize.classList.value += 0;

        dungeonChest.dataset.target = id;
        dungeonChest.id += id;

        dungeonBigKey.dataset.target = id;
        dungeonBigKey.id += id;

        dungeonSmallKey.dataset.target = id;
        dungeonSmallKey.id += id;

        dungeonCompass.dataset.target = id;
        dungeonCompass.id += id;

        dungeonMap.dataset.target = id;
        dungeonMap.id += id;

        container.appendChild(clone);
    }
}

document.addEventListener('DOMContentLoaded', function () {

    // Create dungeon tracker
    addDungeonTracking('dungeon-container-column-lw', 'dungeon-template-left', 0, 3);
    addDungeonTracking('dungeon-container-column-dw', 'dungeon-template-right', 3, 10);

    function shuffleArray(array) {
        for (var i = array.length - 1; i >= 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    // Create item tracker
    let trackerItems = [
        "bow", "boomerang", "hookshot", "bomb", "mushroom|empty|empty|powder",
        "firerod", "icerod", "bombos", "ether", "quake",
        "lantern", "hammer", "shovel|empty|empty|flute", "net", "book",
        "bottle1|bottle2|bottle3|bottle4", "somaria", "byrna", "cape", "mirror|mirrorscroll",
        "boots|pseudoboots", "glove", "flippers", "moonpearl", "magic|sword|heartpiece|shield",
    ]
    // Shuffle the items
    // trackerItems = shuffleArray(trackerItems);
    const itemContainer = document.getElementById('griditem-container');
    for (let i = 0; i < trackerItems.length ; i++) {
        const itemArr = trackerItems[i].split('|');
        let type = 'full';
        if (itemArr.length > 1 && itemArr[0] != 'boots' && itemArr[0] != 'mirror') {
            type = 'half';
        }

        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');

        switch (type) {
            case 'full': {
                cellDiv.classList.add('tracker-item-full');

                for (let k = 0; k < itemArr.length; k++) {
                    const itemDiv = document.createElement('div');
                    let target = itemArr[k];
                    if (target === 'pseudoboots') {
                        itemDiv.classList.add('pseduoboots');
                        itemDiv.id = 'pseudoboots';
                        target = 'boots';
                    } else if (target === 'mirrorscroll') {
                        itemDiv.classList.add('mirrorscroll');
                        itemDiv.id = 'mirrorscroll';
                        target = 'mirror';
                    } else {
                        itemDiv.classList.add('item');
                        itemDiv.classList.add('full');
                        itemDiv.classList.add(target);
                    }
                    itemDiv.setAttribute('data-action', 'toggle_item');
                    itemDiv.setAttribute('data-target', target);
                    cellDiv.appendChild(itemDiv);
                }
                break;
            }
            case 'half': {
                cellDiv.classList.add('tracker-item-half');

                for (let k = 0; k < itemArr.length; k++) {
                    const itemDiv = document.createElement('div');
                    itemDiv.classList.add('item');
                    itemDiv.classList.add('half');
                    
                    let target = itemArr[k];
                    if (target != 'empty') {
                        itemDiv.classList.add(target);
                        itemDiv.setAttribute('data-action', 'toggle_item');
                        itemDiv.setAttribute('data-target', target);
                    };
                    cellDiv.appendChild(itemDiv);
                }
                break;
            }
        };
        itemContainer.appendChild(cellDiv);
    };

    // Add entrance modal tags
    const modalTags = document.getElementById('modalTags');
    for (const tag of Object.keys(window.entranceModalTags)) {
        const modalTag = document.createElement('div');
        modalTag.classList.add('modal-entranceTag');
        modalTag.classList.add('available' + tag);
        modalTag.id = tag;
        modalTag.setAttribute('data-action', 'tag_entrance');
        modalTag.setAttribute('data-target', tag);
        let innerText = tag.replace(/_/g, ' ').toUpperCase();
        modalTag.innerText = innerText;
        modalTags.appendChild(modalTag);
    }


    // Handle click events
    document.body.addEventListener('click', function (event) {
        let target = event.target;

        // Handle left-click actions
        // TODO: Break toggle() into separate functions for each type of toggle
        if (event.button === 0) {
            switch (target.dataset.action) {
                case 'toggle_enemy':
                    toggle_enemy(target.dataset.target); break;
                case 'toggle_dungeon':
                    toggle_dungeon(target.dataset.target); break;
                case 'toggle_compass':
                    toggle_compass(target.dataset.target); break;
                case 'toggle_map':
                    toggle_map(target.dataset.target); break;
                case 'toggle_boss':
                    toggle('boss'+target.dataset.target); break;
                case 'toggle_chest':
                    toggle('chest'+target.dataset.target); break;
                case 'toggle_bigkey':
                    toggle('bigkey'+target.dataset.target); break;
                case 'toggle_smallkey':
                    toggle('smallkey'+target.dataset.target); break;
                case 'toggle_medallion':
                    toggle_medallion(target.dataset.target); break;
                case 'toggle_bomb_floor':
                    toggle_bomb_floor(); break;
                case 'toggle_crystal_goal':
                    crystalGoal(); break;
                case 'set_crystal_goal':
                    setCrystalGoal(target.dataset.target); break;
                case 'toggle_ganon_goal':
                    ganonGoal(); break;
                case 'set_ganon_goal':
                    setGanonGoal(target.dataset.target); break;
                case 'toggle_item':
                    toggle(target.dataset.target); break;
                case 'change_flags':
                    changeFlags(); break;
                case 'toggle_bottle':
                    toggle(target.dataset.target); break;
                case 'tag_entrance':
                    tagEntrance(target.dataset.target); break;
            }
        }
    });

    // Handle context menu (right-click) events
    document.body.addEventListener('contextmenu', function (event) {
        let target = event.target;
        switch (target.dataset.action) {
            case 'toggle_boss':
                event.preventDefault();
                toggle_prize(target.dataset.target); return false;
            case 'toggle_enemy':
                event.preventDefault();
                rightClickEnemy(target.dataset.target); return false;
            case 'toggle_dungeon':
                event.preventDefault();
                rightClickPrize(target.dataset.target); return false;
            case 'toggle_smallkey':
                event.preventDefault();
                rightClickKey('smallkey'+target.dataset.target); return false;
            case 'toggle_chest':
                event.preventDefault();
                rightClickChest('chest'+target.dataset.target); return false;
            case 'toggle_medallion':
                event.preventDefault();
                rightClickMedallion(target.dataset.target); return false;
            case 'toggle_bottle':
                event.preventDefault();
                rightClickBottle(target.dataset.target); return false;
        }
    });

    // Handle mouseover events
    document.body.addEventListener('mouseover', function (event) {
        let target = event.target;
    });

    // Handle mouseout events
    document.body.addEventListener('mouseout', function (event) {
        let target = event.target;
    });

    // Handle entrance map events
    for (let i = 0; i < 140; i++) {
        const entranceMap = document.getElementById('entranceMap'+i);
        entranceMap.addEventListener('click', function() {
            toggle_location(i);
        });

        entranceMap.addEventListener('mouseover', function() {
            highlight_entrance(i);
        });
    
        entranceMap.addEventListener('mouseout', function() {
            unhighlight_entrance(i);
        });
    
        entranceMap.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            rightClickEntrance(i);
        });
    
        entranceMap.addEventListener('auxclick', function(event) {
            if (event.button === 1) {
                event.preventDefault();
                middleClickEntrance(i);
            }
        });
    };

    // Handle chest map events

    start();
});
