export type SwitcherOptionsDTO = {
  id: number;
  productTypes: string[];
  manufacturers: string[];
  collections: string[];
  colors: string[];
  chamfersCount: string[];
  chamfersType: string[];
  typeOfConnection: string[];
  compatibilityWithHeating: string[];
  waterResistance: string[];
  wearResistanceClass: string[];
  assurance: string[];
  lookLike: string[];
  lengths: string[];
  widths: string[];
  heights: string[];
};

export async function fetchSwitcherOptions(): Promise<SwitcherOptionsDTO> {
  const r = await fetch("/api/switcher-options");
  if (!r.ok) throw new Error("Failed to load switcher options");
  return r.json();
}

export async function addSwitcherValue(field: keyof SwitcherOptionsDTO, value: string) {
  const r = await fetch("/api/switcher-options/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, value }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export async function removeSwitcherValue(field: keyof SwitcherOptionsDTO, value: string) {
  const r = await fetch("/api/switcher-options/remove", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ field, value }),
  });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
