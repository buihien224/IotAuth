var firebaseConfig = {
  apiKey: "AIzaSyCnLSF9fYxc5YUOjufb8U1sEWx8DwiziH0",
  authDomain: "iotfinal-c8c5a.firebaseapp.com",
  projectId: "iotfinal-c8c5a",
  storageBucket: "iotfinal-c8c5a.appspot.com",
  messagingSenderId: "155689895407",
  appId: "1:155689895407:web:d38e4eecddef0af95aa21a",
  measurementId: "G-EW8G05TFT5"
};

firebase.initializeApp(firebaseConfig);
var auth = firebase.auth()
var itemsRef = firebase.database().ref().child("tab1");

var w_name = document.getElementById("name");
var w_des = document.getElementById("des");
var w_pri = document.getElementById("pri");

var names = document.getElementById("name_label");
var dess = document.getElementById("des_label");
var pris = document.getElementById("pri_label");

var ids = document.getElementById("form1");

//DHT11
firebase.database().ref().child("sensor").child("temp").on('value', function(snap) {
  document.getElementById("temp").innerHTML = snap.val();
});
firebase.database().ref().child("sensor").child("humi").on('value', function(snap) {
  document.getElementById("humi").innerHTML = snap.val();
});



async function readData() {
  const value = await itemsRef.get();
  return value;
}


// sign out button
let signOutButton = document.getElementById("signout")
signOutButton.addEventListener("click", (e) => {
  //Prevent Default Form Submission Behavior
  e.preventDefault()
  console.log("clicked")

  auth.signOut()
  alert("Signed Out")
  window.location = "index.html";
})


// clear data button
let clearButton = document.getElementById("clear")
clearButton.addEventListener("click", (e) => {
  //Prevent Default Form Submission Behavior
  e.preventDefault()
  console.log("clear")
  firebase.database().ref("Items").set(null);
  alert("Clear data")
})

// Initializing variables
window.tableData = {};

window.onload = function() {
syncCron();

};

async function syncCron() {
  const tempData = {};
  const Entries = await readData();

  Entries.forEach(entry => {
      tempData[entry.key] = entry.toJSON();
  });

  if (!deepEqual(tableData, tempData)) {
      // Clones tempData into tableData and render if data has updated
      tableData = JSON.parse(JSON.stringify(tempData));
      render();
  }

  // Re-sync every 5 secs
  setTimeout(syncCron, 1000);
}

function render() {
  var tableBody = document.querySelector('#table tbody');

  // Clears table
  tableBody.innerHTML = '';
  // Adding fields

  var row1 = document.createElement("tr");
  var head1 = document.createElement("th");
  var head2 = document.createElement("th");
  var head3 = document.createElement("th");
  var head4 = document.createElement("th");
  head1.innerText = "ID";
  head2.innerText = "Name";
  head3.innerText = "Des";
  head4.innerText = "Price";
  row1.appendChild(head1);
  row1.appendChild(head2);
  row1.appendChild(head3);
  row1.appendChild(head4);
  tableBody.appendChild(row1);

  for (const key in window.tableData) {
      // Creating elements
      var row = document.createElement("tr");
      var col1 = document.createElement("td");
      var col2 = document.createElement("td");
      var col3 = document.createElement("td");
      var col4 = document.createElement("td");

      // Add data to the new elements.

      col1.innerText = key;
      col2.innerText = window.tableData[key].name;
      col3.innerText = window.tableData[key].des;
      col4.innerText = window.tableData[key].pri;

      //Append the cells into the row and the row into the table body.

      row.appendChild(col1);
      row.appendChild(col2);
      row.appendChild(col3);
      row.appendChild(col4);
      tableBody.appendChild(row);

  }


}

// stackOverflow
function deepEqual(x, y) {
  if (x === y) {
      return true;
  } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
      if (Object.keys(x).length != Object.keys(y).length)
          return false;

      for (var prop in x) {
          if (y.hasOwnProperty(prop)) {
              if (!deepEqual(x[prop], y[prop]))
                  return false;
          }
          else
              return false;
      }

      return true;
  }
  else
      return false;
}





document.getElementById("form1").addEventListener("keyup", function(event) {
  event.preventDefault();
  if (event.keyCode === 13) {
      ids.disabled = true;
      ids.disabled = false;
      if (ids.value) {
          fetchdata_byID();
      } else {
          alert("No IDs found !");
      }

  }
});

function fetchdata_byID() {

  names.innerHTML = " ";
  dess.innerHTML = " ";
  pris.innerHTML = " ";
  w_name.value = " ";
  w_des.value = " ";
  w_pri.value = " ";
  firebase.database().ref().child("tab1").child(ids.value).child("name").on('value', function(snap) {
      names.innerHTML = snap.val();
  });
  firebase.database().ref().child("tab1").child(ids.value).child("des").on('value', function(snap) {
      dess.innerHTML = snap.val();
  });
  firebase.database().ref().child("tab1").child(ids.value).child("pri").on('value', function(snap) {
      pris.innerHTML = snap.val();
  });

}



let save = document.getElementById("write_dt")
save.addEventListener("click", (e) => {
  //Prevent Default Form Submission Behavior
  e.preventDefault()
  var temp_name;
  var temp_des;
  var temp_pri;

  if (ids.value) {

      if (w_name.value) {
          temp_name = w_name.value;
      } else {
          temp_name = names.innerHTML;
      }
      ;

      if (w_des.value) {
          temp_des = w_des.value;
      } else {
          temp_des = dess.innerHTML;
      }
      ;

      if (w_pri.value) {
          temp_pri = w_pri.value;
      } else {
          temp_pri = pris.innerHTML;
      }
      ;
      writeUserData(ids.value, temp_name, temp_des, temp_pri);
      console.log("Save changes");
      alert("Changed !");


  } else {
      alert("No IDs found !");
  }

})


function writeUserData(userId, namew, desw, priw) {
  firebase.database().ref('tab1/' + userId).set({
      name: namew,
      des: desw,
      pri: priw
  });
}

var pa = firebase.database().ref().child('tab1').orderByChild('card');
function fetchdata_byCard(card) {
  pa.equalTo(card).once('value', function(snapshot) {
      console.log(snapshot.exists());
      if (snapshot.exists()) {
          pa.equalTo(card).on("value", function(sap) {
              sap.forEach(function(data) {
                  data.forEach(function(test) {
                      var idss = test.key + 'c';
                      set_val_byID(data.key, test.key, document.getElementById(idss))
                  });
              });
          });
      } else {

          set_val_byID("state", "no_match", document.getElementById("cardc"));
          document.getElementById("namec").innerText = "";
          document.getElementById("desc").innerText = "";
          document.getElementById("pric").innerText = "";

      }

  });
}
function set_val_byID(name, child, id) {
  firebase.database().ref('tab1/' + name).child(child).on('value', function(snap) {
      id.innerText = snap.val();
  });
}

function listen(ext) {
  firebase.database().ref().child("key_temp").on('value', function(snap) {
      if (snap.val()) {
          fetchdata_byCard(snap.val());
      }
      ;
  });
}
;
document.getElementById("check").addEventListener("click", (e) => {
  firebase.database().ref().child("key_temp").remove();
  firebase.database().ref('function').set({
    switch: 1
});
  let bl;
  listen(bl);
});

document.getElementById("switch").addEventListener("click", (e) => {
  firebase.database().ref('function').set({
    switch: 0
});
});

// esp32 button

function led(state) {
  firebase.database().ref('button').set({
      led: state,
      switch: 0
  });
}
let img = document.querySelector('img');
let esp32Button = document.getElementById("esp32")
esp32Button.addEventListener("click", (e) => {
  
  //Prevent Default Form Submission Behavior
  e.preventDefault()
  if (document.getElementById("led2").innerHTML == 1) {
      led(0);
      img.src = 'assets/img/air-conditioner.png';
      esp32Button.style.color = "White";
      esp32Button.style.backgroundColor = "Black";
  } else {
      led(1);
      img.src = 'assets/img/air-conditioner-run.png';
      esp32Button.style.backgroundColor = "green";
      esp32Button.style.color = "White";
  }
          
  });

firebase.database().ref().child("button").child("led").on('value', function(snap) {
  document.getElementById("led2").innerHTML = snap.val();
  });
