
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const generateCirclePoints = (center: [number, number], radius: number, points: number) => {
  const coords = [];
  const earthRadius = 6378137;
  
  for (let i = 0; i <= points; i++) {
    const angle = (i / points) * 2 * Math.PI;
    const dx = radius * Math.cos(angle);
    const dy = radius * Math.sin(angle);
    
    const lat = center[1] + (dy / earthRadius) * (180 / Math.PI);
    const lng = center[0] + (dx / earthRadius) * (180 / Math.PI) / Math.cos(center[1] * Math.PI / 180);
    
    coords.push([lng, lat]);
  }
  
  return coords;
};
