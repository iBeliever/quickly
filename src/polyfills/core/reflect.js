var PLATFORM = {
    'global': {}
};

const emptyMetadata = Object.freeze({});
const metadataContainerKey = '__metadata__';
const bind = Function.prototype.bind;

if (typeof PLATFORM.global.Reflect === 'undefined') {
  PLATFORM.global.Reflect = {};
}

export const {Reflect} = PLATFORM.global

if (typeof Reflect.getOwnMetadata !== 'function') {
  Reflect.getOwnMetadata = function(metadataKey, target, targetKey) {
    return ((target[metadataContainerKey] || emptyMetadata)[targetKey] || emptyMetadata)[metadataKey];
  };
}

if (typeof Reflect.defineMetadata !== 'function') {
  Reflect.defineMetadata = function(metadataKey, metadataValue, target, targetKey) {
    let metadataContainer = target.hasOwnProperty(metadataContainerKey) ? target[metadataContainerKey] : (target[metadataContainerKey] = {});
    let targetContainer = metadataContainer[targetKey] || (metadataContainer[targetKey] = {});
    targetContainer[metadataKey] = metadataValue;
  };
}

if (typeof Reflect.metadata !== 'function') {
  Reflect.metadata = function(metadataKey, metadataValue) {
    return function(target, targetKey) {
      Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
    };
  };
}

if (typeof Reflect.construct !== 'function') {
  Reflect.construct = function(Target, args) {
    if (args) {
      switch (args.length){
        case 0: return new Target();
        case 1: return new Target(args[0]);
        case 2: return new Target(args[0], args[1]);
        case 3: return new Target(args[0], args[1], args[2]);
        case 4: return new Target(args[0], args[1], args[2], args[3]);
      }
    }

    var a = [null];
    a.push.apply(a, args);
    return new (bind.apply(Target, a));
  };
}
