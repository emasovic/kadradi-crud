import Sequelize from 'sequelize';
// const Sequelize = require('sequelize');

const db = new Sequelize('postgres://kova:postgredbakovauser@144.217.30.150/kadradi');

import { dataArr } from './dataArrays';
import workTimeControll from './workTimeControll'

async function calculateAverageForAll() {
  const objekti = await db.models.objectCl.findAll();
  await Promise.all(objekti.map(async item => {
    let sumRating = 0.0;
    let sumPrice = 0.0;
    let throwbackRating;
    let throwbackPrice;
    const reviews = await db.models.objectReview.findAll({
      where: { objectClId: item.id }
    })
    console.log("E OVO ti JE REVIEWS: "+reviews.length)
    await Promise.all(reviews.map(async item2 => {
      sumRating += item2.rating
      sumPrice += item2.avgPrice
    }))
    let avgRating = sumRating / reviews.length;
    let avgPrice = sumPrice / reviews.length;
    if (reviews.length == 0) {
      throwbackRating = 0;
      throwbackPrice = 0;
    } else {
      throwbackRating = Math.round(avgRating * 2) / 2;
      throwbackPrice = Math.round(avgPrice * 2) / 2;
    }
    db.models.objectCl.update({ avgRating: throwbackRating, avgPrice: throwbackPrice }, { where: { id: item.id } })
  }))
}

const Person = db.define('person', {
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  facebook_id: {
    type: Sequelize.STRING
  },
  google_id: {
    type: Sequelize.STRING
  },
  passwordReset: {
    type: Sequelize.STRING
  },
  channel: {
    type: Sequelize.STRING
  },
  friends: {
    type: Sequelize.ARRAY(Sequelize.INTEGER)
  },
});

const FriendRequests = db.define('friendRequests', {
  person1: {
    type: Sequelize.INTEGER
  },
  person2: {
    type: Sequelize.INTEGER
  }
})

const PersonNonactive = db.define('personNonactive', {
  password: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
    unique: true,
  },
  emailHash: {
    type: Sequelize.STRING,
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  }
});

const UserType = db.define('userType', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
UserType.hasOne(Person);

const PersonBadges = db.define('personBadges', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  iconUrl: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
PersonBadges.hasMany(Person);

const PersonFiles = db.define('personFiles', {
  fileUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  desc: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
PersonFiles.hasMany(Person);

const Role = db.define('roles', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  priority: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});
Role.hasMany(Person);


const UserProfile = db.define('userProfile', {
  profileImageUrl: {
    type: Sequelize.TEXT,
  },
  location: {
    type: Sequelize.STRING
  },
},
  // {
  //   indexes: [
  //       {
  //           unique: true,
  //           fields: ['personId'],
  //       }
  //   ]
  // }
);

Person.hasOne(UserProfile);

const ObjectCl = db.define('objectCl', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  shortDescription: {
    type: Sequelize.STRING,
    allowNull: false
  },
  avgRating: {
    type: Sequelize.FLOAT,
  },
  avgPrice: {
    type: Sequelize.FLOAT
  },
  city: {
    type: Sequelize.STRING,
  },
  streetAddress: {
    type: Sequelize.STRING
  },
  postcode: {
    type: Sequelize.STRING
  },
  verified: {
    type: Sequelize.BOOLEAN
  },
  isWorking: {
    type: Sequelize.BOOLEAN,
    get() {
      const id = this.getDataValue('id')
      return workTimeControll.getWorking(id);
    }
  },
  checkedInCount: {
    type: Sequelize.INTEGER,
    async get() {
      const koliko = await db.models.personCheckedObjects.findAndCountAll({ where: { objectClId: this.getDataValue('id') } })
      return koliko.count
    }
  } 
});
Person.hasOne(ObjectCl);

const OwningRequest = db.define('owningRequest', {});
Person.hasOne(OwningRequest);
ObjectCl.hasOne(OwningRequest);

const ObjectCategorie = db.define('objectCategories', {
  nameJ: {
    type: Sequelize.STRING,
    allowNull: false
  },
  nameM: {
    type: Sequelize.STRING,
    allowNull: false
  }
});
ObjectCategorie.hasOne(ObjectCl);

const ParrentCategorie = db.define('parrentCategories', {
  name: {
    type: Sequelize.STRING
  }
})

ParrentCategorie.hasOne(ObjectCategorie)

const ObjectReview = db.define('objectReview', {
  textReview: {
    type: Sequelize.STRING,
  },
  rating: {
    type: Sequelize.FLOAT,
  },
  avgPrice: {
    type: Sequelize.FLOAT
  },
  workTimeTruth: {
    type: Sequelize.BOOLEAN
  },
  imageUrl: {
    type: Sequelize.STRING
  }

});
Person.hasOne(ObjectReview);
ObjectCl.hasOne(ObjectReview);

const ReviewLike = db.define('reviewLike', {
  likeType: {
    type: Sequelize.INTEGER
  }
})
Person.hasOne(ReviewLike)
ObjectReview.hasOne(ReviewLike)

const ObjectInfo = db.define('objectInfo', {
  websiteUrl: {
    type: Sequelize.STRING,
  },
  hasRestaurant: {
    type: Sequelize.BOOLEAN,
  },
  popularBecauseOf: {
    type: Sequelize.STRING,
  },
});

ObjectInfo.belongsTo(ObjectCl);

const ObjectPhones = db.define('objectPhones', {
  desc: {
    type: Sequelize.STRING,
  },
  number: {
    type: Sequelize.STRING,
  },
});

ObjectInfo.hasOne(ObjectPhones)

const ObjectLocation = db.define('objectLocation', {
  lat: {
    type: Sequelize.FLOAT
  },
  lng: {
    type: Sequelize.FLOAT
  },
  address: {
    type: Sequelize.STRING,
  },
  city: {
    type: Sequelize.STRING,
  },
  zipCode: {
    type: Sequelize.STRING,
  },
})
ObjectCl.hasOne(ObjectLocation)

const ObjectAdditionalInfo = db.define('objectAdditionalInfo', {
  info: {
    type: Sequelize.STRING
  }
});
ObjectAdditionalInfo.belongsTo(ObjectInfo);

const ObjectRestaurantMenu = db.define('objectRestaurantMenu', {
  menuUrl: {
    type: Sequelize.STRING
  }
});
ObjectRestaurantMenu.belongsTo(ObjectInfo);

const ObjectWorkTime = db.define('objectWorkTime', {
  isAlwaysOpened: {
    type: Sequelize.BOOLEAN
  }
});
ObjectWorkTime.belongsTo(ObjectCl);

const ObjectSpecialTime = db.define('objectSpecialTime', {
  name: {
    type: Sequelize.STRING
  },
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  },
  icon: {
    type: Sequelize.STRING
  },
  date: {
    type: Sequelize.STRING
  }
})

ObjectWorkTime.hasOne(ObjectSpecialTime)

const SectorWorkTime = db.define('sectorWorkTime', {
  name: {
    type: Sequelize.STRING
  },
  isAlwaysOpened: {
    type: Sequelize.BOOLEAN
  }
})


ObjectCl.hasOne(SectorWorkTime)

const WtMon = db.define('wtMon', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtMon.hasOne(ObjectWorkTime)
WtMon.hasOne(SectorWorkTime)

const WtTue = db.define('wtTue', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtTue.hasOne(ObjectWorkTime)
WtTue.hasOne(SectorWorkTime)

const WtWed = db.define('wtWed', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtWed.hasOne(ObjectWorkTime)
WtWed.hasOne(SectorWorkTime)

const WtThu = db.define('wtThu', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtThu.hasOne(ObjectWorkTime)
WtThu.hasOne(SectorWorkTime)

const WtFri = db.define('wtFri', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtFri.hasOne(ObjectWorkTime)
WtFri.hasOne(SectorWorkTime)

const WtSat = db.define('wtSat', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtSat.hasOne(ObjectWorkTime)
WtSat.hasOne(SectorWorkTime)

const WtSun = db.define('wtSun', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  }
})

WtSun.hasOne(ObjectWorkTime)
WtSun.hasOne(SectorWorkTime)

const ObjectWtCustom = db.define('objectWtCustom', {
  opening: {
    type: Sequelize.STRING
  },
  closing: {
    type: Sequelize.STRING
  },
  day: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATE
  }
});
ObjectWtCustom.hasOne(ObjectWorkTime);

const ObjectFileCategory = db.define('objectFileCategory', {
  category: {
    type: Sequelize.STRING
  },
  desc: {
    type: Sequelize.STRING
  }
});

const ObjectFile = db.define('objectFile', {
  fileUrl: {
    type: Sequelize.STRING
  },
  desc: {
    type: Sequelize.STRING
  }
});
ObjectFile.belongsTo(ObjectCl);
ObjectFileCategory.hasOne(ObjectFile);
Person.hasOne(ObjectFile);

const PersonFavoriteObjects = db.define('personFavoriteObjects', {

});
PersonFavoriteObjects.belongsTo(Person);
ObjectCl.hasOne(PersonFavoriteObjects);

const PersonCheckedObjects = db.define('personCheckedObjects', {
  datum: {
    type: Sequelize.STRING
  },
  count: {
    type: Sequelize.INTEGER
  }
});
PersonCheckedObjects.belongsTo(Person);
ObjectCl.hasOne(PersonCheckedObjects)
const FriendStatus = db.define('friendStatus', {
  status: {
    type: Sequelize.STRING,
    allowNull: false
  }
});

const Admin = db.define('admin', {
  username: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  }
})

const Locations = db.define('locations', {
  name: {
    type: Sequelize.STRING
  },
  parrentLocation: {
    type: Sequelize.INTEGER
  },
  lat: {
    type: Sequelize.FLOAT
  },
  lng: {
    type: Sequelize.FLOAT
  }
})

Locations.hasOne(ObjectCl)

const LiveQuestions = db.define('liveQuestions', {
  title: {
    type: Sequelize.STRING
  },
  text: {
    type: Sequelize.TEXT
  },
  answered: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  } 
})

Locations.hasOne(LiveQuestions)
Person.hasOne(LiveQuestions)
ObjectCategorie.hasOne(LiveQuestions)

const LiveReviews = db.define('liveReviews', {
  text: {
    type: Sequelize.TEXT
  },
  isAnswer: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
})

LiveQuestions.hasOne(LiveReviews)
Person.hasOne(LiveReviews)

const LiveReviewLike = db.define('liveReviewLike', {
  likeType: {
    type: Sequelize.INTEGER
  }
})
Person.hasOne(LiveReviewLike)
LiveReviews.hasOne(LiveReviewLike)

const Inbox = db.define('inbox', {
  person1: {
    type: Sequelize.INTEGER
  },
  person2: {
    type: Sequelize.INTEGER
  },
  channel: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  message: {
    type: Sequelize.TEXT
  },
  time: {
    type: Sequelize.STRING
  },
  person1seen: {
    type: Sequelize.BOOLEAN
  },
  person2seen: {
    type: Sequelize.BOOLEAN
  },
  person1active: {
    type: Sequelize.BOOLEAN
  },
  person2active: {
    type: Sequelize.BOOLEAN
  }
})

db.sync({ force: false }).then(async () => {

  // await Promise.all(dataArr.Locations.map(async item => {
  //   await Locations.create(item)
  // }))


  // await Promise.all(dataArr.UserType.map(async item => {
  //   await UserType.create(item);
  // }))

  // await Promise.all(dataArr.PersonsArr.map(async item => {
  //   await Person.create(item);
  // }));

  // await Promise.all(dataArr.UserProfile.map(async item => {
  //   await UserProfile.create(item)
  // }))

  // // await Promise.all(dataArr.friendsRelationsArr.map(async item => {
  // //   await FriendsList.create(item);
  // // }));

  // // await Promise.all(dataArr.FriendStatusArr.map(async item => {
  // //   await FriendStatus.create(item);
  // // }))

  // await Promise.all(dataArr.ParrentCategoriesArr.map(async item => {
  //   await ParrentCategorie.create(item)
  // }))


  // await Promise.all(dataArr.CategoriesArr.map(async item => {
  //   await ObjectCategorie.create(item);
  // }));

  // await Promise.all(dataArr.ObjectClArr.map(async item => {
  //   await ObjectCl.create(item);
  // }));

  // await Promise.all(dataArr.ReviewsArr.map(async item => {
  //   await ObjectReview.create(item);
  // }));

  // await Promise.all(dataArr.FileCategory.map(async item => {
  //   await ObjectFileCategory.create(item);
  // }))

  // await Promise.all(dataArr.ObjectFiles.map(async item => {
  //   await ObjectFile.create(item)
  // }))

  // await Promise.all(dataArr.ObjectLocation.map(async item => {
  //   await ObjectLocation.create(item)
  // }))

  // await Promise.all(dataArr.wtMon.map(async item => {
  //   await WtMon.create(item)
  // }))

  // await Promise.all(dataArr.wtTue.map(async item => {
  //   await WtTue.create(item)
  // }))

  // await Promise.all(dataArr.wtWed.map(async item => {
  //   await WtWed.create(item)
  // }))

  // await Promise.all(dataArr.wtThu.map(async item => {
  //   await WtThu.create(item)
  // }))

  // await Promise.all(dataArr.wtFri.map(async item => {
  //   await WtFri.create(item)
  // }))

  // await Promise.all(dataArr.wtSat.map(async item => {
  //   await WtSat.create(item)
  // }))

  // await Promise.all(dataArr.wtSun.map(async item => {
  //   await WtSun.create(item)
  // }))

  // await Promise.all(dataArr.ObjectWorkTime.map(async item => {
  //   await ObjectWorkTime.create(item)
  // }))

  // await Promise.all(dataArr.SectorWorkTime.map(async item => {
  //   await SectorWorkTime.create(item)
  // }))

  

  // await Promise.all(dataArr.ObjectInfo.map(async item => {
  //   await ObjectInfo.create(item)
  // }))

  // await Promise.all(dataArr.ObjectPhones.map(async item => {
  //   await ObjectPhones.create(item)
  // }))

  // await Promise.all(dataArr.PersonFavoriteObjects.map(async item => {
  //   await PersonFavoriteObjects.create(item)
  // }))

  // await Promise.all(dataArr.PersonCheckedObjects.map(async item => {
  //   await PersonCheckedObjects.create(item)
  // }))

  // await Promise.all(dataArr.LiveQuestions.map(async item => {
  //   await LiveQuestions.create(item)
  // }))

  // await Promise.all(dataArr.LiveReviews.map(async item => {
  //   await LiveReviews.create(item)
  // }))

  // await Promise.all(dataArr.ReviewLike.map(async item => {
  //   await ReviewLike.create(item)
  // }))

  // await Promise.all(dataArr.SpecialWorkTime.map(async item => {
  //   await ObjectSpecialTime.create(item);
  // }))

  // Admin.create({username: "admin", password: "f1dc735ee3581693489eaf286088b916"})  
}).then(() => {
  // calculateAverageForAll();
});


export default db;