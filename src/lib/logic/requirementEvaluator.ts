import type { CrystalSwitchState, LogicRequirement, LogicState, LogicStatus, WorldLogic } from "@/data/logic/logicTypes";
import type { GameState } from "@/data/logic/logicTypes";
import { getLogicStateForWorld } from "./logicHelpers";

export interface EvaluationContext {
  dungeonId?: string;
  regionName?: string;
  isBunny?: boolean;
  crystalStates?: Set<CrystalSwitchState>;
  assumeSmallKey?: boolean;
  assumeBigKey?: boolean;
  canReachRegion?: (regionName: string) => LogicStatus;
}

export class RequirementEvaluator {
  private state: GameState;

  constructor(state: GameState) {
    this.state = state;
  }

  public evaluateWorldLogic(worldLogic: WorldLogic, ctx: EvaluationContext): LogicStatus {
    const logicState = getLogicStateForWorld(this.state, worldLogic);
    if (!logicState) {
      return "unavailable";
    }
    return this.evaluateLogicState(logicState, ctx);
  }

  public evaluateLogicState(logicState: LogicState, ctx: EvaluationContext): LogicStatus {
    // Evaluate 'always' first, if not met, return 'unavailable'
    if ("always" in logicState && logicState.always) {
      if (!this.evaluateRequirement(logicState.always, ctx)) {
        return "unavailable";
      }
    }

    if ("logical" in logicState && logicState.logical) {
      if (this.evaluateRequirement(logicState.logical, ctx)) {
        return "available";
      }
    } else if (!("logical" in logicState)) {
      return "available";
    }

    if ("required" in logicState && logicState.required) {
      if (this.evaluateRequirement(logicState.required, ctx)) {
        return "ool";
      }
    }
    return "possible";
  }

  public evaluateRequirement(req: LogicRequirement, ctx: EvaluationContext): boolean {
    if (!req) return true;

    // Handle Strings (e.g., "bomb", "canReach|Light World", "keys|2")
    if (Array.isArray(req) && req.length === 1) {
      req = req[0];
    }
    if (typeof req === "string") {
      if (req.includes("|")) {
        return this.resolveComplex(req, ctx);
      }
      return this.resolveSimple(req, ctx);
    }

    // Handle Objects (allOf / anyOf)
    if (typeof req === "object" && req !== null) {
      let result = true;
      if ("allOf" in req && req.allOf) {
        result = req.allOf.every((r) => this.evaluateRequirement(r, ctx));
      }
      if (result && "anyOf" in req && Array.isArray(req.anyOf)) {
        result = req.anyOf.some((r) => this.evaluateRequirement(r, ctx));
      }
      return result;
    }

    return true;
  }

  private hasItem(itemName: string): boolean {
    const items = this.state.items;
    return items[itemName]?.amount > 0;
  }

  private bossesKillStatus() {
    const killableBosses: Record<string, boolean> = {};
    killableBosses["armos"] =
      this.resolveSimple("melee_bow", {}) ||
      this.resolveSimple("boomerang", {}) ||
      this.resolveSimple("cane", {}) ||
      this.resolveSimple("rod", {});

    killableBosses["lanmolas"] =
      this.resolveSimple("melee_bow", {}) ||
      this.resolveSimple("somaria", {}) ||
      (this.resolveSimple("bomb", {}) && this.resolveSimple("byrna", {})) ||
      this.resolveSimple("rod", {});

    killableBosses["moldorm"] = this.resolveSimple("melee", {});

    killableBosses["helmasaurking"] = this.resolveSimple("melee_bow", {}) && (this.resolveSimple("bomb", {}) || this.resolveSimple("hammer", {}));

    // TODO: Close enough for now (ArrghusDefeatRule)
    killableBosses["arrghus"] =
      this.resolveSimple("hookshot", {}) &&
      (this.resolveSimple("melee", {}) ||
        (this.resolveSimple("bow", {}) && this.resolveSimple("rod", {})) || 
        (this.resolveSimple("bomb", {}) && this.resolveSimple("rod", {}) && (this.getBottleCount() > 1 || (this.getBottleCount() > 0 && this.resolveSimple("magic", {}))))); 

    killableBosses["mothula"] = this.resolveSimple("melee", {}) || (this.resolveComplex("canExtendMagic|10", {}) && this.resolveSimple("firerod", {})) || (this.resolveComplex("canExtendMagic|16", {}) && this.resolveSimple("cane", {}));

    killableBosses["blind"] = this.resolveSimple("melee", {}) || this.resolveSimple("cane", {});

    killableBosses["kholdstare"] = this.resolveSimple("canBurnThingsMaybeSwordless", {}) && ((this.resolveSimple("firerod", {}) && this.resolveComplex("canExtendMagic|20", {})) || (this.resolveSimple("melee", {})));
    // TODO: Add swordless logic

    killableBosses["vitreous"] = this.resolveSimple("melee", {}) || (this.resolveSimple("bow", {}) && this.resolveSimple("bomb", {})) 

    killableBosses["trinexx"] =
      this.resolveSimple("firerod", {}) && this.resolveSimple("icerod", {}) && (
        this.resolveSimple("hammer", {}) ||
        this.state.items.sword.amount > 2 ||
        (this.state.items.sword.amount == 2 && this.resolveComplex("canExtendMagic|16", {})) ||
        (this.state.items.sword.amount == 1 && this.resolveComplex("canExtendMagic|32", {}))
      ); 

    killableBosses["agahnim"] = this.resolveSimple("melee", {}) || this.resolveSimple("net", {}); 
    killableBosses["agahnim2"] = this.resolveSimple("melee", {}) || this.resolveSimple("net", {});
    killableBosses["bnc"] = true;

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
      case "agahnim2":
        return this.state.dungeons["gt"].bossDefeated;
      case "bombs":
        return this.hasItem("bomb");
      case "bottle":
        return this.getBottleCount() > 0;
      case "bow":
        // Bow requires 2 to use (1 to have, 1 to use)
        return items.bow.amount > 1;
      case "canFlute":
      case "flute":
        // TODO: CanActivateFlute logic
        return items.flute.amount > 0;
      case "cane":
        return this.hasItem("somaria") || this.hasItem("byrna")
      case "rod":
        return this.hasItem("firerod") || this.hasItem("icerod") 
      case "melee":
        return this.hasItem("sword") || this.hasItem("hammer");
      case "melee_bow":
        return this.resolveSimple("melee", ctx) || this.resolveSimple("bow", ctx);
      case "mitts":
        return items.glove.amount > 1;
      case "mirrorshield":
        return items.shield.amount > 2;
      case "swordbeams":
        return items.sword.amount > 1;
      case "temperedSword":
        return items.sword.amount >= 3;
      case "goldSword":
        return items.sword.amount >= 4;
      case "greenPendant":
        return Object.values(this.state.dungeons).some((d) => d.prizeCollected && d.prize === "greenPendant");
      case "canPullPedestal":
        return this.getPendantCount() >= 3;
      case "canUseSilverArrows":
        return items.bow.amount >= 4;

      // Enemies and Bosses
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
      case "canKillHookableEneimies":
        return this.resolveSimple("canKillOrExplodeMostEnemies", ctx) || this.resolveSimple("hookshot", ctx);
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
        return this.resolveSimple("melee_bow", ctx) || this.resolveSimple("cane", ctx) || this.resolveSimple("firerod", ctx) || (this.resolveSimple("icerod", ctx) && this.resolveSimple("hookshot", ctx));
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
        return this.resolveSimple("boots", ctx) || (this.resolveSimple("quake", ctx) && this.resolveSimple("sword", ctx));
      case "canCrossEnergyBarrier":
        return this.hasItem("swordbeams") || this.hasItem("cape"); // || TODO: Add swordless logic
      case "canOpenGT":
        return this.getCrystalCount() >= 7;
      case "canBuyBigBombMaybe":
      case "canBuyBigBomb":
        return this.getRedCrystalCount() >= 2;
      case "canOpenTR":
        return this.resolveComplex("medallion|tr", ctx) && this.resolveComplex("canReach|Death Mountain TR Pegs Ledge", ctx);

      // Followers
      case "canCollectOldMan":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Old Man Cave (East)", ctx);
      case "canRescueOldMan":
        return this.resolveSimple("canCollectOldMan", ctx) && this.resolveComplex("canReach|Old Man Drop Off", ctx);
      case "canCollectKiki":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Palace of Darkness Area", ctx);
      case "canOpenPod":
        return this.resolveSimple("canCollectKiki", ctx) && this.resolveComplex("canReach|Palace of Darkness Area", ctx);
      case "canCollectFrog":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Frog Area", ctx);
      case "canRescueBlacksmith":
        return this.resolveSimple("canCollectFrog", ctx) && this.resolveComplex("canReach|Blacksmiths Hut", ctx);
      case "canCollectPurpleChest":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Hammer Pegs Area", ctx) && this.resolveSimple("canRescueBlacksmith", ctx);
      case "canDeliverPurpleChest":
        return this.resolveSimple("canCollectPurpleChest", ctx) && this.resolveComplex("canReach|Middle Aged Man", ctx);
      case "canCollectBigBomb":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Big Bomb Shop", ctx) && this.resolveSimple("canBuyBigBomb", ctx);
      case "canOpenPyramidFairy":
        return this.resolveSimple("canCollectBigBomb", ctx) && this.resolveComplex("canReach|Pyramid Area", ctx);
      case "canOpenTTAttic":
        return this.resolveComplex("canReach|Thieves Attic", ctx) && this.resolveSimple("bomb", ctx);
      case "canCollectBlind":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Thieves Blind's Cell Interior", ctx);
      case "canRevealBlind":
        return this.resolveSimple("canOpenTTAttic", ctx) && this.resolveSimple("canCollectBlind", ctx) && this.resolveComplex("canReach|Thieves Boss", ctx);

      case "isPyramidOpen":
        // TODO: Check for fast ganon
        return this.resolveSimple("agahnim2", ctx);
      case "canBeatGanon":
        // TODO: check for crystal requirement based on settings
        return this.resolveSimple("agahnim2", ctx);

      case "orangeSwitchDown":
        return ctx.crystalStates?.has("orange") ?? false;

      case "blueSwitchDown":
        return ctx.crystalStates?.has("blue") ?? false;
      case "smallkey":
        // In Dungeon or universal small keys do not block access - logically assumed to have access to all of them
        if (this.state.settings.wildSmallKeys !== "wild") {
          return true;
        }
        return ctx.assumeSmallKey ?? false;

      case "bigkey":
        // For key counting algorithms (Dijkstra/BFS), assume big key is available
        if (ctx.assumeBigKey) {
          return true;
        }
        if (!this.state.settings.wildBigKeys) {
          // TODO: Check that we can access at least one chest in the dungeon
          return true;
        }
        if (ctx.dungeonId) {
          return this.state.dungeons[ctx.dungeonId]?.bigKey ?? false;
        }
        return false;
      case "canAvoidLasers":
        return items.shield.amount >= 3 || this.resolveSimple("cape", ctx) || this.resolveSimple("byrna", ctx);

      // TODO
      case "canDarkRoomNavigateBlind":
      case "canTorchRoomNavigateBlind":
      case "canFairyReviveHover":
      case "canOWFairyRevive":
      case "canQirnJump":
      case "canFakePowder":
      case "canZoraSplashDelete":
      case "canMirrorWrap":
      case "canTombRaider":
      case "canFairyBarrierRevive":
      case "canShockBlock":
      case "canHover":
      case "canIceBreak":
      case "canHookClip":
      case "canBombJump":
      case "canBombOrBonkCameraUnlock":
      case "canHoverAlot":
      case "canSpeckyClip":
      case "canBombSpooky":
      case "canHeraPot":
      case "canFireSpooky":
      case "canMimicClip":
      case "canPotionCameraUnlock":
      case "canMoldormBounce":
      case "canBunnyCitrus":
      case "canTamSwam":
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

        // console.error(`Unknown simple logic condition: ${condition}`);
        return true;
    }
  }

  private checkMedallion(dungeonId: string): boolean {
    const entrance = this.state.entrances[dungeonId === "tr" ? "Turtle Rock" : "Misery Mire"];
    const requiredMedallion = entrance?.medallion;

    if (!requiredMedallion || requiredMedallion === "unknown") {
      // Unknown - check if we have all three
      return this.hasItem("bombos") && this.hasItem("ether") && this.hasItem("quake");
    }

    return this.hasItem(requiredMedallion);
  }

  private resolveComplex(condition: string, ctx: EvaluationContext): boolean {
    const conditionParts = condition.split("|");
    const type = conditionParts[0];
    let dungeon;

    switch (type) {
      case "canReach":
      case "canBreach": {
        if (ctx.canReachRegion) {
          const status = ctx.canReachRegion(conditionParts[1]);
          return status === "available" || status === "possible" || status === "ool";
        }
        return true; // If no function provided, assume reachable
      }

      // Custom big keys for hmg logic
      case "bigkey":
        if (!this.state.settings.wildBigKeys) {
          return true;
        }
        dungeon = this.state.dungeons[conditionParts[1]];
        return dungeon.bigKey ?? false;

      case "keys": {
        return true;
      }

      case "medallion": {
        return this.checkMedallion(conditionParts[1]);
      }

      case "canExtendMagic": {
        // TODO - implement proper magic logic
        return this.resolveSimple("magic", ctx) || this.getBottleCount() > 1;
      }
      case "exception":
        return false;

      // TODO Check if we need these
      case "hasFoundEntrance":
      case "hasFoundMapEntry":
        return this.state.entrances[conditionParts[1]]?.to !== null;

      default:
        console.error(`Unknown complex logic condition: ${condition}`);
        return true;
    }
  }
}
