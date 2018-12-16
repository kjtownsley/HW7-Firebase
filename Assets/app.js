$(document).ready(function() {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyC-MwZ_xFk0gVv0N3txNepew_PWEsh7hdw",
        authDomain: "train-scheduler-5de40.firebaseapp.com",
        databaseURL: "https://train-scheduler-5de40.firebaseio.com",
        projectId: "train-scheduler-5de40",
        storageBucket: "train-scheduler-5de40.appspot.com",
        messagingSenderId: "115810871520"
      };
      firebase.initializeApp(config);
    
      
        var database = firebase.database();
  

    $("#addTrain").on("click", function(event) {
      event.preventDefault();
  

      var trainName = $("#trainName").val().trim();
      var destination = $("#destination").val().trim();
      var firstTrainTime = $("#firstTrainTime").val().trim();
      var freq = $("#frequency").val().trim();
  

      database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: freq
      });
    });
  


    database.ref().on(
      "child_added",
      function(childSnapshot) {
        var newTrain = childSnapshot.val().trainName;
        var newLocation = childSnapshot.val().destination;
        var newFirstTrainTime = childSnapshot.val().firstTrainTime;
        var newFreq = childSnapshot.val().frequency;
  

        var startTime = moment(newFirstTrainTime, "hh:mm").subtract(1, "years");
  
        var currentTime = moment();
  
        var diffTime = moment().diff(moment(startTime), "minutes");
  
        var remainder = diffTime % newFreq;
  
        var minAway = newFreq - remainder;
  
        var nextTrain = moment().add(minAway, "minutes");
        var nextArrival = moment(nextTrain).format("HH:mm");


  
        $("#train-display").append(
          " <tr><td>" +
            newTrain +
            " </td><td>" +
            newLocation +
            " </td><td>" +
            newFreq +
            " </td><td>" +
            nextArrival +
            " </td><td>" +
            minAway +
            " </td></tr>"
        );

        $("#trainName, #destination, #firstTrainTime, #frequency").val("");
        return false;
      },


      function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
      }
    );
  });