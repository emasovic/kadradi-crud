import faker from 'faker';
import randomid from 'random-id'

const datum = new Date().toDateString();

export const dataArr = {
  Locations: [
    {
      name: 'Beograd',
      parrentLocation: 0,
      lat: 44.7866,
      lng: 20.4489
    },
    {
      name: 'Čukarica',
      parrentLocation: 1,
      lat: 44.6835,
      lng: 20.3850
    },
    {
      name: 'Novi Beograd',
      parrentLocation: 1,
      lat: 44.809956,
      lng: 20.380088
    },
    {
      name: 'Palilula',
      parrentLocation: 1,
      lat: 44.9399,
      lng: 20.4627
    },
    {
      name: 'Rakovica',
      parrentLocation: 1,
      lat: 44.718934,
      lng: 20.453806
    },
    {
      name: 'Savski Venac',
      parrentLocation: 1,
      lat: 44.782173,
      lng: 20.451442
    },
    {
      name: 'Stari Grad',
      parrentLocation: 1,
      lat: 44.818455,
      lng: 20.464341
    },
    {
      name: 'Voždovac',
      parrentLocation: 1,
      lat: 44.6712,
      lng: 20.5030
    },
    {
      name: 'Vračar',
      parrentLocation: 1,
      lat: 44.799531,
      lng: 20.475025
    },
    {
      name: "Zemun",
      parrentLocation: 1,
      lat: 44.8532,
      lng: 20.3556
    },
    {
      name: "Zvezdara",
      parrentLocation: 1,
      lat: 44.7767,
      lng: 20.5324
    },
    {
      name: "Barajevo",
      parrentLocation: 1,
      lat: 44.6035,
      lng: 20.4524
    },
    {
      name: "Grocka",
      parrentLocation: 1,
      lat: 44.6676,
      lng: 20.7269
    },
    {
      name: 'Lazarevac',
      parrentLocation: 1,
      lat: 44.3795,
      lng: 20.2639
    },
    {
      name: 'Mladenovac',
      parrentLocation: 1,
      lat: 44.4364,
      lng: 20.6939
    },
    {
      name: 'Obrenovac',
      parrentLocation: 1,
      lat: 44.5968,
      lng: 20.1242
    },
    {
      name: 'Sopot',
      parrentLocation: 1,
      lat: 44.5251,
      lng: 20.5629
    },
    {
      name: 'Surčin',
      parrentLocation: 1,
      lat: 44.7541,
      lng: 20.2117
    }
  ],

  ObjectClArr: Array(32).fill().map(item => {
    return {
      name: faker.company.companyName(),
      shortDescription: faker.lorem.sentence(),
      objectCategoryId: faker.random.number({ min: 1, max: 5 }),
      address: faker.address.street_name + ' ' + faker.random.number({ min: 1, max: 20 }).toString(),
      postCode: faker.random.number({ min: 1080, max: 12080 }),
      city: faker.address.city(),
      locationId: faker.random.number({min: 2, max: 10}),
      verified: faker.random.boolean(),
      personId: faker.random.number({min: 1, max: 5})
    }
  }),
  ReviewsArr: Array(40).fill().map(item => {
    return {
      textReview: faker.lorem.sentence(),
      rating: faker.random.number({ min: 2, max: 5 }),
      avgPrice: faker.random.number({ min: 1, max: 4 }),
      personId: faker.random.number({ min: 1, max: 3 }),
      objectClId: faker.random.number({ min: 1, max: 5 }),
    }
  }),
  ReviewLike: [
    {
      personId: 1,
      objectReviewId: 1,
      likeType: 2
    },
    {
      personId: 1,
      objectReviewId: 2,
      likeType: 3
    },
    {
      personId: 2,
      objectReviewId: 1,
      likeType: 1
    },
    {
      personId: 3,
      objectReviewId: 1,
      likeType: 2
    },
    {
      personId: 4,
      objectReviewId: 1,
      likeType: 2
    },
    {
      personId: 1,
      objectReviewId: 3,
      likeType: 1
    },
    {
      personId: 2,
      objectReviewId: 3,
      likeType: 1
    }

  ],
  friendsRelationsArr: [
    {
      facebookFriend: false,
      googleFriend: false,
      personId: 1,
      friendsPersonId: 2
    },
    {
      facebookFriend: false,
      googleFriend: false,
      personId: 1,
      friendsPersonId: 3
    },
    {
      facebookFriend: false,
      googleFriend: false,
      personId: 2,
      friendsPersonId: 3
    },
  ],
  ParrentCategoriesArr: [
    {
      name: 'Zdravstvo'
    },
    {
      name: 'Finansije'
    },
    {
      name: 'Ugostiteljstvo'
    },
    {
      name: 'Prodavnice i Zabava'
    },
    {
      name: 'Ljubimci'
    },
    {
      name: 'Za automobile'
    },
    {
      name: 'Sport'
    },
    {
      name: 'Državne ustanove'
    },
  ],
  CategoriesArr: [
    {
      nameM: 'Apoteke',
      nameJ: 'Apoteka',
      parrentCategoryId: 1
    },
    {
      nameM: 'Laboratorije',
      nameJ: 'Laboratorija',
      parrentCategoryId: 1
    },
    {
      nameM: 'Klinike',
      nameJ: 'Klinika',
      parrentCategoryId: 1
    },
    {
      nameM: 'Banke',
      nameJ: 'Banka',
      parrentCategoryId: 2
    },
    {
      nameM: 'Menjačnice',
      nameJ: 'Menjačnica',
      parrentCategoryId: 2
    },
    {
      nameM: 'Bankomati',
      nameJ: 'Bankomat',
      parrentCategoryId: 2
    },
    {
      nameM: 'Kafane',
      nameJ: 'Kafana',
      parrentCategoryId: 3
    },
    {
      nameM: 'Noćni Klubovi',
      nameJ: 'Noćni Klub',
      parrentCategoryId: 3
    },
    {
      nameM: 'Kafići',
      nameJ: 'Kafić',
      parrentCategoryId: 3
    },
    {
      nameM: 'Brza Hrana',
      nameJ: 'Brza Hrana',
      parrentCategoryId: 3
    },
    {
      nameM: 'Restorani',
      nameJ: 'Restoran',
      parrentCategoryId: 3
    },
    {
      nameM: 'Hoteli',
      nameJ: 'Hotel',
      parrentCategoryId: 3
    },
    {
      nameM: 'Marketi',
      nameJ: 'Market',
      parrentCategoryId: 4
    },
    {
      nameM: 'Cvećare',
      nameJ: 'Cvećara',
      parrentCategoryId: 4
    },
    {
      nameM: 'Šoping molovi',
      nameJ: 'Šoping mol',
      parrentCategoryId: 4
    },
    {
      nameM: 'Bioskopi',
      nameJ: 'Bioskop',
      parrentCategoryId: 4
    },
    {
      nameM: 'Kladionice',
      nameJ: 'Kladionca',
      parrentCategoryId: 4
    },
    {
      nameM: 'Biletarnice',
      nameJ: 'Biletarnica',
      parrentCategoryId: 4
    },
    {
      nameM: 'Farbare',
      nameJ: 'Farbara',
      parrentCategoryId: 4
    },
    {
      nameM: 'Pozorišta',
      nameJ: 'Pozorište',
      parrentCategoryId: 4
    },
    {
      nameM: 'Trafike',
      nameJ: 'Trafika',
      parrentCategoryId: 4
    },
    {
      nameM: 'Tehnika i Računari',
      nameJ: 'Tehnika i Računari',
      parrentCategoryId: 4
    },
    {
      nameM: 'Butici',
      nameJ: 'Butik',
      parrentCategoryId: 4
    },
    {
      nameM: 'Saloni lepote',
      nameJ: 'Salon lepote',
      parrentCategoryId: 4
    },
    {
      nameM: 'Operateri',
      nameJ: 'Operater',
      parrentCategoryId: 4
    },
    {
      nameM: 'Knjižare',
      nameJ: 'Knjižara',
      parrentCategoryId: 4
    },
    {
      nameM: 'Optike',
      nameJ: 'Optika',
      parrentCategoryId: 4
    },
    {
      nameM: 'Zanatske radnje',
      nameJ: 'Zanatska radnja',
      parrentCategoryId: 4
    },
    {
      nameM: 'Pekare',
      nameJ: 'Pekara',
      parrentCategoryId: 4
    },
    {
      nameM: 'Muzeji',
      nameJ: 'Muzej',
      parrentCategoryId: 4
    },
    {
      nameM: 'Pet Shopovi',
      nameJ: 'Pet Shop',
      parrentCategoryId: 5
    },
    {
      nameM: 'Veterinari',
      nameJ: 'Veterina',
      parrentCategoryId: 5
    },
    {
      nameM: 'Auto Servisi',
      nameJ: 'Auto Servis',
      parrentCategoryId: 6
    },
    {
      nameM: 'Perionice',
      nameJ: 'Perionica',
      parrentCategoryId: 6
    },
    {
      nameM: 'Pumpe',
      nameJ: 'Pumpa',
      parrentCategoryId: 6
    },
    {
      nameM: 'Vulkanizeri',
      nameJ: 'Vulkanizer',
      parrentCategoryId: 6
    },
    {
      nameM: 'Teretane',
      nameJ: 'Teretana',
      parrentCategoryId: 7
    },
    {
      nameM: 'Tereni i hale',
      nameJ: 'Tereni i hale',
      parrentCategoryId: 7
    },
    {
      nameM: 'Opštine',
      nameJ: 'Opština',
      parrentCategoryId: 8
    },
    {
      nameM: 'Sudovi',
      nameJ: 'Sud',
      parrentCategoryId: 8
    },


  ],
  FriendStatusArr: [
    {
      status: "Requested"
    },
    {
      status: "Request sent"
    },
    {
      status: "Friends"
    },
    {
      status: "Blocked"
    }
  ],
  PersonsArr: [
    {
      username: "steva",
      password: "asddd",
      email: "steva@gmai.com",
      firstName: "Steva",
      lastName: "Stevic",
      facebook_id: "asdhasiu1h2suih12iuhiu",
      google_id: "asdhasiu1h2uihasd12iuhiu",
      userTypeId: 3,
      friends: [2, 3, 4],
      channel: randomid(16)
    },
    {
      username: "luka",
      password: "asddsdffd",
      email: "luka@gmaai.com",
      firstName: "Luka",
      lastName: "Lukic",
      facebook_id: "asdhasaiu1h2suih12iuhiu",
      google_id: "asdhasius1h2uihasd12iuhiu",
      userTypeId: 1,
      friends: [1, 3, 4],
      channel: randomid(16)
    },
    {
      username: "baki",
      password: "asddsfrrffrdffd",
      email: "baki@gmaai.com",
      firstName: "Baki",
      lastName: "Bakic",
      facebook_id: "asdhasaisssu1h2suih12iuhiu",
      google_id: "asdhasiusssss1h2uihasd12iuhiu",
      userTypeId: 1,
      friends: [1, 2, 4],
      channel: randomid(16)
    },
    {
      email: "stefanbakmaz@gmail.com",
      firstName: "Stefan",
      lastName: "Baki",
      password: "baki",
      google_id: "104477535345001896895",
      userTypeId: 1,
      friends: [1, 2, 3],
      channel: randomid(16)
    },
    {
      email: "simjanovic.luka@gmail.com",
      firstName: "Luka",
      lastName: "Simjanović",
      facebook_id: "697932020594424",
      userTypeId: 1,
      channel: randomid(16)
    }
  ],
  UserProfile: [
    {
      personId: 1,
      profileImageUrl: "http://www.belmedic.rs/img/doctors/59da4f8fe1b3e.jpg"
    },
    {
      personId: 2,
      profileImageUrl: "https://media.licdn.com/mpr/mpr/shrinknp_200_200/AAEAAQAAAAAAAAFMAAAAJDYyZjEyYjViLWEyODAtNDlhZC1iNjE2LWJhNjYzYWM1N2UzYQ.jpg"

    },
    {
      personId: 3,
      profileImageUrl: "http://www.alo.rs/resources/images/0000/020/066/baki%20b3_1000x0.jpg"

    },
    {
      personId: 4,
      profileImageUrl: "http://cybeletechnologies.com/wp-content/uploads/2017/10/baki1-1.jpg"
    },
    {
      personId: 5,
      profileImageUrl: "http://cybeletechnologies.com/wp-content/uploads/2017/10/luka1-1.jpg"
    }
  ],
  PersonCheckedObjects: [
    {
      personId: 1,
      objectClId: 1,
      datum: datum,
      count: 2
    },
    {
      personId: 1,
      objectClId: 3,
      datum: datum,
      count: 4
    },
    {
      personId: 1,
      objectClId: 5,
      datum: datum,
      count: 2
    },
    {
      personId: 1,
      objectClId: 6,
      datum: datum,
      count: 1
    },
    {
      personId: 1,
      objectClId: 9,
      datum: datum,
      count: 2
    },
    {
      personId: 1,
      objectClId: 11,
      datum: datum,
      count: 6
    },
    {
      personId: 2,
      objectClId: 1,
      datum: datum,
      count: 7
    },
    {
      personId: 2,
      objectClId: 1,
      datum: datum,
      count: 1
    },
    {
      personId: 2,
      objectClId: 3,
      datum: datum,
      count: 4
    },
    {
      personId: 2,
      objectClId: 4,
      datum: datum,
      count: 9
    }
  ],
  PersonFavoriteObjects: [
    {
      personId: 1,
      objectClId: 1
    },
    {
      personId: 1,
      objectClId: 3
    },
    {
      personId: 1,
      objectClId: 5
    },
    {
      personId: 1,
      objectClId: 9
    },
    {
      personId: 1,
      objectClId: 11
    },
    {
      personId: 2,
      objectClId: 1
    },
    {
      personId: 2,
      objectClId: 3
    },
    {
      personId: 2,
      objectClId: 4
    }
  ],
  FileCategory: [
    {
      type: 'profile',
      desc: 'Profile picture for Object'
    },
    {
      type: 'exterior',
      desc: 'Exterior picture for Object'
    },
    {
      type: 'interior',
      desc: 'Interior picture for Object'
    },
    {
      type: 'food',
      desc: 'Food picture for Object'
    },
    {
      type: 'user',
      desc: 'User uploaded image'
    }
  ],
  ObjectFiles: [
    {
      fileUrl: 'http://cdn.idesignow.com/public_html/img/2015/06/cafe-bar-restaurant-logo-17.jpg',
      desc: 'This is a very nice restaurant',
      objectClId: 1,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'http://diylogodesigns.com/blog/wp-content/uploads/2015/09/restaurant-logos.jpg',
      desc: 'Lukas favorite restaurant!',
      objectClId: 2,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://marketplace.canva.com/MACP0zWxJzE/1/0/thumbnail_large/canva-colorful-burger-icon-restaurant-logo-MACP0zWxJzE.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 3,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://image.freepik.com/free-vector/restaurant-logo-template_1236-155.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 4,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://www.brandcrowd.com/gallery/brands/pictures/picture12681208825244.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 5,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://i.pinimg.com/564x/0d/82/f9/0d82f9cff5bb23a5fdba81dbf76ac8f9--chase-bank-logo-s.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 6,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://static.mts.rs/vesti/MTS-Tvoj-Svet-1920x1080.jpg?d=False&h=635827483175600000',
      desc: 'Veoma lep restorancic',
      objectClId: 7,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://exquisiteconcierge.co.uk/wp-content/uploads/2016/05/timberland-logo-wallpaper.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 8,
      objectFileCategoryId: 1
    },
    {
      fileUrl: 'https://i.pinimg.com/736x/d7/da/ed/d7daed5a4cd14de571360cb09c2c89be--restaurant-exterior-design-ara.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 3
    },
    {
      fileUrl: 'https://secondandseven.co/imgs/amazing-beach-house-coffee-tables-best-25-restaurant-exterior-design-ideas-on-pinterest-exterior-outdoor-cafe-and-20171230081254.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 3
    },
    {
      fileUrl: 'http://www.coolenevada.com/images/Modern-Italian-Restaurant-Exterior-Design-Ferraros-Las-Vegas.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 3
    },
    {
      fileUrl: 'https://s3.eu-west-3.amazonaws.com/fitnetbucket/square.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 2
    },
    {
      fileUrl: 'https://s3.eu-west-3.amazonaws.com/fitnetbucket/square.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 2
    },
    {
      fileUrl: 'https://s3.eu-west-3.amazonaws.com/fitnetbucket/square.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 2
    },
    {
      fileUrl: 'https://drop.ndtv.com/albums/COOKS/pasta-vegetarian/pastaveg_640x480.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 4
    },
    {
      fileUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/1200px-Good_Food_Display_-_NCI_Visuals_Online.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 4
    },
    {
      fileUrl: 'https://drop.ndtv.com/albums/COOKS/chicken-dinner/chickendinner_640x480.jpg',
      desc: 'Veoma lep restorancic',
      objectClId: 1,
      objectFileCategoryId: 4
    },
  ],
  ObjectLocation: [
    {
      lat: 44.766313,
      lng: 20.368652,
      objectClId: 1,
      address: 'Kneza Mihaila 6',
      city: 'Beograd',
      zipCode: '11000'
    },
    {
      lat: 44.789652,
      lng: 20.433025,
      objectClId: 2,
      address: 'Bubanjska 1a',
      city: 'Beograd',
      zipCode: '11130'
    },
    {
      lat: 44.814377,
      lng: 20.495167,
      objectClId: 3
    },
    {
      lat: 44.826675,
      lng: 20.410194,
      objectClId: 4
    },
    {
      lat: 44.851507,
      lng: 20.375519,
      objectClId: 5
    },
    {
      lat: 44.820569,
      lng: 20.291576,
      objectClId: 6
    },
    {
      lat: 44.760406,
      lng: 20.412941,
      objectClId: 7
    },
    {
      lat: 44.737486,
      lng: 20.380497,
      objectClId: 8
    },
    {
      lat: 44.784535,
      lng: 20.486240,
      objectClId: 9
    },
    {
      lat: 44.806949,
      lng: 20.554905,
      objectClId: 10
    },
  ],
  wtMon: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],
  wtTue: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],
  wtWed: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],
  wtThu: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],
  wtFri: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],
  wtSat: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],
  wtSun: [
    {
      opening: '0000',
      closing: '2400'
    },
    {
      opening: '0800',
      closing: '1600'
    },
    {
      opening: '0900',
      closing: '1700'
    },
    {
      opening: '0645',
      closing: '2030'
    },
    {
      opening: '2200',
      closing: '0600'
    }
  ],

 
  ObjectWorkTime: [
    {
      objectClId: 1,
      isAlwaysOpened: true,
      wtMonId: 1,
      wtTueId: 1,
      wtWedId: 1,
      wtThuId: 1,
      wtFriId: 1,
      wtSatId: 1,
      wtSunId: 1,
    },
    {
      objectClId: 2,
      isAlwaysOpened: false,
      wtMonId: 2,
      wtTueId: 2,
      wtWedId: 2,
      wtThuId: 2,
      wtFriId: 2,
      wtSatId: 2,
      wtSunId: 2,
    },
    {
      objectClId: 3,
      isAlwaysOpened: false,
      wtMonId: 3,
      wtTueId: 3,
      wtWedId: 3,
      wtThuId: 3,
      wtFriId: 3,
      wtSatId: 3,
      wtSunId: 3,
    },
    {
      objectClId: 4,
      isAlwaysOpened: false,
      wtMonId: 4,
      wtWedId: 3,
      wtThuId: 2,
      wtFriId: 1,
      wtSatId: 5,
      wtSunId: 4,
    },
  ],
  SpecialWorkTime: [
    {
      objectWorkTimeId: 1,
      name: "Veliki Petak",
      date: "6.4",
      icon: "https://www.shareicon.net/data/128x128/2015/11/06/667985_design_512x512.png",
    },
    {
      objectWorkTimeId: 1,
      name: "Slava mi",
      date: "13.4",
      icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Orthodox_cross.svg/450px-Orthodox_cross.svg.png",
      opening: "1000",
      closing: "1700"
    }
  ],
  SectorWorkTime: [
    {
      objectClId: 1,
      name: 'Kuhinja',
      wtMonId: 2,
      wtTueId: 2,
      wtWedId: 2,
      wtThuId: 2,
      wtFriId: 2,
      wtSatId: 2,
    },
    {
      objectClId: 1,
      name: 'Restoran',
      wtMonId: 3,
      wtTueId: 3,
      wtWedId: 3,
      wtThuId: 3,
      wtFriId: 3,
      wtSatId: 3,
      wtSunId: 3,
    },
    {
      objectClId: 1,
      name: 'Dostava',
      wtMonId: 2,
      wtTueId: 2,
      wtWedId: 2,
      wtThuId: 2,
      wtFriId: 2,
      wtSatId: 2,
      wtSunId: 2,
    },
    {
      objectClId: 2,
      name: 'Biletarnica',
      wtMonId: 2,
      wtTueId: 2,
      wtWedId: 2,
      wtThuId: 2,
      wtFriId: 2,
      wtSatId: 2,
    },
    {
      objectClId: 2,
      name: 'Sala',
      wtMonId: 2,
      wtTueId: 2,
      wtWedId: 2,
      wtThuId: 2,
      wtFriId: 2,
      wtSatId: 2,
    }
  ],
  ObjectInfo: [
    {
      objectClId: 1,
      websiteUrl: 'https://restaurantindigo.com',
      hasRestaurant: true,
      popularBecauseOf: 'Prelep pogled na svet, Lepa trava u basti, Lepa trava u masti'
    },
    {
      objectClId: 2,
      websiteUrl: 'https://vaporwavecommunity.com',
      hasRestaurant: false,
      popularBecauseOf: 'Premium nargile, Dolazi bajaga ponekad'
    },
    {
      objectClId: 3,
      websiteUrl: 'https://whenlifegivesyoulemons.ninja',
      hasRestaurant: true,
      popularBecauseOf: 'U srednjoj bacio trojku iza glave preko pola terena'
    },
  ],
  ObjectPhones: [
    {
      objectInfoId: 1,
      desc: 'Fiksni',
      number: '+381114578952'
    },
    {
      objectInfoId: 1,
      desc: 'Mobilni',
      number: '+381653264129'
    },
    {
      objectInfoId: 2,
      desc: 'Hala',
      number: '+381115252545'
    }
  ],
  UserType: [
    {
      name: "user",
    },
    {
      name: "moderator",
    },
    {
      name: "administrator",
    }
  ],
  LiveQuestions: [
    {
      title: "Gde ima kafic a da ima akvarium?", 
      text: "Ja mnogo volim da gledam ribe, bas su dobre ribe pa je bas kul, uf bas su lepe ribe. volim ribe.",
      locationId: 1,
      personId: 2,
      answered: true,
      objectCategoryId: 1
    },
    {
      title: "Trazim restoran za dvoje",
      text: "Mislim na erotik sop, sa brda igracaka tipa dildo ili tako nesto, moze i sta god nema vze. Ma ne trazim nista.",
      locationId: 1,
      personId: 3,
      answered: false,
      objectCategoryId: 1
    },
    {
      title: "Gde ste drugari iz skole srednje?",
      text: "Lorem ipsum dolor met lopov ket kvoter set",
      locationId: 1,
      personId: 2,
      answered: false,
      objectCategoryId: 1
    },
    {
      title: "Onaj cigoje reko drugacije",
      text: "tebra evo ti i na ovoj lokaciji idi upm",
      locationId: 1,
      personId: 3,
      answered: false,
      objectCategoryId: 2
    },
    {
      title: "Nije htela.",
      text: "Niiiiiiiije htelaaa",
      locationId: 2,
      personId: 3,
      answered: false,
      objectCategoryId: 2
    },
    {
      title: "Kad popijem.",
      text: "Oj kad popijem i zapevam roso i za pevam roso  ne cu kuci oj ne cu kuci necu ni na poso necu ni na poso. Idem kuci sve po starom jos se vozim bulevarom bulevarom rervolucije, da li kuci il na poso samo su dve solucije. Duni vetre malo preko jetre duni vetre malo preko jetre, umrecu od pola umrecu od pola izgorelo svve od alkohola",
      locationId: 2,
      personId: 2,
      answered: false,
      objectCategoryId: 3
    },
  ],
  LiveReviews: [
    {
      text: "Tebra imas tu negde u beogradu znas zove se akvarijum brate.",
      personId: 1,
      liveQuestionId: 1,
      isAnswer: true
    },
    {
      text: "Hvala prijatelju puno!",
      personId: 2,
      liveQuestionId: 1,
      isAnswer: false
    },
    {
      text: "Imas i u ruzveltovoj tamo pored levo.",
      personId: 2,
      liveQuestionId: 1,
      isAnswer: false
    }
  ]

}