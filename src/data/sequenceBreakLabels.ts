/**
 * Human-readable labels for sequence break keys.
 * Used to display ool reasons in tooltips.
 */
export const SEQUENCE_BREAK_LABELS: Record<string, string> = {
  canNavigateDarkRooms: "Dark Room Navigation",
  canIceBreak: "Ice Breaker",
  canBombJump: "Bomb Jumps",
  canHover: "Hover",
  canHoverAlot: "Long Hovers",
  canSpeckyClip: "Specky Clip",
  canFireSpooky: "Spooky Action (Fire)",
  canBombSpooky: "Spooky Action (Bomb)",
  canHeraPot: "Herapot",
  canMimicClip: "Mimic Clip",
  canPotionCameraUnlock: "Potion Camera Unlock",
  canMoldormBounce: "Moldorm Bounce",
  canTorchRoomNavigateBlind: "Lightless Torch Room Navigation",
  canBombOrBonkCameraUnlock: "Bonk/Bomb Camera Unlock",
  canTombRaider: "Tomb Raider",
  canFakePowder: "Fake Powder",
  canQirnJump: "Qirn Jump",
  canFairyReviveHover: "Fairy Revive Hover",
  canFakeFlipper: "Fake Flippers",
  canOWFairyRevive: "OW Fairy Revival",
  canMirrorSuperBunny: "Mirror Super Bunny",
  canSuperBunny: "Mirror Super Bunny",
  canDungeonBunnyRevive: "Dungeon Bunny Revive",
  canWaterWalk: "Water Walk",
  canZoraSplashDelete: "Zora Splash Delete",
  canBunnyPocket: "Bunny Pocket",
  canFairyBarrierRevive: "Fairy Barrier Revive",
  canShockBlock: "Shock Block",
  canBunnyCitrus: "Bunny Citrus",
  canTamSwam: "TAM Swam",
  canMirrorWrap: "Mirror Wrap",
  canHookClip: "Hook Clip",
  canDarkRoomNavigateBlind: "Dark Room Navigation (Blind)",
  canReachHCMain: "Dropdown Access or Mirror for HC Main",
};

export function getSequenceBreakLabel(key: string): string {
  return SEQUENCE_BREAK_LABELS[key] ?? key;
}
