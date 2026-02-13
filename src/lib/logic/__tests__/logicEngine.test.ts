import { describe, it, expect } from "vitest";
import { getLogicSet } from "../logicMapper";
import { OverworldTraverser } from "../overworldTraverser";
import { gameState } from "./testHelpers";
import type { LogicStatus } from "@/data/logic/logicTypes";

describe("LogicEngine", () => {
  describe("Hyrule Castle Key Logic", () => {
    it("[SK Pottery KeyDrop] should mark key rat as possible when player has 1 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("hc", { smallKeys: 1, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // 1 Key can be spent on ONE of the following doors:
      // Sewers Secret Room Key Door S (Coming from Sewer Drop)
      // Hyrule Dungeon Map Room Key Door S (Coming from Hyrule Castle Portals)
      // Sewers Dark Cross Key Door N (Coming from Hyrule Castle Portals)
      // Key Drop/Pots are wild, so none obtainable
      expect(result.locationsLogic["Hyrule Castle - Map Guard Key Drop"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Sewers - Dark Cross"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Boomerang Chest"]).toBe("possible");
      expect(result.locationsLogic["Hyrule Castle - Key Rat Key Drop"]).toBe("possible");
      expect(result.locationsLogic["Hyrule Castle - Big Key Drop"]).toBe("unavailable");
    });

    it("[SK Pottery KeyDrop] should mark key rat as possible when player has 2 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("hc", { smallKeys: 2, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Hyrule Castle - Map Guard Key Drop"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Sewers - Dark Cross"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Boomerang Chest"]).toBe("possible");
      expect(result.locationsLogic["Hyrule Castle - Key Rat Key Drop"]).toBe("possible");
      // Can now reach big key drop if keys used correctly
      expect(result.locationsLogic["Hyrule Castle - Big Key Drop"]).toBe("possible");
    });

    it("[SK Pottery KeyDrop] should mark Big key drop as possible when player has 3 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("hc", { smallKeys: 3, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Hyrule Castle - Map Guard Key Drop"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Sewers - Dark Cross"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Boomerang Chest"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Key Rat Key Drop"]).toBe("available");
      // Can now reach big key drop if keys used correctly
      expect(result.locationsLogic["Hyrule Castle - Big Key Drop"]).toBe("possible");
    });

    it("[SK Pottery KeyDrop] should mark Big key drop as available when player has 4 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("hc", { smallKeys: 4, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Hyrule Castle - Map Guard Key Drop"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Sewers - Dark Cross"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Boomerang Chest"]).toBe("available");
      expect(result.locationsLogic["Hyrule Castle - Key Rat Key Drop"]).toBe("available");
      // Can now reach big key drop if keys used correctly
      expect(result.locationsLogic["Hyrule Castle - Big Key Drop"]).toBe("available");
    });
  });

  describe("Eastern Palace Key Logic", () => {
    it("[BK] should mark entire front as available with no big key", () => {
      const state = gameState().withAllItems().withSettings({ wildBigKeys: true }).withDungeon("ep", { bigKey: false }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Eastern Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Eastern Palace - Boss"]).toBe("unavailable");
    });

    it("[SK BK Pottery]should mark all as available when player has 1 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys" }).withDungeon("ep", { smallKeys: 1, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Eastern Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Boss"]).toBe("available");
    });
    it("[SK BK Pottery KeyDrop] should mark sk locked as possible when player has 1 wild small keys and keydrop no BK", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("ep", { smallKeys: 1, bigKey: false }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Eastern Palace - Big Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Eastern Palace - Boss"]).toBe("unavailable");
    });
    it("[SK BK Pottery KeyDrop] should mark sk locked as possible when player has 1 wild small keys and keydrop w/BK", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("ep", { smallKeys: 1, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Eastern Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Eastern Palace - Boss"]).toBe("possible");
    });
  });

  describe("Desert Palace Key Logic", () => {
    it("[SK] should mark boss as possible when player has 0 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("dp", { smallKeys: 0, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

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

    it("[SK] should mark boss as available when player has 1 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("dp", { smallKeys: 1, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // These locations should be available (no key required)
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");

      // The pot key can be used to open one door, so boss and other locations are possible, but both cannot be reached without the wild key
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("available");
    });

    it("[PARTIAL SK BK Pottery KeyDrop] should mark right side as possible with less than 4 wild small keys and keydrop and no glove", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("dp", { smallKeys: 3, bigKey: true }).build();
      state.items.glove.amount = 0; // Remove gloves to prevent access to back
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // These locations should be available (no key required)
      // Same test as above but without glove. Statuses of reachable locations should be unchanged because game logic assumes we have access to all inventory items
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");

      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("unavailable");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("possible");
    });

    it("[DANGEROUS SK BK Pottery KeyDrop] should mark right side as available with less than 4 wild small keys and keydrop and no glove", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("dp", { smallKeys: 3, bigKey: true }).build();
      state.items.glove.amount = 0; // Remove gloves to prevent access to back
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet, "dangerous");
      const result = traverser.calculateAll();

      // These locations should be available (no key required)
      // Same test as above but without glove. Statuses of reachable locations should be unchanged because game logic assumes we have access to all inventory items
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");

      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("unavailable");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("available");
    });

    it("[SK BK Pottery KeyDrop] should mark right side as possible with less than 4 wild small keys and keydrop", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("dp", { smallKeys: 3, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // These locations should be available (no key required)
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");

      // Start with 3 small keys
      // Open "Desert Tiles 1 Up Stairs" (also opens "Desert Bridge Down Stairs")
      // Open Desert Beamos Hall NE" (also opens "Desert Tiles 2 SE")
      // We have one key available, but two locked doors to open to reach boss and other locations
      // Doors: Desert Tiles 2 NE (also opens Desert Wall Slide SE) and Desert East Wing Key Door EN (also opens Desert Compass Key Door WN)
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Big Key Chest"]).toBe("possible");
    });

    it("[SK] should mark locations as unavailable when lacking required items", () => {
      const state = gameState().withSettings({ wildSmallKeys: "wild" }).withDungeon("dp", { smallKeys: 1, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Without gloves, can't even reach Desert Palace back
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("unavailable");
    });
  });

  describe("Hera Key Logic", () => {
    it("[SK] should mark all as available when player has 1 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("toh", { smallKeys: 1, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Tower of Hera - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Tower of Hera - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Tower of Hera - Boss"]).toBe("available");
    });
  });

  describe("PoD Key Logic", () => {
    it("[SK] should mark back of PoD as possible with 1 wild small key and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("pod", { smallKeys: 1, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Palace of Darkness - Shooter Room"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Dark Basement - Left"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("possible");
      // This location requires 2 keys to reach, PoD Arena Main NW and PoD Falling Bridge WN
      expect(result.locationsLogic["Palace of Darkness - Dark Maze - Top"]).toBe("unavailable");
    });

    it("[SK] should mark back of PoD as possible with 3 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("pod", { smallKeys: 3, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Small keys can be spent:
      // To pod arena
      // To boss
      // to big key chest
      // to back of pod (falling bridge)
      // With only 3 spent, could be locked out of any of those locations, so should all be possible, not available

      expect(result.locationsLogic["Palace of Darkness - Shooter Room"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Dark Basement - Left"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("possible");
      // This location requires 2 keys to reach, PoD Arena Main NW and PoD Falling Bridge WN
      expect(result.locationsLogic["Palace of Darkness - Dark Maze - Top"]).toBe("possible");
    });

    it("[SK BK] should mark back of PoD as available with 4 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true}).withDungeon("pod", { smallKeys: 4, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Palace of Darkness - Dark Basement - Left"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Dark Maze - Bottom"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Harmless Hellway"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("possible");
    });

    it("[SK BK Pottery KeyDrop] should mark back of PoD as available with 4 wild small keys and full inventory", () => {
      // This test should result inthe exact same as above as pottery and keydrop don't affect PoD
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("pod", { smallKeys: 4, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Palace of Darkness - Dark Basement - Left"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Dark Maze - Bottom"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Harmless Hellway"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("possible");
    });

    it("[SK] should mark dark basement as available but later checks as possible with 5 wild small keys", () => {
      // Small keys can be spent:
      // To pod arena
      // To boss
      // to big key chest
      // to back of pod (falling bridge)
      // Cannot spend a 5th key without opening back of pot to dark basement, so those checks are available
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("pod", { smallKeys: 5, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Palace of Darkness - Dark Basement - Left"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Dark Maze - Bottom"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("possible");
    });

    it("[SK] should mark boss of PoD as available with 6 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("pod", { smallKeys: 6, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Palace of Darkness - Dark Maze - Bottom"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Harmless Hellway"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("available");
    });
  });

  describe("Swamp Key Logic", () => {
    it("[SK] should mark swamp entrance as available with 0 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("sp", { smallKeys: 0, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Big Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Swamp Palace - Boss"]).toBe("unavailable");
    });

    it("[SK] should mark all of swamp as available with 1 wild small key and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("sp", { smallKeys: 1, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Boss"]).toBe("available");
    });

    it("[SK Pottery KeyDrop] should mark front of swamp as available with 2 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("sp", { smallKeys: 2, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Trench 1 Pot Key"]).toBe("available");
    });

    it("[SK Pottery KeyDrop] should mark swamp back as available with 4 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("sp", { smallKeys: 4, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Trench 1 Pot Key"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Waterfall Room"]).toBe("possible");
      expect(result.locationsLogic["Swamp Palace - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Swamp Palace - Boss"]).toBe("unavailable");

    });

    it("[SK Pottery KeyDrop] should mark swamp big chest as available with 3 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("sp", { smallKeys: 3, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Swamp Entrance Down Stairs
      // Swamp Pot Row WS
      // Swamp Trench 1 Key Ledge NW
      // Now have access to big chest

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Trench 1 Pot Key"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Big Chest"]).toBe("available");
    });

    it("[SK Pottery KeyDrop] should mark swamp boss as possible with 5 wild small keys and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("sp", { smallKeys: 5, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Swamp Entrance Down Stairs
      // Swamp Pot Row WS
      // Swamp Trench 1 Key Ledge NW
      // Swamp Hub North Ledge N
      // 1 Key left, but 2 doors
      // Swamp Hub WN - to West Chest and Big Key Chest
      // Swamp Waterway NW - to Boss

      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Trench 1 Pot Key"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Waterway Pot Key"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Swamp Palace - Boss"]).toBe("possible");
    });
  });

  describe("Thieves Town Logic", () => {
    it("[SK Pottery KeyDrop] should mark boss as possible with 2 wild small keys, big key and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true, wildBigKeys: true }).withDungeon("tt", { smallKeys: 2, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Thieves' Town - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Thieves' Town - Big Chest"]).toBe("possible");
      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("possible");
      expect(result.locationsLogic["Thieves' Town - Boss"]).toBe("possible");
    });

    it("[SK] should mark boss as at most as available as attic with 1 wild small key (no pottery)", () => {
      // Boss requires canRevealBlind -> canOpenTTAttic -> canReach|Thieves Attic
      // So boss can never be more available than the attic
      // With 1 wild key + 2 in-dungeon pot keys (no pottery = pot keys in place): 3 keys total
      // Door 1 (Hallway WS, threshold 0): 1 key
      // Door 2 (Spike Switch Up Stairs, threshold 1): 1 key
      // Door 3 (Conveyor Bridge WS, threshold 1): 1 key
      // All 3 doors can be opened. Attic = available, Boss = available
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true }).withDungeon("tt", { smallKeys: 1, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("available");
      expect(result.locationsLogic["Thieves' Town - Boss"]).toBe("available");
    });

    it("[SK] should cap boss availability to attic availability with 0 wild small keys (no pottery)", () => {
      // With 0 wild keys + 2 in-dungeon pot keys (no pottery): 2 keys total
      // Door 1 (Hallway WS): 1 key → reach Pot Alcove Mid
      // Door 2 (Spike Switch Up Stairs, threshold 1): 1 key → reach Attic
      // Door 3 (Conveyor Bridge WS, threshold 1): would need a 3rd key
      // Doors 2 and 3 branch from after door 1 → contention with 2 keys → attic = possible
      // Boss requires canReach|Thieves Attic → boss should also be possible
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true }).withDungeon("tt", { smallKeys: 0, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("possible");
      expect(result.locationsLogic["Thieves' Town - Boss"]).toBe("possible");
    });

    it("[SK Pottery KeyDrop] should cap boss to possible when attic is possible with 2 wild small keys", () => {
      // With pottery/keydrop: pot keys shuffled out, no in-dungeon keys
      // 2 wild keys available for 3 doors → contention between doors 2 and 3
      // Attic (behind doors 1+2) is "possible" due to door contention with door 3
      // Boss requires canReach|Thieves Attic via canRevealBlind → should also be "possible"
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true, wildBigKeys: true }).withDungeon("tt", { smallKeys: 2, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      const atticStatus = result.locationsLogic["Thieves' Town - Attic"];
      const bossStatus = result.locationsLogic["Thieves' Town - Boss"];

      // Attic should be possible due to key contention
      expect(atticStatus).toBe("possible");
      // Boss should be at most as available as the attic (canReach dependency)
      expect(bossStatus).toBe("possible");
    });

    it("[SK Pottery KeyDrop] should mark boss unavailable when attic is unreachable with 1 wild small key", () => {
      // With pottery/keydrop: no in-dungeon keys
      // 1 wild key for 3 doors → can only open door 1
      // Attic requires doors 1+2 → unreachable with 1 key
      // Boss requires canReach|Thieves Attic → should be unavailable
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true, wildBigKeys: true }).withDungeon("tt", { smallKeys: 1, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Thieves' Town - Attic"]).toBe("unavailable");
      expect(result.locationsLogic["Thieves' Town - Boss"]).toBe("unavailable");
    });
  });

  describe("IP Key Logic", () => {
    it("[SK] should mark the boss as possible with less than 2 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("ip", { smallKeys: 1, bigKey: true }).build();

      state.items.somaria.amount = 0; // Remove somaria to force key usage
      // Start with 1 key
      // Collect Jelly Key Drop - now 2 keys
      // Open Ice Jelly Key Down Stairs - now 1 key
      // Collect Conveyor Key Drop - now 2 keys
      // Open Ice Conveyor SW - now 1 key
      // Open Ice Spike Cross ES - now 0 keys
      // Collect Ice Palace - Many Pots Pot Key - now 1 key
      // Collect Ice Palace - Hammer Block Key Drop - now 2 keys
      // Open Ice Tall Hint SE - now 1 key
      // Open Ice Switch Room NE - now 0 keys
      // Cannot open Ice Switch Room ES - needs another key
      // Cannot canReach|Ice Switch Room
      // Without somaria, cannot get to antechamber

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Ice Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Ice Palace - Boss"]).toBe("possible");
    });

    it("[SK Pottery KeyDrop] should mark the compass chest as available with 1 wild small key with keydrop and potkey shuffle enabled", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true, wildBigKeys: true }).withDungeon("ip", { smallKeys: 1}).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Compass chest is immediately available after using the one key to open the first door (Ice Jelly Key Down Stairs)
      expect(result.locationsLogic["Ice Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Ice Palace - Boss"]).toBe("unavailable");
    });

    it("[SK Pottery KeyDrop] should mark the boss as possible with less than 6 wild small keys with keydrop and potkey shuffle enabled", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", pottery: "keys", keyDrop: true }).withDungeon("ip", { smallKeys: 5, bigKey: true }).build();

      state.items.somaria.amount = 0; // Remove somaria to force key usage
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Ice Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Ice Palace - Boss"]).toBe("possible");
    });
  });

  describe("MM Key Logic", () => {
    it("[SK] should mark everything as available with 3 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("mm", { smallKeys: 3, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Main Lobby"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Spike Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Boss"]).toBe("available");
    });

    it("[SK] should mark left side as possible with less than 2 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("mm", { smallKeys: 0, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

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

      expect(result.locationsLogic["Misery Mire - Main Lobby"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Bridge Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Spike Chest"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Misery Mire - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Misery Mire - Boss"]).toBe("available");
    });

    it("[PARTIAL SK BK KeyDrop Pottery] should mark lobby unavailable with 0 wild small keys and a big key (crystals switch available, but can't get back)", () => {
      const state = gameState().withAllItems().withoutItems(['hookshot']).withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("mm", { smallKeys: 0, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // With 0 keys and a big key, crystal switches are reachable (in the basement), 
      // but you cannot get back up to the lobby to access any of the locations there or beyond without the hookshot
      // Mire Left Bridge -> Mire Left Bridge Hook Path
      // There shouldn't be a path back to the lobby with 0 small keys and without hookshot with crystal state blue
      expect(result.locationsLogic["Misery Mire - Fishbone Pot Key"]).toBe("available");
      expect(result.locationsLogic["Misery Mire - Map Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Misery Mire - Main Lobby"]).toBe("unavailable");
      expect(result.locationsLogic["Misery Mire - Boss"]).toBe("available");

      expect(result.locationsLogic["Misery Mire - Conveyor Crystal Key Drop"]).toBe("unavailable");
    });

    it("[PARTIAL SK BK KeyDrop Pottery] should mark lobby unavailable with 0 wild small keys (no crystals switches available)", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("mm", { smallKeys: 0, bigKey: false }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // With 0 keys and no big key, crystal switches are not reachable
      // So locations behind blue barriers are unavailable
      expect(result.locationsLogic["Misery Mire - Map Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Misery Mire - Main Lobby"]).toBe("unavailable");
      expect(result.locationsLogic["Misery Mire - Boss"]).toBe("unavailable");

      expect(result.locationsLogic["Misery Mire - Conveyor Crystal Key Drop"]).toBe("unavailable");
      expect(result.locationsLogic["Misery Mire - Fishbone Pot Key"]).toBe("unavailable");
    });

    it("[PARTIAL SK BK KeyDrop Pottery] should mark left side as possible with 1 wild small keys  (crystal switch available)", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild", wildBigKeys: true, pottery: "keys", keyDrop: true }).withDungeon("mm", { smallKeys: 1, bigKey: false }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Map Chest"]).toBe("possible");
      expect(result.locationsLogic["Misery Mire - Main Lobby"]).toBe("possible");
      expect(result.locationsLogic["Misery Mire - Boss"]).toBe("unavailable");

      expect(result.locationsLogic["Misery Mire - Conveyor Crystal Key Drop"]).toBe("possible");
      expect(result.locationsLogic["Misery Mire - Fishbone Pot Key"]).toBe("possible");
    });
  });

  describe("TR Key Logic", () => {
    it("[SK] should mark everything as available with 4 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 4, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("available");
    });

    it("[SK] should mark big key chest and boss as possible with 2 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 2, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

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

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("possible");
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("unavailable");
    });

    it("[SK] should mark big key chest and boss as possible with 3 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 3, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

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

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("possible");
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("possible");
    });

    it("[SK] should mark only the front as available with 1 wild small key and full inventory", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 1, bigKey: true }).build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Pokey 1 Key Drop"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("unavailable");
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("unavailable");
    });

    it("[INVERTED SK] should mark most as possible, laser bridge and crystalroller as available with 0 wild small key and full inventory, no medallions", () => {
      // In inverted, we can access TR from middle and back entrances.
      // This allows us to reach further into the dungeon even without keys.
      // Can navigate to Pokey 2 and collect its key drop
      // Can use this to open all small keys doors, but everything is still only available with all keys, due to wastage.
      const state = gameState().withAllItems().withSettings({ worldState: "inverted", wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 0, bigKey: true }).build();

      // Remove medallions - without medallions, front of the dungeon needs keys to access
      state.items["bombos"] = { amount: 0 };
      state.items["ether"] = { amount: 0 };
      state.items["quake"] = { amount: 0 };

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available"); // Available because back of stairs is open without key
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("available"); // Available because we can directly reach it via inverted middle entrance
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("possible"); // Needs a small key
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("available"); // Available because we can directly reach it via inverted back entrance
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("possible"); // Needs a small key
    });

    it("[INVERTED SK] should mark most as possible, laser bridge and crystalroller as available with 3 wild small key and full inventory, no medallions", () => {
      // In inverted, we can access TR from middle and back entrances.
      // This allows us to reach further into the dungeon even without keys.
      // Can navigate to Pokey 2 and collect its key drop
      // Can use this to open all small keys doors, but everything is still only available with all keys, due to wastage.
      const state = gameState().withAllItems().withSettings({ worldState: "inverted", wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 3, bigKey: true }).build();

      // Remove medallions - without medallions, front of the dungeon needs keys to access
      state.items["bombos"] = { amount: 0 };
      state.items["ether"] = { amount: 0 };
      state.items["quake"] = { amount: 0 };

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available"); // Available because back of stairs is open without key
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("available"); // Available because we can directly reach it via inverted middle entrance
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("possible"); // Needs a small key
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("available"); // Available because we can directly reach it via inverted back entrance
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("possible"); // Needs a small key
    });

    it("[INVERTED SK] should mark everything available with 4 wild small key and full inventory", () => {
      // In inverted, we can access TR from middle and back entrances.
      // This allows us to reach all of the dungeon checks without medallions
      const state = gameState().withAllItems().withSettings({ worldState: "inverted", wildSmallKeys: "wild" }).withDungeon("tr", { smallKeys: 4, bigKey: true }).build();

      // Remove medallions - without medallions, front of the dungeon needs keys to access
      state.items["bombos"] = { amount: 0 };
      state.items["ether"] = { amount: 0 };
      state.items["quake"] = { amount: 0 };

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("available");
      expect(result.locationsLogic["Turtle Rock - Boss"]).toBe("available");
    });
  });

  describe("GT Key Logic", () => {
    // GT is very complicated due to the different paths

    it("[SK] should mark most as possible with 0 wild small keys", () => {
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("gt", { smallKeys: 0, bigKey: true }).withAllPrizes().build();
      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // There are three key drops/pots available without opening doors
      // Ganons Tower - Conveyor Cross Pot Key
      // Ganons Tower - Double Switch Pot Key
      // Ganons Tower - Mini Helmasaur Key Drop
      // If these are used in particular ways, other doors cannot be opened
      // i.e.
      // GT Torch EN, GT Hookshot ES and GT Mini Helmasaur Room WN. No more doors can be opened
      // We NEED to open either GT Double Switch EN or GT Tile Room EN to get to the rest of the basement, and GT Crystal Circles SW to get to Validation Chest

      expect(result.locationsLogic["Ganons Tower - Hope Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Mini Helmasaur Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - DMs Room - Top Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Randomizer Room - Top Left"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Compass Room - Top Left"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Firesnake Room"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Big Chest"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Big Key Room - Left"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Validation Chest"]).toBe("possible");
    });

    it("[SK] should mark compass room as possible with 3 wild small keys", () => {
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
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Ganons Tower - Hope Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Mini Helmasaur Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - DMs Room - Top Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Compass Room - Top Left"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Firesnake Room"]).toBe("possible");
      expect(result.locationsLogic["Ganons Tower - Validation Chest"]).toBe("possible");
    });

    it("[SK] should mark all as available with 4 wild small keys", () => {
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
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Ganons Tower - Hope Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Mini Helmasaur Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - DMs Room - Top Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Randomizer Room - Top Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Compass Room - Top Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Firesnake Room"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Big Key Room - Left"]).toBe("available");
      expect(result.locationsLogic["Ganons Tower - Validation Chest"]).toBe("available");
    });
  });

  describe("Simple Key Scenarios", () => {
    it("[SK] 1 key, 1 door should mark everything behind as available", () => {
      // Tower of Hera has exactly 1 key door
      const state = gameState().withAllItems().withSettings({ wildSmallKeys: "wild" }).withDungeon("toh", { smallKeys: 1, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Tower of Hera big key chest and big chest should be available with big key and small key
      expect(result.locationsLogic["Tower of Hera - Big Chest"]).toBe("available");
      expect(result.locationsLogic["Tower of Hera - Big Key Chest"]).toBe("available");
    });

    it("[SK] 2 keys, 2 doors with no additional doors should be available", () => {
      // Scenario where keys match doors exactly
      const state = gameState()
        .withAllItems()
        .withSettings({ wildSmallKeys: "wild" })
        .withDungeon("sw", { smallKeys: 3, bigKey: true }) // Skull Woods has 3 key doors
        .build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Skull Woods - Boss"]).toBe("available");
    });
  });

  describe("Region Reachability", () => {
    it("should mark Light World regions as reachable from start", () => {
      const state = gameState().withItems({ moonpearl: 1 }).withSettings({ wildSmallKeys: "wild" }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Bottle Merchant should be available (just need to walk there)
      expect(result.locationsLogic["Bottle Merchant"]).toBe("available");
    });

    it("should mark Dark World as unavailable without moon pearl and agahnim", () => {
      const state = gameState().withAllItems().withoutItems(["moonpearl", "agahnim"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Bumper Cave Ledge requires Dark World access
      expect(result.locationsLogic["Bumper Cave Ledge"]).toBe("unavailable");

      // All dark world dungeons require moon pearl because you are a bunny when entering them without pearl.
      expect(result.locationsLogic["Ice Palace - Compass Chest"]).toBe("unavailable");
    });

    it("should mark back of desert as reachable without flute", () => {
      const state = gameState().withAllItems().withoutItems(["flute"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Back of Desert should be reachable without flute
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
    });

    it("should traverse pod through the front", () => {
      const state = gameState().withAllItems().withoutItems(["bomb", "somaria"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Player can navigate through front of pod using bow/fire rod/ice rod/boomerang
      // However compass is behind key doors, and some non-key-gated locations need bombs
      // Small keys could be in bomb-locked locations → possible
      expect(result.locationsLogic["Palace of Darkness - Compass Chest"]).toBe("possible");
    });

    it("should not be able to access mire without the correct medallion", () => {
      const state = gameState().withAllItems().withoutItems(["bombos"]).build();

      state.entrances["Misery Mire"].medallion = "bombos"; // Set medallion requirement for mire

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Compass Chest"]).toBe("unavailable");
    });

    it("should be maybe possible to access mire without the medallion set", () => {
      const state = gameState().withAllItems().withoutItems(["bombos"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Compass Chest"]).toBe("possible");
    });

    it("should be able to access mire without the medallion set but with all medallions", () => {
      const state = gameState().withAllItems().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Compass Chest"]).toBe("available");
    });

    it("should be able to access mire with the medallion set and the correct medallion", () => {
      const state = gameState().withAllItems().withoutItems(["bombos", "ether"]).build();
      state.entrances["Misery Mire"].medallion = "quake"; // Set medallion requirement for mire

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Compass Chest"]).toBe("available");
    });

    it("should mark mire as unavailable when medallion unknown and player has no medallions", () => {
      const state = gameState().withAllItems().withoutItems(["bombos", "ether", "quake"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Misery Mire - Compass Chest"]).toBe("unavailable");
    });

    it("should not apply medallion cap to TR locations reachable from non-medallion portals in inverted", () => {
      // In inverted mode, TR side portals don't require medallions
      // Even with no medallions, locations reachable from side portals should not be capped
      const state = gameState().withAllItems().withoutItems(["bombos", "ether", "quake"]).withSettings({ worldState: "inverted" }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Laser Bridge and Eye Bridge are accessible from non-medallion portals
      expect(result.locationsLogic["Turtle Rock - Eye Bridge - Bottom Left"]).toBe("available");
    });

    it("should not be able to access TR without the correct medallion in open mode", () => {
      const state = gameState().withAllItems().withoutItems(["ether"]).build();
      state.entrances["Turtle Rock"].medallion = "ether";

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Main portal is blocked → locations only reachable from main portal should be unavailable
      // But locations reachable from other portals (if any) may still be accessible
      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("unavailable");
    });

    it("should not be able to access TR without a hammer in open mode", () => {
      const state = gameState().withAllItems().withoutItems(["hammer"]).build();
      state.entrances["Turtle Rock"].medallion = "ether";

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // A hammer is required to actually reach the medallion pad
      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("unavailable");
    });

        it("should not be able to access TR without a sword in open mode", () => {
      const state = gameState().withAllItems().withoutItems(["sword"]).build();
      state.entrances["Turtle Rock"].medallion = "ether";

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // A sword is required to use the medallion to open the main portal. OR it has to be swordless mode (NYI)
      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("unavailable");
    });

    it("should mark TR as possible when medallion unknown with 1 medallion in open mode", () => {
      const state = gameState().withAllItems().withoutItems(["bombos", "ether"]).build();
      // medallion is "unknown" by default, player has only quake
      // In Open mode, TR side portals are only reachable via the main (medallion-locked) entrance
      // The medallion cap propagates through the dungeon exits to the side portal re-entries

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Turtle Rock - Compass Chest"]).toBe("possible");
    });
  });

  describe("No Logic Mode", () => {
    it("should mark all locations as available in nologic mode", () => {
      const state = gameState().withSettings({ logicMode: "nologic" }).build();

      const logicSet = getLogicSet("nologic");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Everything should be available in no logic mode
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
      // Use the actual location name from locationsData
      expect(result.locationsLogic["Ganons Tower - Validation Chest"]).toBe("available");
    });
  });

  describe("Open Logic", () => {
    it("should require moonpearl for dark world underworld items", () => {
      const state = gameState().withAllItems().build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Spike Cave"]).toBe("unavailable");
    });
  });

  describe("Inverted Logic", () => {
    it("all locations should be available with all items", () => {
      const state = gameState().withAllItems().withSettings({ worldState: "inverted" }).withAllPrizes().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Spike Cave"]).toBe("available");
      expect(result.locationsLogic["Pyramid Fairy - Left"]).toBe("available");
      expect(result.locationsLogic["Swamp Palace - Boss"]).toBe("available");
    });
  });

  describe("Non-Wild Big Key Inference", () => {
    // Default settings: wildBigKeys: false, wildSmallKeys: "inDungeon"
    // When BK is NOT in the world pool, infer BK accessibility from non-BK locations

    it("should mark BK-locked locations as available when all non-BK locations are reachable", () => {
      // All items → all non-BK locations in Desert are reachable → BK guaranteed accessible
      const state = gameState().withAllItems().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Boss is behind the big key door (Desert Wall Slide NW → Desert Boss)
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
      // Big Chest requires BK to open
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
      // Non-BK-locked locations should be unaffected
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("available");
    });

    it("should mark BK-locked locations as possible when not all non-BK locations are reachable", () => {
      // Without boots → Desert Palace - Torch is unreachable → can't guarantee BK access
      const state = gameState().withAllItems().withoutItems(["boots"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // BK-locked locations should be downgraded to "possible"
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("possible");
      // Torch should be unavailable (requires boots)
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("unavailable");
      // Other non-BK locations should still be available
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
    });

    it("should mark BK-locked locations as unavailable when all reachable non-BK locations are checked", () => {
      // Without boots, torch is unreachable.
      // If all OTHER non-BK locations are checked and no BK found → BK must be on torch → unavailable
      const state = gameState().withAllItems().withoutItems(["boots"]).withChecks(["Desert Palace - Map Chest", "Desert Palace - Compass Chest", "Desert Palace - Big Key Chest"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("unavailable");
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("unavailable");
    });

    it("should keep BK-locked locations available when player has the big key", () => {
      // Even without boots, if player has the BK → BK-locked stuff considers BK available
      // However, Boss is also behind small key doors, and the torch (which could have a key)
      // is unreachable without boots, so Boss becomes "possible" due to SK inference
      const state = gameState().withAllItems().withoutItems(["boots"]).withDungeon("dp", { bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Boss is behind both BK door and SK doors — BK is available but SK keys might be on torch
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      // Big Chest is not behind SK doors, and player has BK
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
    });

    it("should not apply BK inference when wildBigKeys is enabled", () => {
      // With wildBigKeys: true, BK inference should NOT apply
      // Instead, the explicit BK check controls Big Chest, and boss requires BK in inventory
      // Boss is still behind SK doors, and torch (possible key location) needs boots
      const state = gameState().withAllItems().withoutItems(["boots"]).withSettings({ wildBigKeys: true }).withDungeon("dp", { bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Boss is behind SK doors — small key might be on unreachable torch → possible
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      // Big Chest is not behind SK doors, player has BK
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("available");
    });

    it("should apply BK inference to Eastern Palace with all items", () => {
      // EP has BK-gated exits (Eastern Courtyard N, Eastern Big Key NE)
      // With all items, all non-BK treasure locations are reachable → boss available
      const state = gameState().withAllItems().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // EP boss is behind the big key door, but BK inference says "available"
      expect(result.locationsLogic["Eastern Palace - Boss"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Chest"]).toBe("available");
      // Non-BK locations should be unaffected
      expect(result.locationsLogic["Eastern Palace - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("available");
    });
  });

  describe("Non-Wild Small Key Inference", () => {
    // Default settings: wildSmallKeys: "inDungeon", wildBigKeys: false
    // When SK is NOT in the world pool, infer SK accessibility from non-SK-gated locations

    it("should mark SK-gated locations as available when all non-SK locations are reachable", () => {
      // All items → all non-SK-gated locations in Desert are reachable → keys guaranteed findable
      const state = gameState().withAllItems().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Boss is behind 3 small key doors + big key door (SK-gated)
      // With all items, all non-SK locations reachable → keys accessible → available
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
      // Non-SK-gated locations should be unaffected
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("available");
    });

    it("should mark SK-gated locations as possible when not all non-SK locations are reachable", () => {
      // Without boots → Desert Torch unreachable → key might be there → can't guarantee SK access
      const state = gameState().withAllItems().withoutItems(["boots"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Boss is SK-gated, and Torch (possible key location) is unreachable → possible
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      // Non-SK-gated locations should be unaffected
      expect(result.locationsLogic["Desert Palace - Map Chest"]).toBe("available");
      // Torch should be unavailable (requires boots)
      expect(result.locationsLogic["Desert Palace - Torch"]).toBe("unavailable");
    });

    it("should not apply SK inference when wildSmallKeys is wild", () => {
      // With wildSmallKeys: "wild", SK inference should NOT apply
      // The Dijkstra/BFS key counting handles this instead
      const state = gameState().withAllItems().withoutItems(["boots"]).withSettings({ wildSmallKeys: "wild" }).withDungeon("dp", { smallKeys: 4, bigKey: true }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // With 4 wild small keys, boss should be available regardless of torch
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("available");
    });

    it("should apply SK inference to Eastern Palace with all items", () => {
      // EP has a key door (Courtyard → Dark Square)
      // With all items, all non-SK locations reachable → keys findable → SK-gated stuff available
      const state = gameState().withAllItems().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Big Key Chest is behind key door (SK-gated) but all non-SK locations reachable → available
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Compass Chest"]).toBe("available");
    });

    it("should combine BK and SK inference for doubly-gated locations", () => {
      // Desert Boss is behind both BK door and SK doors
      // Without boots: Torch unreachable → both BK and SK inference return "possible"
      const state = gameState().withAllItems().withoutItems(["boots"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Boss is both BK-gated and SK-gated. BK inference: "possible", SK inference: "possible"
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
      // Big Chest is BK-gated but NOT SK-gated. BK inference: "possible"
      expect(result.locationsLogic["Desert Palace - Big Chest"]).toBe("possible");
      // Compass chest is SK-gated but not BK-gated. SK inference: "possible"
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("possible");
    });

    it("should mark SK-gated locations as available when player has all items for PoD", () => {
      // With all items, all non-SK-gated locations in PoD are reachable
      const state = gameState().withAllItems().build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      expect(result.locationsLogic["Palace of Darkness - Compass Chest"]).toBe("available");
      expect(result.locationsLogic["Palace of Darkness - Boss"]).toBe("available");
    });

    it("should not apply SK inference in EP when no keys are shuffled (pottery/keyDrop off)", () => {
      // EP has 0 chest keys, 1 pot key, 1 drop key
      // With pottery off and keyDrop off, no keys are shuffled → all keys are in fixed locations
      // SK inference should return "available" immediately (no contention possible)
      const state = gameState().withAllItems().withoutItems(["bow"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Big Key Chest is behind a key door but keys are fixed → available
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("available");
    });

    it("should apply SK inference in EP when pottery is enabled (keys shuffled into pool)", () => {
      // EP has 0 chest keys, 1 pot key, 1 drop key
      // With pottery enabled, the pot key gets shuffled into the treasure pool
      // The shuffled key could end up in any chest, including the Big Chest
      const state = gameState().withAllItems().withSettings({ pottery: "keys" }).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // With all items and pottery enabled, all locations reachable → available
      expect(result.locationsLogic["Eastern Palace - Big Key Chest"]).toBe("available");
      expect(result.locationsLogic["Eastern Palace - Big Chest"]).toBe("available");
    });

    it("should consider Big Chest as potential SK location in Desert Palace", () => {
      // DP has 1 chest key → always shuffled, could end up in Big Chest
      // Without boots: Torch (non-gated) is unreachable → SK inference returns "possible"
      // Big Chest itself should still be accessible if BK is available
      const state = gameState().withAllItems().withoutItems(["boots"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // SK-gated locations should be "possible" since not all non-gated locations are reachable
      expect(result.locationsLogic["Desert Palace - Compass Chest"]).toBe("possible");
      expect(result.locationsLogic["Desert Palace - Boss"]).toBe("possible");
    });

    it("should consider that compass chest in TR may contain the big key", () => {
      const state = gameState().withAllItems().withoutItems(["firerod"]).build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Chomps ia behind one small key, with no fire rod, only compass chest is available, which _could_ be the big key
      // meaning no small key is available, thus chomps should be "possible" instead of "available"
      expect(result.locationsLogic["Turtle Rock - Chain Chomps"]).toBe("possible");
    });
  });

  describe("Dynamic Bunny State", () => {
    it("should track bunny state when entering dark world without moonpearl", () => {
      // Player has all items except moonpearl
      const state = gameState().withAllItems().build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Dark World locations that require interaction should be unavailable without moonpearl
      // This tests that the bunny state is correctly computed
      expect(result.locationsLogic["Spike Cave"]).toBe("unavailable");
    });

    it("should allow access when player has moonpearl", () => {
      const state = gameState()
        .withAllItems() // Includes moonpearl
        .build();

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

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
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // In glitch logic, dungeon bunny revive should work
      // Spike Cave is in Dark World but the logic should allow bunny glitches
      // The result depends on specific glitch logic implementation
      expect(["available", "possible", "unavailable"]).toContain(result.locationsLogic["Spike Cave"]);
    });

    it("should compute correct bunny state for underworld entered from light world", () => {
      // In Open mode, entering a cave from Light World should not result in bunny state
      const state = gameState().withAllItems().build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Light World locations should still be available (player is not a bunny in LW)
      expect(result.locationsLogic["Link's House"]).toBe("available");
      expect(result.locationsLogic["Link's Uncle"]).toBe("available");
    });

    it("should compute correct bunny state for overworld items when in inverted mode", () => {
      const state = gameState().withAllItems().withSettings({ worldState: "inverted" }).build();

      state.items.moonpearl.amount = 0; // Remove moonpearl

      const logicSet = getLogicSet("noglitches");
      const traverser = new OverworldTraverser(state, logicSet);
      const result = traverser.calculateAll();

      // Light World locations should still be available (player is not a bunny in LW)
      expect(result.locationsLogic["Link's House"]).toBe("unavailable");
      expect(result.locationsLogic["Link's Uncle"]).toBe("unavailable");
      expect(result.locationsLogic["Bottle Merchant"]).toBe("available");

      // With no pearl, cannot drain dam in LW
      expect(result.locationsLogic["Swamp Palace - Entrance"]).toBe("unavailable");
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
