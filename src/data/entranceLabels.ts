export interface EntranceLabel {
    label: string;
    color: string;
}

export const defaultEntranceLabels: Record<string, EntranceLabel> = {
    // Dungeons
    "Eastern Palace": { label: "EP", color: "#32cd32" }, // LimeGreen
    "Desert Palace Entrance (East)": { label: "DP_E", color: "#f4a460" }, // SandyBrown
    "Desert Palace Entrance (West)": { label: "DP_W", color: "#f4a460" },
    "Desert Palace Entrance (North)": { label: "DP_N", color: "#f4a460" },
    "Desert Palace Entrance (South)": { label: "DP_S", color: "#f4a460" },
    "Tower of Hera": { label: "TH", color: "#87ceeb" }, // SkyBlue
    "Agahnims Tower": { label: "AT", color: "#ff4500" }, // OrangeRed
    "Palace of Darkness": { label: "PoD", color: "#8a2be2" }, // BlueViolet
    "Swamp Palace": { label: "SP", color: "#00ced1" }, // DarkTurquoise
    "Skull Woods First Section Door": { label: "SW_S", color: "#8b4513" }, // SaddleBrown
    "Skull Woods Second Section Door (East)": { label: "SW_E", color: "#8b4513" },
    "Skull Woods Second Section Door (West)": { label: "SW_W", color: "#8b4513" },
    "Skull Woods Final Section": { label: "SW_N", color: "#8b4513" },
    "Thieves Town": { label: "TT", color: "#dc143c" }, // Crimson
    "Ice Palace": { label: "IP", color: "#add8e6" }, // LightBlue
    "Misery Mire": { label: "MM", color: "#556b2f" }, // DarkOliveGreen
    "Dark Death Mountain Ledge (East)": { label: "TR_E", color: "#ff0000" }, // Red
    "Dark Death Mountain Ledge (West)": { label: "TR_W", color: "#ff0000" },
    "Turtle Rock Isolated Ledge Entrance": { label: "TR_S", color: "#ff0000" },
    "Turtle Rock": { label: "TR_N", color: "#ff0000" },
    "Ganons Tower": { label: "GT", color: "#4b0082" }, // Indigo
    "Hyrule Castle Entrance (South)": { label: "HC_S", color: "#ffd700" }, // Gold
    "Hyrule Castle Entrance (West)": { label: "HC_W", color: "#ffd700" },
    "Hyrule Castle Entrance (East)": { label: "HC_E", color: "#ffd700" },

    // Start Locs
    "Link's House": { label: "LH", color: "#98fb98" }, // PaleGreen
    "Sanctuary": { label: "Sanc", color: "#98fb98" },
    "Old Man House (Bottom)": { label: "OM", color: "#98fb98" },

    // LW Important
    "Sahasrahlas Hut": { label: "Saha", color: "#00fa9a" }, // MediumSpringGreen
    "Bat Cave Cave": { label: "Bat", color: "#00fa9a" },
    "Sick Kids House": { label: "Kid", color: "#00fa9a" },
    "Dam": { label: "Dam", color: "#00fa9a" },
    "Library": { label: "Lib", color: "#00fa9a" },
    "Blacksmiths Hut": { label: "Smith", color: "#00fa9a" },
    "Mimic Cave": { label: "Mimic", color: "#00fa9a" },

    // DW Important
    "Hookshot Cave": { label: "Hook", color: "#cd5c5c" }, // IndianRed
    "Hookshot Cave Back Entrance": { label: "Hook", color: "#cd5c5c" },
    "Spike Cave": { label: "Spike", color: "#cd5c5c" },
    "Big Bomb Shop": { label: "Bomb", color: "#cd5c5c" },
    "Bumper Cave (Top)": { label: "Bumper", color: "#cd5c5c" },
    "Bumper Cave (Bottom)": { label: "Bumper", color: "#cd5c5c" },
    "Pyramid Hole": { label: "Ganon", color: "#cd5c5c" },

    // Generics
    "Generic Shop": { label: "Shop", color: "#a9a9a9" }, // DarkGray
    "Generic Rupee Cave": { label: "Rupee", color: "#a9a9a9" },
    "Generic Item NPC": { label: "Item", color: "#a9a9a9" },
    "Generic Dark Cave": { label: "Dark", color: "#a9a9a9" },

}