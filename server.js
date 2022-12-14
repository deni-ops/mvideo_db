'use strict';
const {faker} = require('@faker-js/faker');
const {retrieveArray, createCategoryItems, User, Address_book, Manufacturer, Item, Cart, Favourite_item, Store, Favourite_store, Order, Items_within_store, Items_within_order, Video_recorder, Tv, Tablet, System_unit, Smartphone, Laptop, Hoover, Headphone, Grinder, Game_console, Fridge, Camera} = require('./utils')

// import generators 
const {createRandomUserService} = require('./generators/user');
const {createRandomItemService} = require('./generators/item');
const {createRandomStoreService} = require('./generators/store');
const {createRandomAddressBookService} = require('./generators/address_book');
const {createRandomCartService} = require('./generators/cart');
const {createRandomOrderService} = require('./generators/order');
const {createRandomManufacturerService} = require('./generators/manufacturer');
const {createRandomVideoRecorderService} = require('./generators/video_recorder');
const {createRandomTvService} = require('./generators/tv');
const {createRandomTabletService} = require('./generators/tablet');
const {createRandomSystemUnitService} = require('./generators/system_unit');
const {createRandomSmartphoneService} = require('./generators/smartphone')
const {createRandomLaptopService} = require('./generators/laptop');
const {createRandomHooverService} = require('./generators/hoover');
const {createRandomHeadphoneService} = require('./generators/headphone');
const {createRandomGrinderService} = require('./generators/grinder');
const {createRandomGameConsoleService} = require('./generators/game_console');
const {createRandomFridgeService} = require('./generators/fridge');
const {createRandomCameraService} = require('./generators/camera');

// generate fake data for tables
let users = createRandomUserService(150); // PRIMARY
let address_books = createRandomAddressBookService(150); // FK: user_id -> id (user)
let manufacturers = createRandomManufacturerService(200); // PRIMARY
let items = createRandomItemService(8000); // FK: manufacturer_id -> id (manufacturer)
let carts = createRandomCartService(150); // FK: user_id -> id (user), FK: item_id -> id (item)
let favourite_items = new Array(50); // doesn't have its own generator because this table is comprised of FK's only
let stores = createRandomStoreService(40); // PRIMARY
let favourite_stores = new Array(4); // doesn't have its own generator because this table is comprised of FK's only
let orders = createRandomOrderService(100); // FK: user_id -> id (user)
let items_within_stores = new Array(4); // doesn't have its own generator because this table is comprised of FK's only
let items_within_orders = new Array(4); // doesn't have its own generator because this table is comprised of FK's only

// all tables below have FK: id -> id (item)
let video_recorders = createRandomVideoRecorderService(30);
let tvs = createRandomTvService(40);
let tablets = createRandomTabletService(50);
let system_units = createRandomSystemUnitService(25);
let smartphones = createRandomSmartphoneService(70);
let laptops = createRandomLaptopService(100);
let hoovers = createRandomHooverService(45);
let headphones = createRandomHeadphoneService(90);
let grinders = createRandomGrinderService(120);
let game_consoles = createRandomGameConsoleService(110);
let fridges = createRandomFridgeService(70);
let cameras = createRandomCameraService(150);

console.log(users);
console.log(address_books);
console.log(manufacturers);
console.log(items);
console.log(carts);
console.log(favourite_items);
console.log(stores);
console.log(favourite_stores);
console.log(orders);
console.log(items_within_stores);
console.log(items_within_orders);
console.log(video_recorders);
console.log(tvs);
console.log(tablets);
console.log(system_units);
console.log(smartphones);
console.log(laptops);
console.log(hoovers);
console.log(headphones);
console.log(grinders);
console.log(game_consoles);
console.log(fridges);
console.log(cameras);

(async () => {
      const createdUsers = await User.bulkCreate(users);

      for (let i=0; i<address_books.length; ++i) {
        address_books[i] = Object.assign({user_id: createdUsers.at(i).id}, address_books[i]);
      }

      await Address_book.bulkCreate(address_books); 
      const createdManufacturers = await Manufacturer.bulkCreate(manufacturers);

      for (let i=0; i<items.length; ++i) {
        let availableIds = retrieveArray(createdManufacturers);
        let randomId = faker.helpers.arrayElement(availableIds);
        items[i] = Object.assign(items[i], {manufacturer_id: faker.helpers.arrayElement(availableIds)});
      }

      const createdItems = await Item.bulkCreate(items);

      for (let i=0; i<carts.length; ++i) {
        let availableUserIds = retrieveArray(createdUsers);
        let availableItemIds = retrieveArray(createdItems);

        let randomUserId = 0;
        let randomItemId = 0;

        while (true) {
        // this loop ensures that generated userId and itemId make up unique sequence (i.e. PK)
          let toBreak = true;

          randomUserId = faker.helpers.arrayElement(availableUserIds);
          randomItemId = faker.helpers.arrayElement(availableItemIds);

          let mergedRandom = randomUserId.toString() + randomItemId.toString();

          for (let j=0; j<i; ++j) {
            let mergedPresent = carts[j].user_id.toString() + carts[j].item_id.toString();

            if (mergedPresent === mergedRandom) {
              toBreak = false;
              break;
            }
          }
          if (toBreak) {
            break;
          }
        }
        carts[i] = Object.assign({user_id: randomUserId, item_id: randomItemId}, carts[i]);
      }

      await Cart.bulkCreate(carts);

      for (let i=0; i<favourite_items.length; ++i) {
        let availableUserIds = retrieveArray(createdUsers);
        let availableItemIds = retrieveArray(createdItems);

        let randomUserId = 0;
        let randomItemId = 0;

        while (true) {
        // this loop ensures that generated userId and itemId make up unique sequence (i.e. PK)
          let toBreak = true;

          randomUserId = faker.helpers.arrayElement(availableUserIds);
          randomItemId = faker.helpers.arrayElement(availableItemIds);

          let mergedRandom = randomUserId.toString() + randomItemId.toString();

          for (let j=0; j<i; ++j) {
            let mergedPresent = favourite_items[j].user_id.toString() + favourite_items[j].item_id.toString();

            if (mergedPresent === mergedRandom) {
              toBreak = false;
              break;
            }
          }
          if (toBreak) {
            break;
          }
        }
        favourite_items[i] = {user_id: randomUserId, item_id: randomItemId};
      }

      await Favourite_item.bulkCreate(favourite_items);

      const createdStores = await Store.bulkCreate(stores);

      for (let i=0; i<favourite_stores.length; ++i) {
        let availableUserIds = retrieveArray(createdUsers);
        let availableStoreIds = retrieveArray(createdStores);

        let randomUserId = 0;
        let randomStoreId = 0;

        while (true) {
        // this loop ensures that generated userId and itemId make up unique sequence (i.e. PK)
          let toBreak = true;

          randomUserId = faker.helpers.arrayElement(availableUserIds);
          randomStoreId = faker.helpers.arrayElement(availableStoreIds);

          let mergedRandom = randomUserId.toString() + randomStoreId.toString();

          for (let j=0; j<i; ++j) {
            let mergedPresent = favourite_stores[j].user_id.toString() + favourite_stores[j].store_id.toString();

            if (mergedPresent === mergedRandom) {
              toBreak = false;
              break;
            }
          }
          if (toBreak) {
            break;
          }
        }
        favourite_stores[i] = {user_id: randomUserId, store_id: randomStoreId};
      }

      await Favourite_store.bulkCreate(favourite_stores);

      for (let i=0; i<orders.length; ++i) {
        let availableIds = retrieveArray(createdUsers);
        let randomId = faker.helpers.arrayElement(availableIds);
        orders[i] = Object.assign({user_id: randomId}, orders[i]);
      }

      const createdOrders = await Order.bulkCreate(orders); 

      for (let i=0; i<items_within_stores.length; ++i) {
        let availableItemIds = retrieveArray(createdItems);
        let availableStoreIds = retrieveArray(createdStores);

        let randomItemId = 0;
        let randomStoreId = 0;
        let randomQuantity = faker.datatype.number({ min: 1, max: 10})

        while (true) {
        // this loop ensures that generated userId and itemId make up unique sequence (i.e. PK)
          let toBreak = true;

          randomItemId = faker.helpers.arrayElement(availableItemIds);
          randomStoreId = faker.helpers.arrayElement(availableStoreIds);

          let mergedRandom = randomItemId.toString() + randomStoreId.toString();

          for (let j=0; j<i; ++j) {
            let mergedPresent = items_within_stores[j].item_id.toString() + items_within_stores[j].store_id.toString();

            if (mergedPresent === mergedRandom) {
              toBreak = false;
              break;
            }
          }
          if (toBreak) {
            break;
          }
        }
        items_within_stores[i] = {store_id: randomStoreId, item_id: randomItemId, item_quantity: randomQuantity};
      }

      await Items_within_store.bulkCreate(items_within_stores);


      for (let i=0; i<items_within_orders.length; ++i) {
        let availableItemIds = retrieveArray(createdItems);
        let availableOrderIds = retrieveArray(createdOrders);

        let randomItemId = 0;
        let randomOrderId = 0;
        let randomQuantity = faker.datatype.number({ min: 1, max: 10})

        while (true) {
        // this loop ensures that generated userId and itemId make up unique sequence (i.e. PK)
          let toBreak = true;

          randomItemId = faker.helpers.arrayElement(availableItemIds);
          randomOrderId = faker.helpers.arrayElement(availableOrderIds);

          let mergedRandom = randomItemId.toString() + randomOrderId.toString();

          for (let j=0; j<i; ++j) {
            let mergedPresent = items_within_orders[j].item_id.toString() + items_within_orders[j].order_id.toString();

            if (mergedPresent === mergedRandom) {
              toBreak = false;
              break;
            }
          }
          if (toBreak) {
            break;
          }
        }
        items_within_orders[i] = {order_id: randomOrderId, item_id: randomItemId, item_quantity: randomQuantity};
      }

      await Items_within_order.bulkCreate(items_within_orders);



      // categories section
      let available_item_ids = retrieveArray(createdItems);

      // 1) video_recorder
      video_recorders = createCategoryItems(video_recorders, available_item_ids.filter(x => x % 12 === 0));
      await Video_recorder.bulkCreate(video_recorders);

      // 2) tv
      tvs = createCategoryItems(tvs, available_item_ids.filter(x => x % 12 === 1));
      await Tv.bulkCreate(tvs);

      // 3) tablets
      tablets = createCategoryItems(tablets, available_item_ids.filter(x => x % 12 === 2));
      await Tablet.bulkCreate(tablets);

      // 4) system_units
      system_units = createCategoryItems(system_units, available_item_ids.filter(x => x % 12 === 3));
      await System_unit.bulkCreate(system_units);

      // 5) smartphones
      smartphones = createCategoryItems(smartphones, available_item_ids.filter(x => x % 12 === 4));
      await Smartphone.bulkCreate(smartphones);

      // 6) laptops
      laptops = createCategoryItems(laptops, available_item_ids.filter(x => x % 12 === 5));
      await Laptop.bulkCreate(laptops);

      // 7) hoovers
      hoovers = createCategoryItems(hoovers, available_item_ids.filter(x => x % 12 === 6));
      await Hoover.bulkCreate(hoovers);

      // 8) headphone
      headphones = createCategoryItems(headphones, available_item_ids.filter(x => x % 12 === 7));
      await Headphone.bulkCreate(headphones);

      // 9) grinders
      grinders = createCategoryItems(grinders, available_item_ids.filter(x => x % 12 === 8));
      await Grinder.bulkCreate(grinders);

      // 10) game_consoles
      game_consoles = createCategoryItems(game_consoles, available_item_ids.filter(x => x % 12 === 9));
      await Game_console.bulkCreate(game_consoles);

      // 11) fridges
      fridges = createCategoryItems(fridges, available_item_ids.filter(x => x % 12 === 10));
      await Fridge.bulkCreate(fridges);

      // 12) cameras
      cameras = createCategoryItems(cameras, available_item_ids.filter(x => x % 12 === 11));
      await Camera.bulkCreate(cameras);
    })();