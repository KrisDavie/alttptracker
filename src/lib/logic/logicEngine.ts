import type { ItemsState } from "@/store/itemsSlice";
import type { LogicSet } from "./logicMapper";
import type { LogicRequirement, LogicStatus, WorldLogic, LogicState } from "@/data/logic/logicTypes";
import type { SettingsState } from "@/store/settingsSlice";
import type { DungeonsState } from "@/store/dungeonsSlice";
import type { EntrancesState } from "@/store/entrancesSlice";

interface GameState {
  items: ItemsState;
  settings: SettingsState;
  dungeons: DungeonsState;
  entrances: EntrancesState;
}

// Where are we? Which keys etc. should we consider?
interface EvaluationContext {
  dungeonId?: string;
  regionName?: string;
}

export class LogicEngine {
  private state: GameState;
  private logicSet: LogicSet;

  // Store evaluated regions to avoid infinite loops and redundant calculations
  private regionCache: Map<string, LogicStatus> = new Map();
  private evaluatingRegions: Set<string> = new Set();

  constructor(state: GameState, logicSet: LogicSet) {
    this.state = state;
    this.logicSet = logicSet;
  }

  public calculateAll(): Record<"locationsLogic" | "entrancesLogic", Record<string, LogicStatus>> {
    this.regionCache.clear();

    // Pre-calculate all regions to populate cache
    Object.keys(this.logicSet.regions).forEach((r) => this.evaluateRegion(r));

    // Actually calculate locations and entrances
    return {
      locationsLogic: {
        ...this.calculateLocations(),
        ...this.calculateDungeons(),
      },
      entrancesLogic: this.calculateEntrances(),
    };
  }

  private hasItem(item: string): boolean {
    const items = this.state.items;
    return items[item as keyof ItemsState]?.amount > 0;
  }

  private getLogicState(worldLogic: WorldLogic): LogicState {
    const mode = this.state.settings.worldState === "inverted" ? "Inverted" : "Open";
    const requirements = worldLogic[mode] || worldLogic.Standard || {};

    if (typeof requirements === "string" || (typeof requirements === "object" && requirements !== null && ("allOf" in requirements || "anyOf" in requirements))) {
      return { always: requirements as LogicRequirement };
    }
    return requirements as LogicState;
  }

  private evaluateRequirement(req: LogicRequirement, ctx: EvaluationContext): boolean {
    if (!req) return true;

    // Handle Strings (e.g., "bomb", "canReach|Light World", "keys|2")
    if (typeof req === "string") {
      if (req.includes("|")) {
        return this.resolveComplex(req, ctx);
      }
      return this.resolveSimple(req, ctx);
    }

    // Handle Objects (allOf / anyOf)
    if (typeof req === "object" && req !== null) {
      if ("allOf" in req) return req.allOf.every((r) => this.evaluateRequirement(r, ctx));
      if ("anyOf" in req) return req.anyOf.some((r) => this.evaluateRequirement(r, ctx));
    }

    return true;
  }

  private bossesKillStatus() {
    const killableBosses: Record<string, boolean> = {};
    killableBosses["armos"] =
      this.resolveSimple("melee_bow", {}) ||
      this.resolveSimple("boomerang", {}) ||
      this.resolveSimple("cane", {}) || // TODO: Check this logic
      this.resolveSimple("rod", {}); // TODO: Check this logic

    killableBosses["lanmolas"] =
      this.resolveSimple("melee_bow", {}) ||
      this.resolveSimple("cane", {}) || // TODO: Check this logic
      this.resolveSimple("rod", {});

    killableBosses["moldorm"] = this.resolveSimple("melee", {});

    killableBosses["helmasaurking"] = this.resolveSimple("melee_bow", {}) && (this.resolveSimple("bomb", {}) || this.resolveSimple("hammer", {}));

    killableBosses["arrghus"] =
      this.resolveSimple("hookshot", {}) &&
      (this.resolveSimple("melee", {}) ||
        (this.resolveSimple("bow", {}) && this.resolveSimple("rod", {})) || // TODO: Check this logic
        (this.resolveSimple("bomb", {}) && this.resolveSimple("rod", {}) && (this.getBottleCount() > 1 || (this.getBottleCount() > 0 && this.resolveSimple("magic", {}))))); // TODO: Check this logic

    killableBosses["mothula"] = this.resolveSimple("melee", {}) || this.resolveSimple("firerod", {}) || this.resolveSimple("cane", {});

    killableBosses["blind"] = this.resolveSimple("melee", {}) || this.resolveSimple("cane", {});

    killableBosses["kholdstare"] = this.resolveSimple("firerod", {}) && (this.resolveSimple("melee", {}) || this.resolveSimple("magic", {}));
    // TODO: Add swordless logic

    killableBosses["vitreous"] = this.resolveSimple("melee_bow", {});

    killableBosses["trinexx"] =
      this.resolveSimple("firerod", {}) && this.resolveSimple("icerod", {}) && (this.resolveSimple("swordbeams", {}) || this.resolveSimple("hammer", {}) || (this.resolveSimple("sword", {}) && this.resolveSimple("magic", {})));

    killableBosses["agahnim"] = this.resolveSimple("melee", {}) || this.resolveSimple("net", {}); // TODO: Add swordless logic
    killableBosses["agahnim2"] = this.resolveSimple("melee", {}) || this.resolveSimple("net", {}); // TODO: Add swordless logic
    killableBosses["bnc"] = true; // Only HC and pots in room

    return killableBosses;
  }

  private getBottleCount(): number {
    let count = 0;
    for (let i = 1; i <= 4; i++) {
      if (this.hasItem(`bottle${i}`)) count++;
    }
    return count;
  }

  private getCrystalCount(): number {
    return Object.values(this.state.dungeons).filter((d) => d.prizeCollected && (d.prize === "crystal" || d.prize === "redCrystal")).length;
  }

  private getRedCrystalCount(): number {
    return Object.values(this.state.dungeons).filter((d) => d.prizeCollected && d.prize === "redCrystal").length;
  }

  private getPendantCount(): number {
    return Object.values(this.state.dungeons).filter((d) => d.prizeCollected && (d.prize === "pendant" || d.prize === "greenPendant")).length;
  }

  private resolveSimple(condition: string, ctx: EvaluationContext): boolean {
    const items = this.state.items;
    let killableBosses;
    

    // Other complex checks
    switch (condition) {
      case "agahnim":
        return this.state.dungeons["ct"].bossDefeated;
      case "agagnim2":
        return this.state.dungeons["gt"].bossDefeated;
      case "bigkey":
        if (ctx.dungeonId) {
          const dungeon = this.state.dungeons[ctx.dungeonId];
          return dungeon.bigKey;
        }
        return false;
      case "bombs":
        return this.hasItem("bomb");
      case "bottle":
        return this.getBottleCount() > 0;
      case "bow":
        // Bow requires 2 to use (1 to have, 1 to use)
        return items.bow.amount > 1;
      case "flute":
        // TODO: CanActivateFlute logic
        return items.flute.amount > 0;
      case "melee":
        return this.hasItem("sword") || this.hasItem("hammer");
      case "melee_bow":
        return this.resolveSimple("melee", ctx) && this.resolveSimple("bow", ctx);
      case "mitts":
        return items.glove.amount > 1;
      case "mirrorshield":
        return items.shield.amount > 2;
      case "swordbeams":
        return items.sword.amount > 1;
      case "greenpendant":
        return Object.values(this.state.dungeons).some((d) => d.prizeCollected && d.prize === "greenPendant");
      case "canPullPedestal":
        return this.getPendantCount() === 3;
      case "rod":
        return this.hasItem("firerod") || this.hasItem("icerod");
      case "cane":
        return this.hasItem("somaria") || this.hasItem("byrna");
      case "canKillSomeBosses":
        killableBosses = this.bossesKillStatus();
        return Object.values(killableBosses).some((v) => v);
      case "canKillBoss":
        killableBosses = this.bossesKillStatus();
        if (ctx.dungeonId) {
          const dungeon = this.state.dungeons[ctx.dungeonId];
          return killableBosses[dungeon.boss];
        }
        return false;
      case "canKillMostEnemies":
        return this.resolveSimple("melee_bow", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("firerod", ctx);
      case "canKillOrExplodeMostEnemies":
        return this.resolveSimple("canKillMostEnemies", ctx) || this.resolveSimple("bomb", ctx);
      case "canFightAgahnim":
        killableBosses = this.bossesKillStatus();
        return killableBosses["agahnim"];
      case "canLightFires":
        return this.hasItem("firerod") || this.hasItem("lantern");
      case "canDarkRoomNavigate":
        // TODO: Add personal logic for dark room navigation
        return this.resolveSimple("lantern", ctx);
      case "canTorchRoomNavigate":
        // TODO: (items.firerod && !isDoorsBranch() && flags.entrancemode === "N");
        return this.resolveSimple("lantern", ctx) || this.hasItem("firerod");
      case "canDefeatCurtains":
        return this.hasItem("sword"); // TODO: Add swordless logic
      case "canKillWizzrobes":
        return (
          this.resolveSimple("melee_bow", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("firerod", ctx) || (this.resolveSimple("icerod", ctx) && this.resolveSimple("hookshot", ctx))
        );
      case "canCrossMireGap":
        return this.resolveSimple("boots", ctx) || this.resolveSimple("hookshot", ctx);
      case "canBurnThings":
      case "canBurnThingsMaybeSwordless": // TODO: Differentiate swordless logic
        return this.hasItem("firerod") || (this.hasItem("bombos") && this.resolveSimple("sword", ctx));
      case "canHitSwitch":
        return this.resolveSimple("melee_bow", ctx) || this.resolveSimple("rod", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("hookshot", ctx) || this.resolveSimple("bomb", ctx) || this.resolveSimple("boomerang", ctx);
      case "canDestroyEnergyBarrier":
        return this.resolveSimple("swordbeams", ctx);
      case "canBreakTablets":
        return this.resolveSimple("swordbeams", ctx) && this.resolveSimple("book", ctx); // TODO: Add swordless logic
      case "canOpenBonkWalls":
        return this.resolveSimple("boots", ctx) || this.resolveSimple("bomb", ctx);
      case "canHitRangedSwitch":
        // Previous didnt have beams, but did have rods
        return this.resolveSimple("bomb", ctx) || this.resolveSimple("bow", ctx) || this.resolveSimple("boomerang", ctx) || this.resolveSimple("rod", ctx) || this.resolveSimple("swordbeams", ctx) || this.resolveSimple("somaria", ctx);
      case "canGetBonkableItem":
        return this.resolveSimple("boots", ctx) || (this.resolveSimple("bombos", ctx) && this.resolveSimple("sword", ctx));
      case "gtleft":
        // TODO: Personalize logic for GT left side
        return this.resolveSimple("hammer", ctx) && this.resolveSimple("hookshot", ctx) && this.resolveSimple("canHitRangedSwitch", ctx);
      case "gtright":
        // TODO: Personalize logic for GT right side
        return this.resolveSimple("somaria", ctx) && this.resolveSimple("firerod", ctx);
      case "zeroKeyPodders":
        return this.resolveSimple("bow", ctx) && this.resolveSimple("hammer", ctx) && this.resolveSimple("canOpenBonkWalls", ctx);
      case "canCrossEnergyBarrier":
        return this.hasItem("swordbeams") || this.hasItem("cape"); // || TODO: Add swordless logic
      case "canOpenGT":
        return this.getCrystalCount() === 7;
      case "canBuyBigBombMaybe":
      case "canBuyBigBomb":
        return this.getRedCrystalCount() === 2;

      case "canExitTurtleRockWestAndEnterEast":
        // TODO
        // return (items.bomb || flags.gametype === "I") && flags.entrancemode === "N";
        return this.resolveSimple("bomb", ctx);
      case "canExitTurtleRockBack":
        // TODO
        //  return items.bomb || flags.gametype != "O" || flags.entrancemode != "N";
        return this.resolveSimple("bomb", ctx);

      // TODO
      case "canShockBlock":
      case "canFakePowder":
      case "canZoraSplashDelete":
      case "canDarkRoomNavigateBlind":
      case "canTorchRoomNavigateBlind":
      case "canHoverAlot":
      case "canReachTurtleRockMiddle":
      case "canBreachMiseryMireMaybe":
      case "canBreachTurtleRockMainMaybe":
      case "canBreachTurtleRockMiddle":
      case "canOnlyReachTurtleRockMain":
      case "canReachTurtleRockBackOpen":
      case "canHMGMireClipBreach":
      case "canHMGMireClipLogic":
      case "canHMGHeraClipBreach":
      case "canHMGHeraClipLogic":
      case "canHMGUnlockHeraBreach":
      case "canHMGUnlockHeraLogic":
      case "canHMGUnlockSwampBreach":
      case "canHMGUnlockSwampLogic":
      case "canHMGMirrorlessSwampBreach":
      case "canHMGMirrorlessSwampLogic":
      case "never":
        return false;

      case "canBootsClip":
        return this.state.settings.logicMode !== "noglitches" ? this.hasItem("boots") : false;

      // Everything below here needs user settings for logic added
      case "canMirrorSuperBunny":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("mirror");
      case "canDungeonBunnyRevive":
      case "canFakeFlipper":
        return this.state.settings.logicMode !== "noglitches";
      case "canWaterWalk":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("boots");
      case "canBunnyPocket":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("boots") && (this.hasItem("mirror") || this.resolveSimple("bottle", ctx));
      case "canSpinSpeedClip":
        return this.state.settings.logicMode !== "noglitches" && this.hasItem("boots") && (this.hasItem("sword") || this.hasItem("hookshot"));

      default:
        // Covers all simple item checks - works because all items are counted now rather than boolean
        // Putting this here allows us to use more complex logic conditions above (i.e. flute)
        if (condition in items) return this.hasItem(condition);

        console.error(`Unknown simple logic condition: ${condition}`);
        return false;
    }
  }

  private resolveComplex(condition: string, ctx: EvaluationContext): boolean {
    const conditionParts = condition.split("|");
    const type = conditionParts[0];
    let dungeonId: string | undefined = ctx.dungeonId;
    let dungeon;

    switch (type) {
      case "canReach": {
        const regionName = conditionParts[1];
        const regionStatus = this.evaluateRegion(regionName);
        return regionStatus === "available";
      }
      case "canBreach": {
        const breachRegionName = conditionParts[1];
        const breachRegionStatus = this.evaluateRegion(breachRegionName);
        return breachRegionStatus !== "unavailable";
      }
      // Custom big keys for hmg logic
      case "bigkey":
        if (!this.state.settings.wildBigKeys) {
          return true;
        }
        dungeon = this.state.dungeons[conditionParts[1]];
        return dungeon.bigKey;
      case "keys": {
        if (this.state.settings.wildSmallKeys === "wild") {
          return true;
        }
        const requiredKeys = parseInt(conditionParts[1], 10);
        if (conditionParts.length === 3) {
          dungeonId = conditionParts[2];
        }
        if (!dungeonId) return false;
        dungeon = this.state.dungeons[dungeonId];
        return (dungeon?.smallKeys ?? 0) >= requiredKeys;
      }
      case "exception":
        // TODO: TO BE IMPLEMENTED AS NEEDED
        return false;
      case "hasFoundEntrance":
      case "hasFoundMapEntry":
        // TODO: Implement entrance logic
        return false;

      default:
        console.error(`Unknown complex logic condition: ${condition}`);
        return false;
    }
  }

  private evaluateRegion(regionName: string): LogicStatus {
    // Check cache first
    if (this.regionCache.has(regionName)) {
      return this.regionCache.get(regionName)!;
    }

    // Prevent infinite loops - TODO: Improve handling of circular dependencies,
    //  allow a certain level of recursion
    if (this.evaluatingRegions.has(regionName)) {
      return "unavailable";
    }
    this.evaluatingRegions.add(regionName);

    const region = this.logicSet.regions[regionName];

    if (!region) {
      console.error(`Unknown region in logic: ${regionName}`);
      return "unavailable";
    }

    const requirements = this.getLogicState(region);

    let availability: LogicStatus = "unavailable";

    if (!("always" in requirements) || this.evaluateRequirement(requirements.always!, { regionName })) {
      availability = "possible";
      if (!("logical" in requirements) || this.evaluateRequirement(requirements.logical!, { regionName })) {
        availability = "available";
      } else if ("required" in requirements && this.evaluateRequirement(requirements.required!, { regionName })) {
        availability = "ool";
      }
    }
    // Cache the result
    this.regionCache.set(regionName, availability);
    this.evaluatingRegions.delete(regionName);

    return availability;
  }

  private calculateLocations(): Record<string, LogicStatus> {
    const locationStatuses: Record<string, LogicStatus> = {};
    const logicSet = this.state.settings.entranceMode === "none" ? this.logicSet.nondungeon : this.logicSet.nondungeon_entrance;

    // Regular checks
    Object.entries(logicSet).forEach(([locationName, worldLogic]) => {
      locationStatuses[locationName] = this.evaluateWorldLogic(worldLogic, {});
    });
    
    return locationStatuses;
  }

  private calculateEntrances(): Record<string, LogicStatus> {
    const entranceStatuses: Record<string, LogicStatus> = {};
    Object.entries(this.logicSet.entrances).forEach(([entranceName, worldLogic]) => {
      if (this.state.settings.entranceMode === "none") {
        entranceStatuses[entranceName] = "unavailable";
      } else {
        entranceStatuses[entranceName] = this.evaluateWorldLogic(worldLogic, {});
      }
    });
    return entranceStatuses;
  }

  private calculateDungeons(): Record<string, LogicStatus> {
    const dungeonStatuses: Record<string, LogicStatus> = {};
    
    // Main dungeon checks
    Object.entries(this.logicSet.dungeon).forEach(([dungeonId, locations]) => {
      Object.entries(locations).forEach(([locationName, logicState]) => {
        dungeonStatuses[locationName] = this.evaluateLogicState(logicState, { dungeonId });
      });
    });

    // Keydrop checks
    Object.entries(this.logicSet.keydrop).forEach(([dungeonId, locations]) => {
      Object.entries(locations).forEach(([locationName, logicState]) => {
        dungeonStatuses[locationName] = this.evaluateLogicState(logicState, { dungeonId });
      });
    });

    return dungeonStatuses;
  }

  private evaluateWorldLogic(worldLogic: WorldLogic, ctx: EvaluationContext): LogicStatus {
    const requirements = this.getLogicState(worldLogic);
    return this.evaluateLogicState(requirements, ctx);
  }

  private evaluateLogicState(requirements: LogicState, ctx: EvaluationContext): LogicStatus {
    let availability: LogicStatus = "unavailable";

    if (!("always" in requirements) || this.evaluateRequirement(requirements.always!, ctx)) {
      availability = "possible";
      if (!("logical" in requirements) || this.evaluateRequirement(requirements.logical!, ctx)) {
        availability = "available";
      } else if ("required" in requirements && this.evaluateRequirement(requirements.required!, ctx)) {
        availability = "ool";
      }
    }
    return availability;
  }
}
