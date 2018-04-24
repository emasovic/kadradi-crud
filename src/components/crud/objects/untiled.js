/addObject , {addObject}

addObject: {
  
  objectCl: {
    name: STRING,
    shortDescription: STRING,
    verified: BOOLEAN,
    personId: INT,
    objectCategoryId: INT
  },
  objectInfo: {
    webSiteUrl: STRING,
    popularBecauseOf: STRING,
  },
  /// kad je always open true ne salje ostale dane 
  workTime: {
    isAlwaysOpened: BOOLEAN,
    pon: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    },
    uto: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    },  
    sre: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    },
    cet: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    },
    pet: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    },
    sub: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    }, 
    ned: {
      isWorking: BOOLEAN,
      opening: STRING (WITH 4 NUMBERS),
      closing: STRING (WITH 4 NUMBERS),
    },
  },
  objectLocations: {
    lat: FLOAT,
    lng: FLOAT,
    adress: STRING,
    city: STRING,
    zipCode: INT,
  },
  objectPhones: [
    {
      desc: STRING,
      number: INT (valjda),
    }
  ],
  objectFile: {
  fileUrl: STRING,
  desc: STRING
  }



}