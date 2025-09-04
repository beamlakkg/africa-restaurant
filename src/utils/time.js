export function capacities() {
  return {
    Standard: parseInt(process.env.STANDARD_CAPACITY_PER_SLOT || '20', 10),
    Bar: parseInt(process.env.BAR_CAPACITY_PER_SLOT || '10', 10),
    Lounge: parseInt(process.env.LOUNGE_CAPACITY_PER_SLOT || '12', 10)
  };
}
