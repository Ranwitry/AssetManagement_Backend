const express = require("express");
const app = express();
const cors = require("cors");
const dbConn = require("./db");
const bodyParser = require('body-parser');
const multer = require('multer')
const path = require("path");
var fs = require('fs');

app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

//middleware
app.use(cors());
app.use(express.json());

// define a root route
app.get('/', (req, res) => {
  res.send("Hello World");
});

app.get('/tests', (req, res) => {
  dbConn.connect(function (err) {
    if (err) throw err;
    console.log("Database Connected!");
  });
});

//route get

app.get('/user', (req, res) => {
  const querySql = 'SELECT * FROM user';

  dbConn.query(querySql, (err, rows, field) => {
    if (err) {
      return res.status(500).json(
        {
          message: 'Ada kesalahan',
          error: err
        }
      );
    }
    res.status(200).json({ success: true, data: rows });
  });
});

app.get('/asset', (req, res) => {
  const querySql = 'SELECT * from asset';

  dbConn.query(querySql, (err, rows, field) => {
    if (err) {
      return res.status(500).json(
        {
          message: 'Ada kesalahan',
          error: err
        }
      );
    }
    res.status(200).json({ success: true, data: rows });
  });
});

app.get('/asset_expires', (req, res) => {
  const querySql = 'SELECT * from asset_expires';

  dbConn.query(querySql, (err, rows, field) => {
    if (err) {
      return res.status(500).json(
        {
          message: 'Ada kesalahan',
          error: err
        }
      );
    }
    res.status(200).json({ success: true, data: rows });
  });
});

//post route
app.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    const { password } = req.body;

    querySql = "SELECT * FROM user WHERE username = ? AND password_user = ?"
    valueSql = [username, password]

    dbConn.query(querySql, valueSql, (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: 'Ada kesalahan', error: err.message
        });
      }
      res.status(200).json({
        success: true, data: rows[0]
      });
    });
  } catch (err) {
    return res.status(500).json({ message: 'Ada kesalahan', error: err.message });
  }
})

app.post("/user", async (req, res) => {
  try {
    const { username } = req.body;
    const { name_user } = req.body;
    const { email_user } = req.body;
    const { password_user } = req.body;
    const { phone_number_user } = req.body;
    const { jabatan_user } = req.body;
    const { type_user } = req.body;
    const { type } = req.body;

    if (type == 'add') {
      querySql = "INSERT INTO user (username, name_user, email_user, password_user, phone_number_user, jabatan_user, type_user) VALUES (?,?,?,?,?,?,?)"
      valueSql = [username, name_user, email_user, password_user, phone_number_user, jabatan_user, type_user]
    } else if (type == 'update') {
      querySql = "UPDATE user set username = ?, name_user = ?, email_user = ?, password_user = ?, phone_number_user = ?, jabatan_user = ?, type_user = ? where username = ?"
      valueSql = [username, name_user, email_user, password_user, phone_number_user, jabatan_user, type_user, username]
    } else if (type == 'delete') {
      querySql = "DELETE FROM user WHERE username = ?"
      valueSql = [username]
    }

    dbConn.query(querySql, valueSql, (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: 'Ada kesalahan', error: err.message
        });
      }
      res.status(200).json({
        success: true, data: rows
      });
    });

  } catch (err) {
    return res.status(500).json({ message: 'Ada kesalahan', error: err.message });
  }
})

app.post("/asset_id", async (req, res) => {
  try {
    const { date } = req.body;

    querySql = "INSERT INTO asset_id (date) VALUES (?)"
    valueSql = [date]

    dbConn.query(querySql, valueSql, (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: 'Ada kesalahan', error: err.message
        });
      }
      res.status(200).json({
        success: true, data: rows
      });
    });

  } catch (err) {
    return res.status(500).json({ message: 'Ada kesalahan', error: err.message });
  }
})

app.post("/asset", async (req, res) => {
  try {
    const { asset_id } = req.body;
    const { asset_type } = req.body;
    const { asset_pic } = req.body;
    const { asset_name } = req.body;
    const { asset_brand } = req.body;
    const { asset_location } = req.body;
    const { asset_date } = req.body;
    const { asset_period } = req.body;
    const { asset_price } = req.body;
    const { asset_detail1 } = req.body;
    const { asset_detail2 } = req.body;
    const { asset_detail3 } = req.body;
    const { asset_detail4 } = req.body;
    const { asset_detail5 } = req.body;
    const { asset_front_image } = req.body;
    const { asset_back_image } = req.body;
    const { type } = req.body;

    if (type == 'add') {
      querySql = "INSERT INTO asset (asset_id, asset_type, asset_pic, asset_name, asset_brand, asset_location, asset_date, asset_period, asset_price, asset_detail1, asset_detail2, asset_detail3, asset_detail4, asset_detail5, asset_front_image, asset_back_image) VALUES (concat(?, '0', (select max(id) from asset_id)),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
      valueSql = [asset_id, asset_type, asset_pic, asset_name, asset_brand, asset_location, asset_date, asset_period, asset_price, asset_detail1, asset_detail2, asset_detail3, asset_detail4, asset_detail5, asset_front_image, asset_back_image]
    } else if (type == 'update') {
      querySql = "UPDATE asset set asset_type = ?, asset_pic = ?, asset_name = ?, asset_brand = ?, asset_location = ?, asset_date = ?, asset_period = ?, asset_price = ?, asset_detail1 = ?, asset_detail2 = ?, asset_detail3 = ?, asset_detail4 = ?, asset_detail5 = ?, asset_front_image = ?, asset_back_image = ? where asset_id = ?"
      valueSql = [asset_type, asset_pic, asset_name, asset_brand, asset_location, asset_date, asset_period, asset_price, asset_detail1, asset_detail2, asset_detail3, asset_detail4, asset_detail5, asset_front_image, asset_back_image, asset_id]
    } else if (type == 'delete') {
      querySql = "DELETE FROM asset WHERE asset_id = ?"
      valueSql = [asset_id, asset_front_image, asset_back_image]
      fs.unlinkSync(`./images/${asset_front_image}`);
      fs.unlinkSync(`./images/${asset_back_image}`);
    }

    dbConn.query(querySql, valueSql, (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: 'Ada kesalahan', error: err.message
        });
      }
      res.status(200).json({
        success: true, data: rows
      });
    });

  } catch (err) {
    return res.status(500).json({ message: 'Ada kesalahan', error: err.message });
  }
})

app.post("/asset_expires", async (req, res) => {
  try {
    const { asset_expires_id } = req.body;
    const { asset_type } = req.body;
    const { asset_pic } = req.body;
    const { asset_name } = req.body;
    const { asset_brand } = req.body;
    const { asset_location } = req.body;
    const { asset_date } = req.body;
    const { asset_period } = req.body;
    const { asset_price } = req.body;
    const { asset_detail1 } = req.body;
    const { asset_detail2 } = req.body;
    const { asset_detail3 } = req.body;
    const { asset_detail4 } = req.body;
    const { asset_detail5 } = req.body;
    const { asset_front_image } = req.body;
    const { asset_back_image } = req.body;

    querySql = "INSERT INTO asset_expires (asset_expires_id, asset_type, asset_pic, asset_name, asset_brand, asset_location, asset_date, asset_period, asset_price, asset_detail1, asset_detail2, asset_detail3, asset_detail4, asset_detail5, asset_front_image, asset_back_image) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
    valueSql = [asset_expires_id, asset_type, asset_pic, asset_name, asset_brand, asset_location, asset_date, asset_period, asset_price, asset_detail1, asset_detail2, asset_detail3, asset_detail4, asset_detail5, asset_front_image, asset_back_image]

    dbConn.query(querySql, valueSql, (err, rows) => {
      if (err) {
        return res.status(500).json({
          message: 'Ada kesalahan', error: err.message
        });
      }
      res.status(200).json({
        success: true, data: rows
      });
    });

  } catch (err) {
    return res.status(500).json({ message: 'Ada kesalahan', error: err.message });
  }
})

app.use('/showImages', express.static('./images'))

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, `images/`));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname
    );
  },
});

app.post("/image",
  multer({ storage: diskStorage }).single("image"), (req, res) => {
    const file = req.file.path;
    if (!file) {
      res.status(400).send({
        status: false,
        data: "No File is selected.",
      });
    }
    res.send(file);
  }
)

app.listen(5000, () => {
  console.log(`Server is listening on port 3000`);
});