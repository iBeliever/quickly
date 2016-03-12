Number.isNaN = Number.isNaN || function(value) {     
  return value !== value;
};

Number.isFinite = Number.isFinite || function(value) {
  return typeof value === "number" && isFinite(value);
};