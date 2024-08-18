(function(window) {
    let dungeonLogicFile = "json/";

    // Determine the correct file based on the flag
    if (flags.doorshuffle === 'P') {
        dungeonLogicFile = dungeonLogicFile + "logic_dungeon_keydrop.json";
    } else {
        dungeonLogicFile = dungeonLogicFile + "logic_dungeon.json";
    };

    // Load all JSON files and wait for all of them to complete
    $.when(
        $.getJSON(dungeonLogicFile),
        $.getJSON("json/logic_regions.json"),
        $.getJSON("json/logic_entrances.json"),
        $.getJSON("json/logic_nondungeon_checks.json"),
        $.getJSON("json/check_to_array_id.json"),
        $.getJSON("json/entrance_to_array_id.json")
    ).done(function(dungeonData, regionData, entranceData, checkData, checkToArrayIDData, entranceMapData) {
        // Assign the loaded data to the window object
        window.dungeonLogic = dungeonData[0];
        window.regionReachLogic = regionData[0];
        window.entranceLogic = entranceData[0];
        window.checkLogic = checkData[0];
        window.checkToArrayID = checkToArrayIDData[0];
        window.entranceMap = entranceMapData[0];

        // Proceed with loading scripts after JSON data is fully loaded
        console.log("All JSON files loaded successfully.");
        loadScriptsAfterJson();

    }).fail(function() {
        // Handle any errors in loading the JSON files
        console.error("Error loading one or more JSON files.");
    });

    // Function to dynamically load the scripts after JSON data is loaded
    function loadScriptsAfterJson() {
        let scriptsLoaded = 0;

        function scriptLoaded() {
            scriptsLoaded++;
            if (scriptsLoaded === scripts.length) {
                if (typeof window.start === 'function') {
                    var colorSettings = JSON.parse(localStorage.getItem('colorSettings'));
                    for (var key in colorSettings) {
                        document.documentElement.style.setProperty(`--${key}`, colorSettings[key]);
                    }
                    var script = document.createElement('script');
                    script.textContent = 'start()';
                    document.body.appendChild(script);
                }
            }
        }

        const scripts = [
            "js/chests.js?v=21007.1",
            "js/track.js?v=21007.1",
            "js/spoiler.js?v=21007",
            "js/autot.js?v=21007"
        ];

        for (let i = 0; i < scripts.length; i++) {
            const script = document.createElement('script');
            script.src = scripts[i];
            script.onload = scriptLoaded;
            document.head.appendChild(script);
        }
    }

})(window);
