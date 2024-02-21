const { MongoClient, ObjectId } = require("mongodb");
const Bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// MongoDB connection setup
async function connectToMongoDB() {
  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await client.connect();
  console.log("mongo connencted sucess");
  return client.db("B2B");
}

// Fetch data function
async function fetchData(collectionName) {
  const db = await connectToMongoDB();
  const collection = db.collection(collectionName);
  const cursor = collection.find({});
  return cursor.toArray();
}

async function findUserByEmail(Email) {
  const db = await connectToMongoDB();
  const collection = db.collection("users");
  // const prdcollection = db.collection("products"); //colection prd

  const user = await collection.findOne({ email: Email });
  // const idee = await prdcollection.findOne({ id });
  return user;
}

const findid =async(id)=>{
  console.log(id);
  const db = await connectToMongoDB();
  const prdcollection = db.collection("products");
  const idee = await prdcollection.findOneAndDelete({ _id: new ObjectId(id) });
  return idee;
}

const findProduct =async(id)=>{
  const db = await connectToMongoDB();
  const prdcollection = db.collection("products");
  const details = await prdcollection.findOne({ _id: new ObjectId(id) });
  return details;
};

async function findUserById(id) {
  const db = await connectToMongoDB();
  const collection = db.collection("users");
  const user = await collection.findOne({ _id: new ObjectId(id) });
  return user;
}

//POST:http://localhost:4000/api/v1/login
exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(500)
        .json({ message: "Pls Enter a Email And Password" });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPassWordMatched = await Bcrypt.compare(password, user.password);

    if (!isPassWordMatched) {
      return res
        .status(401)
        .json({ message: "Invalid Phone_number or password" });
    }

    const secretKey = process.env.JW_TKEY;

    const userData = {
      UserId: user._id,
      Email: user.Email,
    };

    const expiresIn = "5d";

    // Generate the JWT token
    const token = jwt.sign(userData, secretKey, { expiresIn });
    return res.status(200).json({
      success: true,
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/products
exports.getProducts = async (req, res, next) => {
  try {
    const products = await fetchData("products");
    if (!products) {
      return res.status(401).json({ message: "NO products Available" });
    }

    return res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/orders
exports.getAdminOrders = async (req, res, next) => {
  try {
    const Orders = await fetchData("orders");

    if (!Orders) {
      return res.status(401).json({ message: "Order is empty" });
    }

    return res.status(200).json({
      success: true,
      Orders,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/Orders/Details
exports.getOrderdetails = async (req, res, next) => {
  try {
    const OrderDetails = await fetchData("useraccounts");
    if (!OrderDetails) {
      return res.status(401).json({ message: " no details" });
    }

    return res.status(200).json({
      success: true,
      OrderDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/users
exports.getAdminUsers = async (req, res, next) => {
  try {
    const allUsers = await fetchData("useraccounts");
    if (!allUsers) {
      return res.status(401).json({ message: "User is empty" });
    }

    return res.status(200).json({
      success: true,
      allUsers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/Seller
exports.getAdminSeller = async (req, res, next) => {
  try {
    const allSeller = await fetchData("useraccounts");
    if (!allSeller) {
      return res.status(401).json({ message: "Seller is empty" });
    }

    return res.status(200).json({
      success: true,
      allSeller,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/buyer
exports.adminBuyer = async (req, res) => {
  try {
    const buyer = await fetchData("buyers");

    if (!buyer) {
      return res.status(401).json({ message: "buyer not found" });
    }

    return res.status(200).json({
      success: true,
      buyer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//DELETE:http://localhost:4000/api/v1/product/:id
exports.DeleteProduct = async (req, res) => {
  const usreID = req.params.id;

  try {
    const result = await findid(usreID);

    if (!result) {
      return res
        .status(401)
        .json(`Product does not exceed with id: ${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: "product deleted succesfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//GET:http://localhost:4000/api/v1/admin/user/:id
exports.ProductDetails = async (req, res) => {

  const usreID = req.params.id;

  try {
    const result = await findProduct(usreID);


    if (!result) {
      return res
        .status(401)
        .json(`Product does not exceed with id: ${req.params.id}`);
    }

    const ProductImagesUrls = JSON.parse(result.images).map((ele) => '/' + ele.filename);
  
    return res.status(200).json({
      success: true,
      product_name: product.productName,
      category_type: product.categoryType,
      description: product.description,
      prices: product.prices,
      onsale: product.onSale,
      specs: product.specs,
      images: ProductImagesUrls,
  });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Load user Details
exports.LOaduser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    

    if (!token) {
      return res.sendStatus(401, "Empty token"); // Unauthorized..x
    }

    const secretKey = process.env.JW_TKEY;

    const decodedata = jwt.verify(token, secretKey);
    const UserId = decodedata.UserId;

    const user = await findUserById(UserId);

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
