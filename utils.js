const { Sequelize, Model, DataTypes, INTEGER } = require("sequelize");

let sequelize = new Sequelize('mvideo_orm_1', 'postgres', 'mypass1', {
    host: 'localhost',
    dialect: 'postgres',
});

module.exports.retrieveArray = function(primaryTable, pk="id") {
    let arr = [];
    for (let i=0; i<primaryTable.length; ++i) {
        arr.push(primaryTable.at(i)[pk]);
    }
    return arr;
}

let User = sequelize.define("user", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    patronymic: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    gender: {
        type: DataTypes.STRING,
    },
    date_of_birth: {
        type: DataTypes.DATE
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone: {
        type: DataTypes.STRING
    },
    extra_phone: {
        type: DataTypes.STRING
    }

  },
  {timestamps: false,});

  let Address_book = sequelize.define("address_book", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: User,
          key: 'id',
        }
    },
    city: {
        type: DataTypes.STRING
    },
    street: {
        type: DataTypes.STRING
    },
    building: {
        type: DataTypes.STRING
    },
    entrance: {
        type: DataTypes.STRING
    },
    apartment: {
        type: DataTypes.STRING
    },
    commentary: {
        type: DataTypes.STRING 
    }
  },
  {timestamps: false,});

  let Manufacturer = sequelize.define("manufacturer", {
    name: {
        type: DataTypes.STRING
    },
  },
  {timestamps: false,});

  let Item = sequelize.define("item", {
    price: {
        type: DataTypes.FLOAT
    },
    name: {
        type: DataTypes.STRING
    },
    description: {
        type: DataTypes.STRING
    },
    manufacturer_id: {
        type: DataTypes.INTEGER,
    
        references: {
          model: Manufacturer,
          key: 'id',
        }
    },
  },
  {timestamps: false,});

  let Cart = sequelize.define("cart", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: User,
          key: 'id',
        }
    },
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: Item,
          key: 'id',
        }
    },
    item_quantity: {
        type: DataTypes.INTEGER
    }

  },
  {timestamps: false,});

  let Store = sequelize.define("store", {
    city: {
        type: DataTypes.STRING
    },
    street: {
        type: DataTypes.STRING
    }
  },
  {timestamps: false,});

  let Favourite_item = sequelize.define("favourite_item", {
    item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: Item,
          key: 'id',
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: User,
          key: 'id',
        }
    },
  },
  {timestamps: false,});

  let Favourite_store = sequelize.define("favourite_store", {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: User,
          key: 'id',
        }
    },
    store_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    
        references: {
          model: Store,
          key: 'id',
        }
    },
  },
  {timestamps: false,});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
      await sequelize.sync();
    })();

    module.exports.User = User;
    module.exports.Address_book = Address_book;
    module.exports.Manufacturer = Manufacturer;
    module.exports.Item = Item;
    module.exports.Cart = Cart;
    module.exports.Store = Store;
    module.exports.Favourite_item = Favourite_item;
    module.exports.Favourite_store = Favourite_store;