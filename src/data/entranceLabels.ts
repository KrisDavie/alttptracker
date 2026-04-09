export interface EntranceLabel {
    label: string;
    color: string;
}

export const defaultEntranceLabels: Record<string, EntranceLabel> = {
    // Dungeons
    "Eastern Palace": { label: "EP", color: "#ffffff" },
    "Desert Palace Entrance (East)": { label: "DP_E", color: "#ffffff" },
    "Desert Palace Entrance (West)": { label: "DP_W", color: "#ffffff" },
    "Desert Palace Entrance (North)": { label: "DP_N", color: "#ffffff" },
    "Desert Palace Entrance (South)": { label: "DP_S", color: "#ffffff" },
    "Tower of Hera": { label: "TH", color: "#ffffff" },
    "Agahnims Tower": { label: "AT", color: "#ffffff" },
    "Palace of Darkness": { label: "PoD", color: "#ffffff" },
    "Swamp Palace": { label: "SP", color: "#ffffff" },
    "Skull Woods First Section Door": { label: "SW_S", color: "#ffffff" },
    "Skull Woods Second Section Door (East)": { label: "SW_E", color: "#ffffff" },
    "Skull Woods Second Section Door (West)": { label: "SW_W", color: "#ffffff" },
    "Skull Woods Final Section": { label: "SW_N", color: "#ffffff" },
    "Thieves Town": { label: "TT", color: "#ffffff" },
    "Ice Palace": { label: "IP", color: "#ffffff" },
    "Misery Mire": { label: "MM", color: "#ffffff" },
    "Dark Death Mountain Ledge (East)": { label: "TR_E", color: "#ffffff" },
    "Dark Death Mountain Ledge (West)": { label: "TR_W", color: "#ffffff" },
    "Turtle Rock Isolated Ledge Entrance": { label: "TR_S", color: "#ffffff" },
    "Turtle Rock": { label: "TR_N", color: "#ffffff" },
    "Ganons Tower": { label: "GT", color: "#ffffff" },
    "Hyrule Castle Entrance (South)": { label: "HC_S", color: "#ffffff" },
    "Hyrule Castle Entrance (West)": { label: "HC_W", color: "#ffffff" },
    "Hyrule Castle Entrance (East)": { label: "HC_E", color: "#ffffff" },

    // Start Locs
    "Link's House": { label: "LH", color: "#ffffff" },
    "Sanctuary": { label: "Sanc", color: "#ffffff" },
    "Old Man House (Bottom)": { label: "OM", color: "#ffffff" },

    // LW Important
    "Sahasrahlas Hut": { label: "Saha", color: "#ffffff" },
    "Bat Cave Cave": { label: "Bat", color: "#ffffff" },
    "Sick Kids House": { label: "Kid", color: "#ffffff" },
    "Dam": { label: "Dam", color: "#ffffff" },
    "Library": { label: "Lib", color: "#ffffff" },
    "Blacksmiths Hut": { label: "Smith", color: "#ffffff" },
    "Mimic Cave": { label: "Mimic", color: "#ffffff" },

    // DW Important
    "Hookshot Cave": { label: "Hook", color: "#ffffff" },
    "Hookshot Cave Back Entrance": { label: "Hook", color: "#ffffff" },
    "Spike Cave": { label: "Spike", color: "#ffffff" },
    "Big Bomb Shop": { label: "Bomb", color: "#ffffff" },
    "Bumper Cave (Top)": { label: "Bumper", color: "#ffffff" },
    "Bumper Cave (Bottom)": { label: "Bumper", color: "#ffffff" },
    "Pyramid Hole": { label: "Ganon", color: "#ffffff" },

    // Generics
    "Generic Shop": { label: "Shop", color: "#ffffff" },
    "Generic Rupee Cave": { label: "Rupee", color: "#ffffff" },
    "Generic Item NPC": { label: "Item", color: "#ffffff" },
    "Generic Dark Cave": { label: "Dark", color: "#ffffff" },

}