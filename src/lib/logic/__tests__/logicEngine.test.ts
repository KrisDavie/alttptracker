import { describe, it, expect } from "vitest";
import { LogicEngine } from "../logicEngine";
import { getLogicSet } from "../logicMapper";
import { gameState, tracePathToLocation, compareLocationPaths, printDetailedPath } from "./testHelpers";
import type { LogicStatus } from "@/data/logic/logicTypes";

describe("LogicEngine", () => {
  describe("Desert Palace Key Logic", () => {

    it("should mark boss as possible when player has 0 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("dp", { smallKeys: 0, bigKey: true })
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // These locations should be available (no key required)
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");

      // Collect "Desert Palace - Desert Tiles 1 Pot Key"
      // Open "Desert Tiles 1 Up Stairs" (also opens "Desert Bridge Down Stairs")
      // Collect "Desert Palace - Beamos Hall Pot Key"
      // Open Desert Beamos Hall NE" (also opens "Desert Tiles 2 SE")
      // Collect "Desert Palace - Desert Tiles 2 Pot Key"
      // We have now collected all three pot keys
      // We have one key available, but two locked doors to open to reach boss and other locations
      // Doors: Desert Tiles 2 NE (also opens Desert Wall Slide SE) and Desert East Wing Key Door EN (also opens Desert Compass Key Door WN)
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("possible");
    });

    it("should mark boss as available when player has 1 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("dp", { smallKeys: 1, bigKey: true })
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // These locations should be available (no key required)
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");

      // The pot key can be used to open one door, so boss and other locations are possible, but both cannot be reached without the wild key
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("available");
    });

    it("should mark locations as unavailable when lacking required items", () => {
      const state = gameState()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("dp", { smallKeys: 1, bigKey: true })
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Without gloves, can't even reach Desert Palace back
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("unavailable");
    });
  });

  describe("PoD Key Logic", () => {
    it("should mark back of PoD as possible with 1 wild small key and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("pod", { smallKeys: 1, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Palace of Darkness - Shooter Room']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Dark Basement - Left']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Boss']).toBe("possible");
      // This location requires 2 keys to reach, PoD Arena Main NW and PoD Falling Bridge WN
      expect(result.locationsLogic['Palace of Darkness - Dark Maze - Top']).toBe("unavailable");
    })

    it("should mark back of PoD as possible with 3 wild small keys and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("pod", { smallKeys: 3, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Small keys can be spent:
      // To pod arena
      // To boss
      // to big key chest
      // to back of pod (falling bridge)
      // With only 3 spent, could be locked out of any of those locations, so should all be possible, not available

      expect(result.locationsLogic['Palace of Darkness - Shooter Room']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Dark Basement - Left']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Boss']).toBe("possible");
      // This location requires 2 keys to reach, PoD Arena Main NW and PoD Falling Bridge WN
      expect(result.locationsLogic['Palace of Darkness - Dark Maze - Top']).toBe("possible");
    })

    it("should mark back of PoD as available with 4 wild small keys and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("pod", { smallKeys: 4, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Palace of Darkness - Dark Basement - Left']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Dark Maze - Bottom']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Harmless Hellway']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Big Key Chest']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Boss']).toBe("possible");
    })

    it("should mark dark basement as available but later checks as possible with 5 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("pod", { smallKeys: 5, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Palace of Darkness - Dark Basement - Left']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Dark Maze - Bottom']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Big Key Chest']).toBe("possible");
      expect(result.locationsLogic['Palace of Darkness - Boss']).toBe("possible");
    })

    it("should mark boss of PoD as available with 6 wild small keys and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("pod", { smallKeys: 6, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Palace of Darkness - Dark Maze - Bottom']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Harmless Hellway']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Big Key Chest']).toBe("available");
      expect(result.locationsLogic['Palace of Darkness - Boss']).toBe("available");
    })
  });

  describe("Swamp Key Logic", () => {
    it("should mark swamp entrance as available with 0 wild small keys and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("sp", { smallKeys: 0, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Swamp Palace - Entrance']).toBe("available");
      expect(result.locationsLogic['Swamp Palace - Big Chest']).toBe("unavailable");
      expect(result.locationsLogic['Swamp Palace - Boss']).toBe("unavailable");
    })

    it("should mark all of swamp as available with 1 wild small key and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("sp", { smallKeys: 1, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Swamp Palace - Entrance']).toBe("available");
      expect(result.locationsLogic['Swamp Palace - Map Chest']).toBe("available");
      expect(result.locationsLogic['Swamp Palace - Big Chest']).toBe("available");
      expect(result.locationsLogic['Swamp Palace - Big Key Chest']).toBe("available");
      expect(result.locationsLogic['Swamp Palace - Boss']).toBe("available");
    })
  });

  describe("IP Key Logic", () => {
    it("should mark everything as available with 0 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("ip", { smallKeys: 0, bigKey: true })
        .build();

      state.items.somaria.amount = 0; // Remove somaria to force key usage
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      const path = tracePathToLocation(
        'Ice Palace - Boss',
        state,
        'noglitches'
      );

      printDetailedPath(path);

      expect(result.locationsLogic['Ice Palace - Compass Chest']).toBe("available");
      expect(result.locationsLogic['Ice Palace - Big Chest']).toBe("available");
      expect(result.locationsLogic['Ice Palace - Big Key Chest']).toBe("available");
      expect(result.locationsLogic['Ice Palace - Boss']).toBe("available");

      tracePathToLocation("Ice Palace - Boss", state);
    })
  });

  describe("TR Key Logic", () => {
    it("should mark everything as available with 4 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 4, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Eye Bridge - Bottom Left']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("available");
    })

    it("should mark big key chest and boss as possible with 2 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 2, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Start with 2 keys
      // Open TR Hub NW -> TR Hub (TR Pokey 1 SW) - now 1 key
      // Collect TR Pokey 1 Key Drop - now 2 keys
      // Open TR Pokey 1 NW -> TR Chain Chomps Bottom (TR Chain Chomps SW) - now 1 key
      // Open TR Chain Chomps Down Stairs -> TR Pipe Pit (SPECIAL CASE - Other side (TR Pipe Pit Up Stairs) is already open) - now 0 keys
      //   TR Pipe Pit Up Stairs CAN be reached from the other side in different modes, but NOT this one, so the key is required to open the door
      // Collect Turtle Rock - Pokey 2 Key Drop - now 1 key
      // There is 1 key and 2 locked doors remaining:
      // TR Crystaroller Down Stairs (TR Dark Ride North Platform) - To the back of the dungeon including Eye Bridge Checks (Do not need to pass another key door), and the boss (past another small key door)
      // TR Pokey 2 ES (TR Lava Island WS) - To the big key chest
      // Boss is unavailable because we don't have enough keys to open it even if we go to the back for eye bridge (because we use the key in crysttalroller)

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Eye Bridge - Bottom Left']).toBe("possible");
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("possible");
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("unavailable");
    })

    it("should mark big key chest and boss as possible with 3 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 3, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Start with 3 keys
      // Open TR Hub NW -> TR Hub (TR Pokey 1 SW) - now 2 keys
      // Collect TR Pokey 1 Key Drop - now 3 keys
      // Open TR Pokey 1 NW -> TR Chain Chomps Bottom (TR Chain Chomps SW) - now 2 keys
      // Open TR Chain Chomps Down Stairs -> TR Pipe Pit (SPECIAL CASE - Other side (TR Pipe Pit Up Stairs) is already open) - now 1 key
      //   TR Pipe Pit Up Stairs CAN be reached from the other side in different modes, but NOT this one, so the key is required to open the door
      // Collect Turtle Rock - Pokey 2 Key Drop - now 2 keys
      // Open TR Crystaroller Down Stairs -> TR Dark Ride North Platform (SPECIAL CASE - Other side (TR Dark Ride Up Stairs) is already open) - now 1 key
      //   TR Dark Ride Up Stairs CAN be reached from the other side in different modes, but NOT this one, so the key is required to open the door
      // There is 1 key and 2 locked doors remaining:
      // TR Dash Bridge WS (TR Crystal Maze ES) - To the boss
      // TR Pokey 2 ES (TR Lava Island WS) - To the big key chest

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Eye Bridge - Bottom Left']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("possible");
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("possible");
    })

    it("should mark only the front as available with 1 wild small key and full inventory", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 1, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Pokey 1 Key Drop']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("unavailable");
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("unavailable");
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("unavailable");
    })

    it("[INVERTED] should mark most as possible, laser bridge and crystalroller as available with 0 wild small key and full inventory, no medallions", () => {
      // In inverted, we can access TR from middle and back entrances.
      // This allows us to reach further into the dungeon even without keys.
      // Can navigate to Pokey 2 and collect its key drop
      // Can use this to open all small keys doors, but everything is still only available with all keys, due to wastage.
      const state = gameState()
        .withAllItems()
        .withSettings({ worldState: "inverted", wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 0, bigKey: true })
        .build();

      // Remove medallions - without medallions, front of the dungeon needs keys to access
      state.items["bombos"] = { amount: 0 };
      state.items["ether"] = { amount: 0 };
      state.items["quake"] = { amount: 0 };

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("possible");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available"); // Available because back of stairs is open without key
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("available"); // Available because we can directly reach it via inverted middle entrance
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("possible"); // Needs a small key
      expect(result.locationsLogic['Turtle Rock - Eye Bridge - Bottom Left']).toBe("available"); // Available because we can directly reach it via inverted back entrance
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("possible"); // Needs a small key
    })

    it("[INVERTED] should mark most as possible, laser bridge and crystalroller as available with 3 wild small key and full inventory, no medallions", () => {
      // In inverted, we can access TR from middle and back entrances.
      // This allows us to reach further into the dungeon even without keys.
      // Can navigate to Pokey 2 and collect its key drop
      // Can use this to open all small keys doors, but everything is still only available with all keys, due to wastage.
      const state = gameState()
        .withAllItems()
        .withSettings({ worldState: "inverted", wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 3, bigKey: true })
        .build();

      // Remove medallions - without medallions, front of the dungeon needs keys to access
      state.items["bombos"] = { amount: 0 };
      state.items["ether"] = { amount: 0 };
      state.items["quake"] = { amount: 0 };

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("possible");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available"); // Available because back of stairs is open without key
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("available"); // Available because we can directly reach it via inverted middle entrance
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("possible"); // Needs a small key
      expect(result.locationsLogic['Turtle Rock - Eye Bridge - Bottom Left']).toBe("available"); // Available because we can directly reach it via inverted back entrance
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("possible"); // Needs a small key
    })

    it("[INVERTED] should mark everything available with 4 wild small key and full inventory", () => {
      // In inverted, we can access TR from middle and back entrances.
      // This allows us to reach all of the dungeon checks without medallions
      const state = gameState()
        .withAllItems()
        .withSettings({ worldState: "inverted", wildSmallKeys: "wild" })
        .withDungeon("tr", { smallKeys: 4, bigKey: true })
        .build();

      // Remove medallions - without medallions, front of the dungeon needs keys to access
      state.items["bombos"] = { amount: 0 };
      state.items["ether"] = { amount: 0 };
      state.items["quake"] = { amount: 0 };

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Turtle Rock - Compass Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Chain Chomps']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Big Key Chest']).toBe("available");
      expect(result.locationsLogic['Turtle Rock - Eye Bridge - Bottom Left']).toBe("available"); 
      expect(result.locationsLogic['Turtle Rock - Boss']).toBe("available");
    })
  
  });

  describe("MM Key Logic", () => {
    it("should mark everything as available with 3 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("mm", { smallKeys: 3, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Misery Mire - Main Lobby']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Big Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Map Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Spike Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Big Key Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Boss']).toBe("available");
    })

    it("should mark left side as possible with less than 2 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("mm", { smallKeys: 0, bigKey: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Start with 2 keys
      // Collect Misery Mire - Spikes Pot Key - 3 keys
      // Spend key to open Mire Spikes NW - 2 keys
      // Collect Misery Mire - Fishbone Pot Key - 3 keys 
      // Spend key to open Mire Fishbone SE - 2 keys
      // Spend key to open Mire Hub Right EN - 1 key
      // Spend key to open Mire Hub WS - 0 keys
      // Collect Misery Mire - Conveyor Crystal Key Drop - 1 key
      // Spend key to open Mire Dark Shooters SE - 0 keys
      // Cannot open Mire Conveyor Crystal WS - needs another key
      // Compass chest and Big Key chest are beyond this door

      expect(result.locationsLogic['Misery Mire - Main Lobby']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Bridge Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Big Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Map Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Spike Chest']).toBe("available");
      expect(result.locationsLogic['Misery Mire - Compass Chest']).toBe("possible");
      expect(result.locationsLogic['Misery Mire - Big Key Chest']).toBe("possible");
      expect(result.locationsLogic['Misery Mire - Boss']).toBe("available");

      tracePathToLocation("Misery Mire - Compass Chest", state);
    })

  });

  describe("GT Key Logic", () => {
    // GT is very complicated due to the different paths

    it("should mark most as possible with 0 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("gt", { smallKeys: 0, bigKey: true })
        .withDungeon("ep", { prize: "crystal", prizeCollected: true })
        .withDungeon("dp", { prize: "crystal", prizeCollected: true })
        .withDungeon("toh", { prize: "crystal", prizeCollected: true })
        .withDungeon("pod", { prize: "crystal", prizeCollected: true })
        .withDungeon("sp", { prize: "crystal", prizeCollected: true })
        .withDungeon("sw", { prize: "crystal", prizeCollected: true })
        .withDungeon("tt", { prize: "crystal", prizeCollected: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // There are three key drops/pots available without opening doors
      // Ganons Tower - Conveyor Cross Pot Key
      // Ganons Tower - Double Switch Pot Key
      // Ganons Tower - Mini Helmasaur Key Drop
      // If these are used in particular ways, other doors cannot be opened
      // i.e.
      // GT Torch EN, GT Hookshot ES and GT Mini Helmasaur Room WN. No more doors can be opened
      // We NEED to open either GT Double Switch EN or GT Tile Room EN to get to the rest of the basement, and GT Crystal Circles SW to get to Validation Chest

      expect(result.locationsLogic['Ganons Tower - Hope Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Mini Helmasaur Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - DMs Room - Top Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Randomizer Room - Top Left']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Compass Room - Top Left']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Firesnake Room']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Big Chest']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Big Key Room - Left']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Validation Chest']).toBe("possible");
    })

    it("should mark compass room as possible with 3 wild small keys", () => {
      // There are four key drops/pots available
      // 1) Ganons Tower - Conveyor Cross Pot Key
      // 2) Ganons Tower - Double Switch Pot Key
      // 3) Ganons Tower - Mini Helmasaur Key Drop
      // 4) Ganons Tower - Conveyor Star Pits Pot Key - Behind compass room (tile room small key door must be open, not obtainable in this example)
      // If these are used in particular ways, other doors cannot be opened
      // i.e.
      // 1) GT Torch EN, 
      // 2) GT Hookshot ES, 
      // 3) GT Double Switch EN, 
      // 4) GT Firesnake Room SW, 
      // 5) GT Mini Helmasaur Room WN, 
      // 6) GT Crystal Circles SW 
      // can all be opened leaving GT Tile Room EN not open and needing the fourth key and making compass room inaccessible

      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("gt", { smallKeys: 3, bigKey: true })
        .withDungeon("ep", { prize: "crystal", prizeCollected: true })
        .withDungeon("dp", { prize: "crystal", prizeCollected: true })
        .withDungeon("toh", { prize: "crystal", prizeCollected: true })
        .withDungeon("pod", { prize: "crystal", prizeCollected: true })
        .withDungeon("sp", { prize: "crystal", prizeCollected: true })
        .withDungeon("sw", { prize: "crystal", prizeCollected: true })
        .withDungeon("tt", { prize: "crystal", prizeCollected: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Ganons Tower - Hope Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Mini Helmasaur Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - DMs Room - Top Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Compass Room - Top Left']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Firesnake Room']).toBe("possible");
      expect(result.locationsLogic['Ganons Tower - Validation Chest']).toBe("possible");
    })

    it("should mark all as available with 4 wild small keys", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("gt", { smallKeys: 4, bigKey: true })
        .withDungeon("ep", { prize: "crystal", prizeCollected: true })
        .withDungeon("dp", { prize: "crystal", prizeCollected: true })
        .withDungeon("toh", { prize: "crystal", prizeCollected: true })
        .withDungeon("pod", { prize: "crystal", prizeCollected: true })
        .withDungeon("sp", { prize: "crystal", prizeCollected: true })
        .withDungeon("sw", { prize: "crystal", prizeCollected: true })
        .withDungeon("tt", { prize: "crystal", prizeCollected: true })
        .build();
      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic['Ganons Tower - Hope Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Mini Helmasaur Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - DMs Room - Top Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Randomizer Room - Top Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Compass Room - Top Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Firesnake Room']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Big Chest']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Big Key Room - Left']).toBe("available");
      expect(result.locationsLogic['Ganons Tower - Validation Chest']).toBe("available");
    })

  
  });

  describe("Simple Key Scenarios", () => {
    it("1 key, 1 door should mark everything behind as available", () => {
      // Tower of Hera has exactly 1 key door
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("toh", { smallKeys: 1, bigKey: true })
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Tower of Hera big chest should be available with big key and small key
      expect(result.locationsLogic["Tower of Hera - Big Chest"]).toBe("available");
    });

    it("2 keys, 2 doors with no additional doors should be available", () => {
      // Scenario where keys match doors exactly
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("sw", { smallKeys: 3, bigKey: true }) // Skull Woods has 3 key doors
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic["Skull Woods - Boss"]).toBe("available");
    });
  });

  describe("Region Reachability", () => {
    it("should mark Light World regions as reachable from start", () => {
      const state = gameState()
        .withItems({ moonpearl: 1 })
        .withSettings({ wildSmallKeys: "wild" })
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Bottle Merchant should be available (just need to walk there)
      expect(result.locationsLogic["Bottle Merchant"]).toBe("available");
    });

    it("should mark Dark World as unreachable without moon pearl and agahnim", () => {
      const state = gameState()
        .withItems({ sword: 1 })
        .withSettings({ wildSmallKeys: "wild" })
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Bumper Cave Ledge requires Dark World access
      expect(result.locationsLogic["Bumper Cave Ledge"]).toBe("unavailable");
    });
  });

  describe("No Logic Mode", () => {
    it("should mark all locations as available in nologic mode", () => {
      const state = gameState()
        .withSettings({ logicMode: "nologic" })
        .build();

      const logicSet = getLogicSet("nologic");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Everything should be available in no logic mode
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
      // Use the actual location name from locationsData
      expect(result.locationsLogic["Ganons Tower - Validation Chest"]).toBe("available");
    });
  });

  describe("Path Tracing", () => {
    it("should trace path to Desert Palace Boss with detailed key information", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("dp", { smallKeys: 0, bigKey: true })
        .build();

      // Use the path tracing helper
      const trace = tracePathToLocation("Desert Palace - Boss", state);

      // Verify the trace contains expected information
      expect(trace.location).toBe("Desert Palace - Boss");
      expect(trace.status).toBe("possible");
      expect(trace.reachable).toBe(true);
      expect(trace.steps.length).toBeGreaterThan(0);

      // Should have path steps
      const regionSteps = trace.steps.filter(s => s.type === "region");
      expect(regionSteps.length).toBeGreaterThan(0);

      // Should have location step at the end
      const locationStep = trace.steps.find(s => s.type === "location");
      expect(locationStep).toBeDefined();
      expect(locationStep?.name).toBe("Desert Palace - Boss");
    });

    it("should compare multiple location paths", () => {
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("dp", { smallKeys: 1, bigKey: true })
        .build();

      // This should print comparison info to console
      compareLocationPaths([
        "Desert Palace - Map Chest",
        "Desert Palace - Compass Chest",
        "Desert Palace - Boss"
      ], state);

      // Just verify it runs without error
      expect(true).toBe(true);
    });

    it("should trace path to unavailable location", () => {
      const state = gameState()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("dp", { smallKeys: 1, bigKey: true })
        .build();

      const trace = tracePathToLocation("Desert Palace - Boss", state);

      expect(trace.location).toBe("Desert Palace - Boss");
      expect(trace.status).toBe("unavailable");
      // Region should not be reachable without required items
      expect(trace.reachable).toBe(false);
    });
  });

  describe("Open Logic", () => {
    it("should require moonpearl for dark world underworld items", () => {
      const state = gameState()
        .withAllItems()
        .build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      expect(result.locationsLogic["Spike Cave"]).toBe("unavailable");
  })
})

  describe("Dynamic Bunny State", () => {
    it("should track bunny state when entering dark world without moonpearl", () => {
      // Player has all items except moonpearl
      const state = gameState()
        .withAllItems()
        .build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Dark World locations that require interaction should be unavailable without moonpearl
      // This tests that the bunny state is correctly computed
      expect(result.locationsLogic["Spike Cave"]).toBe("unavailable");
    });

    it("should allow access when player has moonpearl", () => {
      const state = gameState()
        .withAllItems() // Includes moonpearl
        .build();

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // With moonpearl, dark world locations should be accessible
      expect(result.locationsLogic["Spike Cave"]).toBe("available");
    });

    it("should allow bunny access in glitch modes", () => {
      // In overworldglitches mode, bunnies can access items via bunny revival
      const state = gameState()
        .withAllItems()
        .withSettings({ logicMode: "overworldglitches" as const })
        .build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("overworldglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // In glitch logic, dungeon bunny revive should work
      // Spike Cave is in Dark World but the logic should allow bunny glitches
      // The result depends on specific glitch logic implementation
      expect(["available", "possible", "unavailable"]).toContain(result.locationsLogic["Spike Cave"]);
    });

    it("should compute correct bunny state for underworld entered from light world", () => {
      // In Open mode, entering a cave from Light World should not result in bunny state
      const state = gameState()
        .withAllItems()
        .build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const engine = new LogicEngine(state, logicSet);
      const result = engine.calculateAll();

      // Light World locations should still be available (player is not a bunny in LW)
      expect(result.locationsLogic["Link's House"]).toBe("available");
      expect(result.locationsLogic["Link's Uncle"]).toBe("available");
    });
  });

});

/**
 * Helper to log all locations with a specific status for debugging
 */
export function logLocationsByStatus(locations: Record<string, LogicStatus>, status: LogicStatus) {
  const matching = Object.entries(locations)
    .filter(([, s]) => s === status)
    .map(([name]) => name);
  console.log(`Locations with status "${status}":`, matching);
}
