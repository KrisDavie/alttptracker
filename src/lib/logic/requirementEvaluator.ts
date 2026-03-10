import type { CrystalSwitchState, LogicRequirement, LogicState, LogicStatus, WorldLogic } from "@/data/logic/logicTypes";
import type { GameState } from "@/data/logic/logicTypes";
import { getLogicStateForWorld, minimumStatus, maximumStatus } from "./logicHelpers";

export interface EvaluationContext {
  dungeonId?: string;
  regionName?: string;
  isBunny?: boolean;
  crystalStates?: Set<CrystalSwitchState>;
  assumeSmallKey?: boolean;
  assumeBigKey?: boolean;
  canReachRegion?: (regionName: string) => LogicStatus;
  /** OWR: Override world state for requirement evaluation on tiles whose effective
   *  world differs from the global setting (e.g., flipped tiles). */
  effectiveWorldState?: string;
}

export class RequirementEvaluator {
  private state: GameState;

  constructor(state: GameState) {
    this.state = state;
  }

  public evaluateWorldLogic(worldLogic: WorldLogic, ctx: EvaluationContext): LogicStatus {
    const logicState = getLogicStateForWorld(this.state, worldLogic, ctx.effectiveWorldState);
    if (!logicState) {
      return "unavailable";
    }
    return this.evaluateLogicState(logicState, ctx);
  }

  public evaluateLogicState(logicState: LogicState, ctx: EvaluationContext): LogicStatus {
    // Evaluate 'always' first — this is the hard gate. If the status-aware
    // evaluation returns unavailable, check information before giving up.
    if ("always" in logicState && logicState.always) {
      const alwaysStatus = this.evaluateRequirement(logicState.always, ctx);
      if (alwaysStatus === "unavailable") {
        // Can't reach at all — but can we at least see the item?
        if ("information" in logicState && logicState.information) {
          const infoStatus = this.evaluateRequirement(logicState.information, ctx);
          if (infoStatus !== "unavailable") return "information";
        }
        return "unavailable";
      }
      // The always block's status caps everything below it.
      // If always is "ool", even a fully-met logical block can't be better than "ool".
      // If always is "possible", same cap.

      if ("logical" in logicState && logicState.logical) {
        const logicalStatus = this.evaluateRequirement(logicState.logical, ctx);
        if (logicalStatus !== "unavailable") {
          // Logical met — cap at always status (available stays available, ool stays ool)
          return minimumStatus(alwaysStatus, logicalStatus);
        }
      } else if (!("logical" in logicState)) {
        // No logical tier defined — always block alone determines status
        return alwaysStatus;
      }

      // Logical not met (or unavailable). Check required tier.
      if ("required" in logicState && logicState.required) {
        const requiredStatus = this.evaluateRequirement(logicState.required, ctx);
        if (requiredStatus !== "unavailable") {
          // Cap at "ool" since this is the required (out-of-logic) tier
          return minimumStatus(alwaysStatus, minimumStatus("ool", requiredStatus));
        }
      }
      // Always met but neither logical nor required met → possible
      return minimumStatus(alwaysStatus, "possible");
    }

    // No always block — evaluate logical/required directly
    if ("logical" in logicState && logicState.logical) {
      const logicalStatus = this.evaluateRequirement(logicState.logical, ctx);
      if (logicalStatus !== "unavailable") {
        return logicalStatus;
      }
    } else if (!("logical" in logicState) && !("required" in logicState)) {
      return "available";
    }

    if ("required" in logicState && logicState.required) {
      const requiredStatus = this.evaluateRequirement(logicState.required, ctx);
      if (requiredStatus !== "unavailable") {
        return minimumStatus("ool", requiredStatus);
      }
    }

    // Check information tier: player can see the item but not obtain it
    if ("information" in logicState && logicState.information) {
      const infoStatus = this.evaluateRequirement(logicState.information, ctx);
      if (infoStatus !== "unavailable") {
        return "information";
      }
    }

    return "unavailable";
  }

  public evaluateRequirement(req: LogicRequirement, ctx: EvaluationContext): LogicStatus {
    if (!req) return "available";

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
      // allOf: status is the minimum (worst) of all children
      let allOfStatus: LogicStatus = "available";
      if ("allOf" in req && req.allOf) {
        for (const r of req.allOf) {
          allOfStatus = minimumStatus(allOfStatus, this.evaluateRequirement(r, ctx));
          if (allOfStatus === "unavailable") return "unavailable"; // short-circuit
        }
      }

      // anyOf: status is the maximum (best) of all children
      if ("anyOf" in req && Array.isArray(req.anyOf) && req.anyOf.length > 0) {
        let anyOfStatus: LogicStatus = "unavailable";
        for (const r of req.anyOf) {
          anyOfStatus = maximumStatus(anyOfStatus, this.evaluateRequirement(r, ctx));
          if (anyOfStatus === "available") break; // short-circuit
        }
        // The anyOf result is also capped by the allOf result
        return minimumStatus(allOfStatus, anyOfStatus);
      }

      return allOfStatus;
    }

    return "available";
  }

  private hasItem(itemName: string): boolean {
    const items = this.state.items;
    return items[itemName]?.amount > 0;
  }

  /** Boolean→LogicStatus conversion */
  private boolToStatus(val: boolean): LogicStatus {
    return val ? "available" : "unavailable";
  }

  /** Check if a resolveSimple condition is met (not unavailable). For use in boolean contexts. */
  private met(condition: string, ctx: EvaluationContext): boolean {
    return this.resolveSimple(condition, ctx) !== "unavailable";
  }

  private bossesKillStatus() {
    const killableBosses: Record<string, boolean> = {};
    const m = (c: string) => this.met(c, {});
    const cx = (c: string) => this.resolveComplex(c, {}) !== "unavailable";

    killableBosses["armos"] = m("melee_bow") || m("boomerang") || m("cane") || m("rod");

    killableBosses["lanmolas"] = m("melee_bow") || m("somaria") || (m("bomb") && m("byrna")) || m("rod");

    killableBosses["moldorm"] = m("melee");

    killableBosses["helmasaurking"] = m("melee_bow") && (m("bomb") || m("hammer"));

    // TODO: Close enough for now (ArrghusDefeatRule)
    killableBosses["arrghus"] = m("hookshot") && (m("melee") || (m("bow") && m("rod")) || (m("bomb") && m("rod") && (this.getBottleCount() > 1 || (this.getBottleCount() > 0 && m("magic")))));

    killableBosses["mothula"] = m("melee") || (cx("canExtendMagic|10") && m("firerod")) || (cx("canExtendMagic|16") && m("cane"));

    killableBosses["blind"] = m("melee") || m("cane");

    killableBosses["kholdstare"] = m("canBurnThingsMaybeSwordless") && ((m("firerod") && cx("canExtendMagic|20")) || m("melee"));
    // TODO: Add swordless logic

    killableBosses["vitreous"] = m("melee") || (m("bow") && m("bomb"));

    killableBosses["trinexx"] =
      m("firerod") && m("icerod") && (m("hammer") || this.state.items.sword.amount > 2 || (this.state.items.sword.amount == 2 && cx("canExtendMagic|16")) || (this.state.items.sword.amount == 1 && cx("canExtendMagic|32")));

    killableBosses["agahnim"] = m("melee") || m("net");
    killableBosses["agahnim2"] = m("melee") || m("net");
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

  private resolveSimple(condition: string, ctx: EvaluationContext): LogicStatus {
    const items = this.state.items;
    let killableBosses;

    // Other complex checks
    switch (condition) {
      case "agahnim":
        return this.boolToStatus(this.state.dungeons["ct"].bossDefeated);
      case "agahnim2":
        return this.boolToStatus(this.state.dungeons["gt"].bossDefeated);
      case "bombs":
        return this.boolToStatus(this.hasItem("bomb"));
      case "bottle":
        return this.boolToStatus(this.getBottleCount() > 0);
      case "bow":
        // Bow requires 2 to use (1 to have, 1 to use)
        return this.boolToStatus(items.bow.amount > 1);
      case "lantern":
        if (items.lantern.amount > 0) {
          return "available";
        }
        return this.state.settings.sequenceBreaks.canNavigateDarkRooms ? "ool" : "unavailable";
      case "canFlute":
      case "flute":
        // TODO: CanActivateFlute logic
        return this.boolToStatus(items.flute.amount > 0);
      case "cane":
        return this.boolToStatus(this.hasItem("somaria") || this.hasItem("byrna"));
      case "rod":
        return this.boolToStatus(this.hasItem("firerod") || this.hasItem("icerod"));
      case "melee":
        return this.boolToStatus(this.hasItem("sword") || this.hasItem("hammer"));
      case "melee_bow":
        return maximumStatus(this.resolveSimple("melee", ctx), this.resolveSimple("bow", ctx));
      case "mitts":
        return this.boolToStatus(items.glove.amount > 1);
      case "mirrorshield":
        return this.boolToStatus(items.shield.amount > 2);
      case "swordbeams":
        return this.boolToStatus(items.sword.amount > 1);
      case "temperedSword":
        return this.boolToStatus(items.sword.amount >= 3);
      case "goldSword":
        return this.boolToStatus(items.sword.amount >= 4);
      case "greenPendant":
        return this.boolToStatus(Object.values(this.state.dungeons).some((d) => d.prizeCollected && d.prize === "greenPendant"));
      case "canPullPedestal":
        return this.boolToStatus(this.getPendantCount() >= 3);
      case "canUseSilverArrows":
        return this.boolToStatus(items.bow.amount >= 4);
      case "canUseMedallionPad":
        return this.boolToStatus(this.hasItem("sword")); // || TODO: Add swordless logic
      case "canTakeDamage":
        return "available"; // TODO: Add logic for OHKO
      // Enemies and Bosses
      case "canKillSomeBosses":
        killableBosses = this.bossesKillStatus();
        return this.boolToStatus(Object.values(killableBosses).some((v) => v));
      case "canKillBoss":
        killableBosses = this.bossesKillStatus();
        if (ctx.dungeonId) {
          const dungeon = this.state.dungeons[ctx.dungeonId];
          return this.boolToStatus(killableBosses[dungeon.boss]);
        }
        return "unavailable";
      case "canKillMostEnemies":
        return maximumStatus(this.resolveSimple("melee_bow", ctx), this.resolveSimple("cane", ctx), this.resolveSimple("firerod", ctx));
      case "canKillOrExplodeMostEnemies":
        return maximumStatus(this.resolveSimple("canKillMostEnemies", ctx), this.resolveSimple("bomb", ctx));
      case "canKillHookableEneimies":
        return maximumStatus(this.resolveSimple("canKillOrExplodeMostEnemies", ctx), this.resolveSimple("hookshot", ctx));
      case "canFightAgahnim":
        killableBosses = this.bossesKillStatus();
        return this.boolToStatus(killableBosses["agahnim"]);

      case "canLightFires":
        return this.boolToStatus(this.hasItem("firerod") || this.hasItem("lantern"));
      
        case "canTorchRoomNavigate":
        // TODO: (items.firerod && !isDoorsBranch() && flags.entrancemode === "N");
        return maximumStatus(this.resolveSimple("lantern", ctx), this.boolToStatus(this.hasItem("firerod")));
      case "canDefeatCurtains":
        return this.boolToStatus(this.hasItem("sword")); // TODO: Add swordless logic
      case "canKillWizzrobes":
        return maximumStatus(this.resolveSimple("melee_bow", ctx), this.resolveSimple("cane", ctx), this.resolveSimple("firerod", ctx), minimumStatus(this.resolveSimple("icerod", ctx), this.resolveSimple("hookshot", ctx)));
      case "canCrossMireGap":
        return maximumStatus(this.resolveSimple("boots", ctx), this.resolveSimple("hookshot", ctx));
      case "canBurnThings":
      case "canBurnThingsMaybeSwordless": // TODO: Differentiate swordless logic
        return this.boolToStatus(this.hasItem("firerod") || (this.hasItem("bombos") && this.hasItem("sword")));
      case "canHitSwitch":
        return maximumStatus(this.resolveSimple("melee_bow", ctx), this.resolveSimple("rod", ctx), this.resolveSimple("cane", ctx), this.resolveSimple("hookshot", ctx), this.resolveSimple("bomb", ctx), this.resolveSimple("boomerang", ctx));
      case "canDestroyEnergyBarrier":
        return this.resolveSimple("swordbeams", ctx);
      case "canBreakTablets":
        return minimumStatus(this.resolveSimple("swordbeams", ctx), this.resolveSimple("book", ctx)); // TODO: Add swordless logic
      case "canOpenBonkWalls":
        return maximumStatus(this.resolveSimple("boots", ctx), this.resolveSimple("bomb", ctx));
      case "canHitRangedSwitch":
        // Previous didnt have beams, but did have rods
        return maximumStatus(this.resolveSimple("bomb", ctx), this.resolveSimple("bow", ctx), this.resolveSimple("boomerang", ctx), this.resolveSimple("rod", ctx), this.resolveSimple("swordbeams", ctx), this.resolveSimple("somaria", ctx));
      case "canGetBonkableItem":
        return maximumStatus(this.resolveSimple("boots", ctx), minimumStatus(this.resolveSimple("quake", ctx), this.resolveSimple("sword", ctx)));
      case "canCrossEnergyBarrier":
        return this.boolToStatus(this.hasItem("swordbeams") || this.hasItem("cape")); // || TODO: Add swordless logic
      case "canOpenGT":
        return this.boolToStatus(this.getCrystalCount() >= 7);
      case "canBuyBigBombMaybe":
      case "canBuyBigBomb":
        return this.boolToStatus(this.getRedCrystalCount() >= 2);
      case "canOpenTR":
        return minimumStatus(this.resolveComplex("medallion|tr", ctx), this.resolveComplex("canReach|Turtle Rock Ledge", ctx), this.resolveSimple("canUseMedallionPad", ctx));
      case "canOpenMM":
        return minimumStatus(this.resolveComplex("medallion|mm", ctx), this.resolveComplex("canReach|Mire Area", ctx), this.resolveSimple("canUseMedallionPad", ctx));
      // Followers
      case "canCollectOldMan":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Old Man Cave (East)", ctx);
      case "canRescueOldMan":
        return minimumStatus(this.resolveSimple("canCollectOldMan", ctx), this.resolveComplex("canReach|Old Man Drop Off", ctx));
      case "canCollectKiki":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Palace of Darkness Area", ctx);
      case "canOpenPod":
        return minimumStatus(this.resolveSimple("canCollectKiki", ctx), this.resolveComplex("canReach|Palace of Darkness Area", ctx));
      case "canCollectFrog":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Frog Prison", ctx);
      case "canRescueBlacksmith":
        return minimumStatus(this.resolveSimple("canCollectFrog", ctx), this.resolveComplex("canReach|Blacksmiths Hut", ctx));
      case "canCollectPurpleChest":
        // TODO Follower shuffle logic
        return minimumStatus(this.resolveComplex("canReach|Hammer Pegs Area", ctx), this.resolveSimple("canRescueBlacksmith", ctx));
      case "canDeliverPurpleChest":
        return minimumStatus(this.resolveSimple("canCollectPurpleChest", ctx), this.resolveComplex("canReach|Middle Aged Man", ctx));
      case "canCollectBigBomb":
        // TODO Follower shuffle logic
        return minimumStatus(this.resolveComplex("canReach|Big Bomb Shop", ctx), this.resolveSimple("canBuyBigBomb", ctx));
      case "canOpenPyramidFairy":
        return minimumStatus(this.resolveSimple("canCollectBigBomb", ctx), this.resolveComplex("canReach|Pyramid Area", ctx));
      case "canOpenTTAttic":
        return minimumStatus(this.resolveComplex("canReach|Thieves Attic", ctx), this.resolveSimple("bomb", ctx));
      case "canCollectBlind":
        // TODO Follower shuffle logic
        return this.resolveComplex("canReach|Thieves Blind's Cell Interior", ctx);
      case "canRevealBlind":
        return minimumStatus(this.resolveSimple("canOpenTTAttic", ctx), this.resolveSimple("canCollectBlind", ctx), this.resolveComplex("canReach|Thieves Boss", ctx));

      case "isPyramidOpen":
        // TODO: Check for fast ganon
        return this.resolveSimple("agahnim2", ctx);
      case "canBeatGanon":
        // TODO: check for crystal requirement based on settings
        return this.resolveSimple("agahnim2", ctx);

      case "orangeSwitchDown":
        return this.boolToStatus(ctx.crystalStates?.has("orange") ?? false);

      case "blueSwitchDown":
        return this.boolToStatus(ctx.crystalStates?.has("blue") ?? false);
      case "smallkey":
        // In Dungeon or universal small keys do not block access - logically assumed to have access to all of them
        if (this.state.settings.wildSmallKeys !== "wild") {
          return "available";
        }
        return this.boolToStatus(ctx.assumeSmallKey ?? false);

      case "bigkey":
        // For key counting algorithms (Dijkstra/BFS), assume big key is available
        if (ctx.assumeBigKey) {
          return "available";
        }
        if (!this.state.settings.wildBigKeys) {
          // TODO: Check that we can access at least one chest in the dungeon
          return "available";
        }
        if (ctx.dungeonId) {
          return this.boolToStatus(this.state.dungeons[ctx.dungeonId]?.bigKey ?? false);
        }
        return "unavailable";
      case "canAvoidLasers":
        return this.boolToStatus(items.shield.amount >= 3 || this.hasItem("cape") || this.hasItem("byrna"));

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
        return "unavailable";

      case "canBootsClip":
        return this.boolToStatus(this.state.settings.logicMode !== "noglitches" && this.hasItem("boots"));

      // Everything below here needs user settings for logic added
      case "canMirrorSuperBunny":
        return this.boolToStatus(this.state.settings.logicMode !== "noglitches" && this.hasItem("mirror"));
      case "canDungeonBunnyRevive":
      case "canFakeFlipper":
        return this.boolToStatus(this.state.settings.logicMode !== "noglitches");
      case "canWaterWalk":
        return this.boolToStatus(this.state.settings.logicMode !== "noglitches" && this.hasItem("boots"));
      case "canBunnyPocket":
        return this.boolToStatus(this.state.settings.logicMode !== "noglitches" && this.hasItem("boots") && (this.hasItem("mirror") || this.getBottleCount() > 0));
      case "canSpinSpeedClip":
        return this.boolToStatus(this.state.settings.logicMode !== "noglitches" && this.hasItem("boots") && (this.hasItem("sword") || this.hasItem("hookshot")));

      default:
        // Covers all simple item checks - works because all items are counted now rather than boolean
        // Putting this here allows us to use more complex logic conditions above (i.e. flute)
        if (condition in items) return this.boolToStatus(this.hasItem(condition));

        // console.error(`Unknown simple logic condition: ${condition}`);
        return "available";
    }
  }

  private checkMedallion(dungeonId: string): LogicStatus {
    const entrance = this.state.entrances[dungeonId === "tr" ? "Turtle Rock" : "Misery Mire"];
    const requiredMedallion = entrance?.medallion;

    if (!requiredMedallion || requiredMedallion === "unknown") {
      const hasBombos = this.hasItem("bombos");
      const hasEther = this.hasItem("ether");
      const hasQuake = this.hasItem("quake");
      if (hasBombos && hasEther && hasQuake) return "available";
      if (hasBombos || hasEther || hasQuake) return "possible";
      return "unavailable";
    }

    return this.hasItem(requiredMedallion) ? "available" : "unavailable";
  }

  private resolveComplex(condition: string, ctx: EvaluationContext): LogicStatus {
    const conditionParts = condition.split("|");
    const type = conditionParts[0];
    let dungeon;

    switch (type) {
      case "canReach":
      case "canBreach": {
        if (ctx.canReachRegion) {
          const status = ctx.canReachRegion(conditionParts[1]);
          // Return status directly — unavailable, possible, ool, or available
          return status === "information" ? "available" : status;
        }
        return "available"; // If no function provided, assume reachable
      }

      // Custom big keys for hmg logic
      case "bigkey":
        if (!this.state.settings.wildBigKeys) {
          return "available";
        }
        dungeon = this.state.dungeons[conditionParts[1]];
        return (dungeon.bigKey ?? false) ? "available" : "unavailable";

      case "keys": {
        return "available";
      }

      case "medallion": {
        return this.checkMedallion(conditionParts[1]);
      }

      case "ool": {
        // ool|<inner> — evaluate the inner condition and cap at "ool"
        const innerCondition = conditionParts.slice(1).join("|");
        const innerStatus = this.evaluateRequirement(innerCondition, ctx);
        return minimumStatus("ool", innerStatus);
      }

      case "canExtendMagic": {
        let base;
        switch (this.state.items.magic.amount) {
          case 0:
            base = 8;
            break;
          case 1:
            base = 16;
            break;
          case 2:
            base = 32;
            break;
          default:
            base = 0;
        }
        base = base + base * this.getBottleCount();
        return base >= parseInt(conditionParts[1]) ? "available" : "unavailable";
      }
      case "hearts": {
        return "available";
      }
      case "exception":
        return "unavailable";

      // TODO Check if we need these
      case "hasFoundEntrance":
      case "hasFoundMapEntry":
        return this.state.entrances[conditionParts[1]]?.to !== null ? "available" : "unavailable";

      default:
        console.error(`Unknown complex logic condition: ${condition}`);
        return "available";
    }
  }
}
