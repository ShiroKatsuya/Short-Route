export type LatLng = {
  latitude: number;
  longitude: number;
  id?: string;
  name?: string;
  label?: string;
};

export type GeneticOptions = {
  populationSize?: number;
  generations?: number;
  mutationRate?: number; // 0..1
  elitismCount?: number; // number of best individuals kept per generation
  isClosedLoop?: boolean; // if true, end connects back to start
};

export type GeneticResult = {
  orderedPoints: LatLng[]; // includes start and end at ends (and possibly start again if closed loop)
  totalDistanceKm: number;
};

export function haversineDistanceKm(a: LatLng, b: LatLng): number {
  const R = 6371; // km
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return R * c;
}

export function formatHhMmFromDistance(distanceKm: number, averageSpeedKmh: number = 40): { hours: number; minutes: number; text: string } {
  const hoursFloat = distanceKm / Math.max(averageSpeedKmh, 1);
  const hours = Math.floor(hoursFloat);
  const minutes = Math.round((hoursFloat - hours) * 60);
  const text = `${hours} jam ${minutes} menit`;
  return { hours, minutes, text };
}

// Order crossover (OX) for permutations
function orderCrossover(parentA: number[], parentB: number[]): number[] {
  const length = parentA.length;
  const child = new Array<number>(length).fill(-1);
  const start = Math.floor(Math.random() * length);
  const end = start + Math.floor(Math.random() * (length - start));

  // Copy slice from A
  for (let i = start; i < end; i++) {
    child[i] = parentA[i];
  }

  // Fill remaining from B in order
  let bIndex = 0;
  for (let i = 0; i < length; i++) {
    const idx = (end + i) % length;
    while (bIndex < length && child.includes(parentB[bIndex])) {
      bIndex++;
    }
    if (child[idx] === -1 && bIndex < length) {
      child[idx] = parentB[bIndex];
      bIndex++;
    }
  }

  // Fallback fill (should not happen)
  for (let i = 0; i < length; i++) {
    if (child[i] === -1) child[i] = parentB[i];
  }
  return child;
}

function mutateSwap(route: number[], mutationRate: number): void {
  for (let i = 0; i < route.length; i++) {
    if (Math.random() < mutationRate) {
      const j = Math.floor(Math.random() * route.length);
      const tmp = route[i];
      route[i] = route[j];
      route[j] = tmp;
    }
  }
}

function computeRouteLengthKm(
  start: LatLng,
  end: LatLng,
  waypoints: LatLng[],
  order: number[],
  isClosedLoop: boolean
): number {
  let sum = 0;
  let prev = start;
  for (let i = 0; i < order.length; i++) {
    const wp = waypoints[order[i]];
    sum += haversineDistanceKm(prev, wp);
    prev = wp;
  }
  if (isClosedLoop) {
    sum += haversineDistanceKm(prev, start);
  } else {
    sum += haversineDistanceKm(prev, end);
  }
  return sum;
}

export function optimizeRouteGenetic(
  start: LatLng,
  end: LatLng,
  waypoints: LatLng[],
  options: GeneticOptions = {}
): GeneticResult {
  const {
    populationSize = 150,
    generations = 400,
    mutationRate = 0.15,
    elitismCount = 2,
    isClosedLoop = false,
  } = options;

  if (waypoints.length === 0) {
    const orderedPoints = isClosedLoop ? [start, end, start] : [start, end];
    return { orderedPoints, totalDistanceKm: haversineDistanceKm(start, end) };
  }

  // Initialize population with random permutations of waypoint indices
  const indices = waypoints.map((_, idx) => idx);
  const createIndividual = () => {
    const clone = [...indices];
    // Fisher–Yates shuffle
    for (let i = clone.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clone[i], clone[j]] = [clone[j], clone[i]];
    }
    return clone;
  };

  let population: number[][] = Array.from({ length: populationSize }, createIndividual);

  let bestOrder = population[0];
  let bestDistance = computeRouteLengthKm(start, end, waypoints, bestOrder, isClosedLoop);

  for (let gen = 0; gen < generations; gen++) {
    // Evaluate
    const scored = population.map((order) => ({
      order,
      distance: computeRouteLengthKm(start, end, waypoints, order, isClosedLoop),
    }));
    scored.sort((a, b) => a.distance - b.distance);

    // Track best
    if (scored[0].distance < bestDistance) {
      bestOrder = [...scored[0].order];
      bestDistance = scored[0].distance;
    }


    const nextPop: number[][] = [];
    // Elitism
    for (let e = 0; e < Math.min(elitismCount, scored.length); e++) {
      nextPop.push([...scored[e].order]);
    }


    const tournament = (k: number): number[] => {
      let best = scored[Math.floor(Math.random() * scored.length)];
      for (let i = 1; i < k; i++) {
        const challenger = scored[Math.floor(Math.random() * scored.length)];
        if (challenger.distance < best.distance) best = challenger;
      }
      return best.order;
    };

    while (nextPop.length < populationSize) {
      const parentA = tournament(3);
      const parentB = tournament(3);
      let child = orderCrossover(parentA, parentB);
      mutateSwap(child, mutationRate);
      nextPop.push(child);
    }

    population = nextPop;
  }


  const ordered: LatLng[] = [start, ...bestOrder.map((i) => waypoints[i])];
  if (isClosedLoop) {
    ordered.push(start);
  } else {
    ordered.push(end);
  }

  return {
    orderedPoints: ordered,
    totalDistanceKm: computeRouteLengthKm(start, end, waypoints, bestOrder, isClosedLoop),
  };
}

export function assignAlphabetLabels(points: LatLng[]): LatLng[] {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return points.map((p, idx) => ({ ...p, label: alphabet[idx % alphabet.length] }));
}


